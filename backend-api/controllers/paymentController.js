/**
 * paymentController.js
 * ─────────────────────
 * Handles all Cashfree + EasySplit operations for Gymkaana:
 *   - createOrder        → POST /api/payments/create-order
 *   - verifyWebhook      → POST /api/payments/webhook
 *   - getPaymentStatus   → GET  /api/payments/status/:orderId
 *   - registerVendor     → POST /api/payments/vendors/register
 *   - triggerRefund      → POST /api/payments/refund
 */

const crypto    = require('crypto');
const Booking   = require('../models/Booking');
const Gym       = require('../models/Gym');
const cashfree  = require('../utils/cashfreeClient');

// ─── helpers ──────────────────────────────────────────────────────────────────
// NOTE: commission is now read per-gym from gym.commissionPercent (default 15%)
// Set it per-gym via PATCH /api/gyms/:id { commissionPercent: 12 }

function generateOrderId() {
    const date      = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `GYM-${date}-${randomStr}`;
}

// ─── 1. Create Cashfree Order (with EasySplit) ────────────────────────────────
/**
 * POST /api/payments/create-order
 * Body: { bookingId }
 *
 * Uses the bookingId from your DB (already created as PENDING) to build
 * the Cashfree order payload, including split to the gym's vendor account.
 */
exports.createOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ message: 'bookingId is required' });
        }

        // Load booking + gym (need cashfreeVendorId and owner phone for CF)
        const booking = await Booking.findById(bookingId)
            .populate({ path: 'gymId', populate: { path: 'ownerId', select: 'phone' } })
            .populate('userId', 'phone');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check status
        if (booking.paymentStatus === 'SUCCESS') {
            return res.status(400).json({ message: 'Payment already completed for this booking' });
        }
        if (booking.paymentStatus === 'REFUNDED') {
            return res.status(400).json({ message: 'This booking has been refunded' });
        }

        // We always generate a fresh Cashfree order here to avoid "session expired" errors
        // during retries. Cashfree sessions only last about 60 minutes.
        if (booking.paymentStatus === 'REFUNDED') {
            return res.status(400).json({ message: 'This booking has been refunded' });
        }

        const gym = booking.gymId;
        const amount           = booking.amount;
        const commission       = typeof gym?.commissionPercent === 'number' ? gym.commissionPercent : 15;
        const vendorAmount     = parseFloat((amount * (1 - commission / 100)).toFixed(2));
        const platformFee      = parseFloat((amount - vendorAmount).toFixed(2));
        const orderId          = generateOrderId();

        console.log(`[Cashfree] Commission for ${gym?.name}: ${commission}% | Vendor: ₹${vendorAmount} | Platform: ₹${platformFee}`);

        // ── Build Cashfree payload ──────────────────────────────────────────
        const orderPayload = {
            order_id:       orderId,
            order_amount:   amount,
            order_currency: 'INR',
            customer_details: {
                customer_id:    booking.userId?._id?.toString() || booking.userId?.toString(),
                customer_name:  booking.memberName,
                customer_email: booking.memberEmail,
                customer_phone: booking.userId?.phone || '9999999999' // CF requires phone
            },
            order_meta: {
                return_url: `${process.env.MARKETPLACE_URL || 'https://gymkaana.com'}/payment-result?order_id={order_id}`
            },
            order_note: `Gymkaana booking — ${gym?.name || 'Gym'}`
        };

        // ── Attach EasySplit only if vendor is ACTIVE ───────────────────────
        if (gym?.cashfreeVendorId && gym?.cashfreeVendorStatus === 'ACTIVE') {
            orderPayload.order_splits = [
                {
                    vendor_id: gym.cashfreeVendorId,
                    amount:    vendorAmount
                    // remaining platformFee auto-stays with Gymkaana's account
                }
            ];
            console.log(`[Cashfree] Split → Vendor ${gym.cashfreeVendorId}: ₹${vendorAmount}, Platform: ₹${platformFee}`);
        } else {
            console.warn(`[Cashfree] ⚠ No active vendor for gym ${gym?._id} — full amount held in platform account`);
        }

        // ── Call Cashfree ───────────────────────────────────────────────────
        const { data: cfOrder } = await cashfree.post('/orders', orderPayload);

        // ── Persist Cashfree IDs to DB ──────────────────────────────────────
        booking.cashfreeOrderId  = cfOrder.order_id;
        booking.paymentSessionId = cfOrder.payment_session_id;
        booking.paymentStatus    = 'PENDING';
        booking.cashfreeVendorId = gym?.cashfreeVendorId || null;
        booking.vendorAmount     = vendorAmount;
        booking.platformFee      = platformFee;
        await booking.save();

        console.log(`✅ Cashfree order created: ${cfOrder.order_id} for booking ${bookingId}`);

        return res.status(201).json({
            cashfreeOrderId:  cfOrder.order_id,
            paymentSessionId: cfOrder.payment_session_id,
            paymentStatus:    'PENDING',
            amount,
            vendorAmount,
            platformFee
        });

    } catch (err) {
        console.error('❌ createOrder error:', err.response?.data || err.message);
        return res.status(500).json({
            message: 'Failed to create Cashfree order',
            error:   err.response?.data || err.message
        });
    }
};

// ─── 2. Webhook Handler ───────────────────────────────────────────────────────
/**
 * POST /api/payments/webhook
 * Cashfree POSTs payment events here.
 *
 * IMPORTANT: This route uses express.raw() (not express.json()) so the
 * rawBody Buffer is available for HMAC signature verification.
 */
exports.verifyWebhook = async (req, res) => {
    // ── Always respond 200 first to acknowledge receipt ─────────────────────
    // Cashfree will retry if it gets a non-200. We acknowledge immediately
    // and process asynchronously.
    res.sendStatus(200);

    try {
        const rawBody      = req.body;                          // Buffer (express.raw)
        const receivedSig  = req.headers['x-webhook-signature'];
        const timestamp    = req.headers['x-webhook-timestamp'];

        // ── Signature verification ─────────────────────────────────────────
        if (!receivedSig || !timestamp) {
            console.warn('[Webhook] Missing signature or timestamp headers — ignoring');
            return;
        }

        const secretKey      = process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_SECRET_KEY;
        const signatureInput = timestamp + rawBody.toString('utf8');

        const expectedSig = crypto
            .createHmac('sha256', secretKey)
            .update(signatureInput)
            .digest('base64');

        if (expectedSig !== receivedSig) {
            console.warn('[Webhook] ⚠ Signature mismatch — ignoring event');
            return;
        }

        const event = JSON.parse(rawBody.toString('utf8'));
        const { type, data } = event;

        console.log(`[Webhook] ▶ Event: ${type} | Order: ${data?.order?.order_id}`);

        // ── Route to handler based on event type ───────────────────────────
        switch (type) {
            case 'PAYMENT_SUCCESS_WEBHOOK':
                await handlePaymentSuccess(data);
                break;
            case 'PAYMENT_FAILED_WEBHOOK':
            case 'PAYMENT_USER_DROPPED_WEBHOOK':
                await handlePaymentFailed(data, type);
                break;
            case 'REFUND_STATUS_WEBHOOK':
                await handleRefundStatus(data);
                break;
            default:
                console.log(`[Webhook] Unhandled event type: ${type}`);
        }

    } catch (err) {
        console.error('[Webhook] Processing error:', err.message);
    }
};

// ── Webhook sub-handlers ───────────────────────────────────────────────────────
async function handlePaymentSuccess(data) {
    const orderId = data?.order?.order_id;
    if (!orderId) return;

    const booking = await Booking.findOne({ cashfreeOrderId: orderId });
    if (!booking) {
        console.warn(`[Webhook] Booking not found for orderId: ${orderId}`);
        return;
    }

    // Idempotency guard
    if (booking.paymentStatus === 'SUCCESS') {
        console.log(`[Webhook] Already processed SUCCESS for ${orderId}`);
        return;
    }

    booking.paymentStatus  = 'SUCCESS';
    booking.status         = 'upcoming';   // activate the membership
    booking.paidAt         = new Date();
    booking.webhookPayload = data;
    await booking.save();

    console.log(`✅ [Webhook] Payment SUCCESS → Booking ${booking._id} activated`);

    // ── Fire confirmation emails (non-blocking) ─────────────────────────────
    try {
        const populated = await Booking.findById(booking._id)
            .populate({ path: 'gymId', populate: { path: 'ownerId' } })
            .populate('planId')
            .populate('userId');

        const { sendBookingConfirmation, sendOwnerBookingNotification } = require('../utils/emailService');

        sendBookingConfirmation(populated.memberEmail, populated).catch(e =>
            console.error('❌ Member email failed:', e.message)
        );

        const ownerEmail = populated.gymId?.ownerId?.email || populated.gymId?.email;
        if (ownerEmail) {
            sendOwnerBookingNotification(ownerEmail, populated).catch(e =>
                console.error('❌ Owner email failed:', e.message)
            );
        }
    } catch (mailErr) {
        console.error('⚠ Email trigger failed:', mailErr.message);
    }
}

async function handlePaymentFailed(data, type) {
    const orderId = data?.order?.order_id;
    if (!orderId) return;

    const booking = await Booking.findOne({ cashfreeOrderId: orderId });
    if (!booking) return;

    booking.paymentStatus  = type === 'PAYMENT_USER_DROPPED_WEBHOOK' ? 'USER_DROPPED' : 'FAILED';
    booking.webhookPayload = data;
    // Keep booking.status as 'upcoming' — let user retry payment
    await booking.save();

    console.log(`⚠ [Webhook] Payment ${booking.paymentStatus} → Booking ${booking._id}`);
}

async function handleRefundStatus(data) {
    const orderId  = data?.order?.order_id;
    const refundId = data?.refund?.refund_id;
    if (!orderId) return;

    const booking = await Booking.findOne({ cashfreeOrderId: orderId });
    if (!booking) return;

    const cfStatus = data?.refund?.refund_status;  // PENDING | SUCCESS | CANCELLED
    booking.refundStatus   = cfStatus || 'PENDING';
    booking.refundId       = refundId;
    booking.webhookPayload = data;

    if (cfStatus === 'SUCCESS') {
        booking.paymentStatus = 'REFUNDED';
        booking.status        = 'cancelled';
    }

    await booking.save();
    console.log(`✅ [Webhook] Refund ${cfStatus} → Booking ${booking._id}`);
}

// ─── 3. Poll Payment Status ───────────────────────────────────────────────────
/**
 * GET /api/payments/status/:orderId
 * Frontend polls this after redirect from Cashfree checkout.
 */
exports.getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const booking = await Booking.findOne({ cashfreeOrderId: orderId })
            .select('cashfreeOrderId paymentStatus status memberName memberEmail amount gymId planId startDate endDate');

        if (!booking) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.json({
            cashfreeOrderId: booking.cashfreeOrderId,
            paymentStatus:   booking.paymentStatus,
            bookingStatus:   booking.status,
            amount:          booking.amount,
            startDate:       booking.startDate,
            endDate:         booking.endDate
        });

    } catch (err) {
        console.error('❌ getPaymentStatus error:', err.message);
        return res.status(500).json({ message: err.message });
    }
};

// ─── 4. Register EasySplit Vendor ─────────────────────────────────────────────
/**
 * POST /api/payments/vendors/register
 * Body: { gymId }
 *
 * Registers the gym's bank account with Cashfree EasySplit.
 * The gym must have bankDetails and kycDetails already on record.
 * Result: sets gym.cashfreeVendorId and gym.cashfreeVendorStatus = 'PENDING'
 */
exports.registerVendor = async (req, res) => {
    try {
        const { gymId } = req.body;

        const gym = await Gym.findOne({ _id: gymId, ownerId: req.user._id });
        if (!gym) {
            return res.status(404).json({ message: 'Gym not found' });
        }

        if (!gym.bankDetails?.accountNumber || !gym.bankDetails?.ifscCode) {
            return res.status(400).json({ message: 'Please complete bank details before registering as vendor' });
        }

        if (gym.cashfreeVendorStatus === 'ACTIVE') {
            return res.json({ message: 'Vendor already active', vendorId: gym.cashfreeVendorId });
        }

        const vendorPayload = {
            vendor_id:   `GYMKAANA-${gym._id}`,
            status:      'ACTIVE',
            name:        gym.name,
            email:       gym.email || req.user?.email,
            phone:       gym.phone || '9999999999',
            bank_account: {
                account_holder_name: gym.bankDetails.accountName,
                account_number:      gym.bankDetails.accountNumber,
                ifsc:                gym.bankDetails.ifscCode
            },
            kyc_details: {
                pan: gym.kycDetails?.panNumber || undefined
            }
        };

        const isSandbox  = (process.env.CASHFREE_ENV || 'sandbox') === 'sandbox';
        const vendorUrl  = isSandbox
            ? 'https://sandbox.cashfree.com/api/v2/easy-split/vendors'
            : 'https://api.cashfree.com/api/v2/easy-split/vendors';

        const axios = require('axios');
        const { data: vendor } = await axios.post(vendorUrl, vendorPayload, {
            headers: {
                'X-Client-Id':     process.env.CASHFREE_APP_ID,
                'X-Client-Secret': process.env.CASHFREE_SECRET_KEY,
                'Content-Type':    'application/json'
            }
        });

        gym.cashfreeVendorId     = vendor.vendor_id || `GYMKAANA-${gym._id}`;
        gym.cashfreeVendorStatus = 'PENDING';
        await gym.save();

        console.log(`✅ Vendor registered: ${gym.cashfreeVendorId} for gym ${gym.name}`);
        return res.status(201).json({
            message:      'Vendor registration submitted — pending Cashfree KYC approval',
            vendorId:     gym.cashfreeVendorId,
            vendorStatus: gym.cashfreeVendorStatus
        });

    } catch (err) {
        console.error('❌ registerVendor error:', err.response?.data || err.message);
        return res.status(500).json({
            message: 'Vendor registration failed',
            error:   err.response?.data || err.message
        });
    }
};

// ─── 5. Trigger Refund ────────────────────────────────────────────────────────
/**
 * POST /api/payments/refund
 * Body: { bookingId, reason }
 *
 * Triggers a full refund for a booking via the Cashfree Refunds API.
 * Only allowed if paymentStatus === 'SUCCESS'.
 */
exports.triggerRefund = async (req, res) => {
    try {
        const { bookingId, reason } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.paymentStatus !== 'SUCCESS') {
            return res.status(400).json({ message: `Cannot refund — payment status is "${booking.paymentStatus}"` });
        }

        if (booking.refundStatus === 'SUCCESS') {
            return res.status(400).json({ message: 'Refund already processed' });
        }

        const refundId      = `REFUND-${booking._id}-${Date.now()}`;
        const refundPayload = {
            refund_amount: booking.amount,
            refund_id:     refundId,
            refund_note:   reason || 'Booking cancelled — refund by Gymkaana'
        };

        const { data: refund } = await cashfree.post(
            `/orders/${booking.cashfreeOrderId}/refunds`,
            refundPayload
        );

        booking.refundId      = refund.refund_id || refundId;
        booking.refundStatus  = 'PENDING';
        booking.refundAmount  = booking.amount;
        booking.status        = 'cancelled';
        await booking.save();

        console.log(`✅ Refund initiated: ${booking.refundId} for booking ${booking._id}`);
        return res.json({
            message:      'Refund initiated — you will receive a webhook confirmation',
            refundId:     booking.refundId,
            refundStatus: 'PENDING',
            refundAmount: booking.amount
        });

    } catch (err) {
        console.error('❌ triggerRefund error:', err.response?.data || err.message);
        return res.status(500).json({
            message: 'Refund failed',
            error:   err.response?.data || err.message
        });
    }
};
