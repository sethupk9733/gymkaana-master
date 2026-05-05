/**
 * paymentController.js
 * ─────────────────────
 * Handles all Cashfree payment operations for Gymkaana:
 *   - createOrder        → POST /api/payments/create-order
 *   - verifyWebhook      → POST /api/payments/webhook
 *   - getPaymentStatus   → GET  /api/payments/status/:orderId
 *   - registerVendor     → POST /api/payments/vendors/register
 *   - triggerRefund      → POST /api/payments/refund
 * 
 * NOTE: Direct payments to admin account - no EasySplit
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
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `GK-${date}-${randomStr}`;
}

// ─── 1. Create Cashfree Order (Direct Admin Payment, No EasySplit) ──────────────────
/**
 * POST /api/payments/create-order
 * Body: { bookingId }
 *
 * Creates a Cashfree order with FULL AMOUNT going directly to admin account.
 * No payment splitting to gym vendors.
 */
exports.createOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ message: 'bookingId is required' });
        }

        // Load booking + gym
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

        const gym = booking.gymId;
        const amount = booking.amount;
        const orderId = generateOrderId();

        // ── Full amount to admin account (no split) ────────────────────────
        console.log(`[Cashfree] Order ${orderId}: Full amount ₹${amount} → Admin Account`);

        // ── Build Cashfree payload (NO order_splits) ────────────────────────
        const orderPayload = {
            order_id:       orderId,
            order_amount:   amount,
            order_currency: 'INR',
            customer_details: {
                customer_id:    booking.userId?._id?.toString() || booking.userId?.toString(),
                customer_name:  booking.memberName,
                customer_email: booking.memberEmail || `user-${booking.userId}@gymkaana.local`,
                customer_phone: booking.userId?.phone || '9999999999'
            },
            order_meta: {
                return_url: `${process.env.MARKETPLACE_URL || 'http://localhost:5176'}/payment-result?order_id={order_id}`,
                notify_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/webhook`
            },
            order_note: `Gymkaana booking — ${gym?.name || 'Gym'}`,
            order_tags: {
                booking_id: booking._id?.toString(),
                gym_id: gym._id?.toString()
            }
        };

        // Validate payload before sending
        if (!orderPayload.order_id || !orderPayload.order_amount) {
            console.error('❌ Invalid order payload:', orderPayload);
            return res.status(400).json({
                message: 'Invalid order data',
                details: 'order_id and order_amount are required'
            });
        }

        if (!orderPayload.customer_details.customer_email || !orderPayload.customer_details.customer_email.includes('@')) {
            console.warn('[Cashfree] Using fallback email:', orderPayload.customer_details.customer_email);
        }

        console.log('[Cashfree] Sending order payload:', JSON.stringify(orderPayload, null, 2));

        // ── Call Cashfree ───────────────────────────────────────────────────
        const { data: cfOrder } = await cashfree.post('/orders', orderPayload);

        console.log('[Cashfree Order Response]', JSON.stringify(cfOrder, null, 2));

        if (!cfOrder.order_id) {
            console.error('❌ Cashfree order creation failed - no order_id:', cfOrder);
            return res.status(500).json({
                message: 'Failed to create order with Cashfree',
                error: cfOrder
            });
        }

        // ── Create Payment Session ─────────────────────────────────────────
        let paymentSessionId = cfOrder.payment_session_id;
        
        if (!paymentSessionId) {
            console.log(`[Cashfree] Creating payment session for order ${cfOrder.order_id}`);
            try {
                // Cashfree 2023-08-01 API: Create session with minimal payload
                const { data: sessionResponse } = await cashfree.post(
                    `/orders/${cfOrder.order_id}/sessions`,
                    {}  // Empty body - Cashfree will generate session
                );
                paymentSessionId = sessionResponse.payment_session_id;
                console.log('[Cashfree Session Response]', JSON.stringify(sessionResponse, null, 2));
            } catch (sessionErr) {
                console.error('[Cashfree] Session creation failed:', {
                    status: sessionErr.response?.status,
                    error: sessionErr.response?.data,
                    message: sessionErr.message
                });
                
                // Try fallback: check if session was created but response structure is different
                try {
                    const { data: orderStatus } = await cashfree.get(`/orders/${cfOrder.order_id}`);
                    console.log('[Cashfree] Order status check:', orderStatus);
                    paymentSessionId = orderStatus.payment_session_id;
                } catch (fallbackErr) {
                    console.error('[Cashfree] Fallback also failed:', fallbackErr.message);
                }
            }
        }
        
        if (!paymentSessionId) {
            console.error('❌ No payment_session_id obtained:', {
                orderResponse: cfOrder,
                availableFields: Object.keys(cfOrder)
            });
            return res.status(500).json({
                message: 'Failed to get payment session from Cashfree',
                details: 'After multiple attempts, payment_session_id could not be obtained',
                orderFields: Object.keys(cfOrder)
            });
        }

        // ── Persist Cashfree IDs to DB ──────────────────────────────────────
        booking.cashfreeOrderId  = cfOrder.order_id;
        booking.paymentSessionId = paymentSessionId;
        booking.paymentStatus    = 'PENDING';
        booking.vendorAmount     = 0;        // No split payment
        booking.platformFee      = amount;   // Full amount to admin
        await booking.save();

        console.log(`✅ Cashfree order created: ${cfOrder.order_id} | Session: ${paymentSessionId}`);

        return res.status(201).json({
            cashfreeOrderId:  cfOrder.order_id,
            paymentSessionId: paymentSessionId,
            paymentStatus:    'PENDING',
            amount,
            vendorAmount:     0,
            platformFee:      amount
        });

    } catch (err) {
        const errorData = err.response?.data;
        const errorStatus = err.response?.status;
        const errorMessage = err.message;

        console.error('❌ createOrder error details:', {
            status: errorStatus,
            message: errorMessage,
            response: errorData,
            headers: err.response?.headers,
            cashfreeEnv: process.env.CASHFREE_ENV || 'sandbox',
            hasAppId: !!process.env.CASHFREE_APP_ID,
            hasSecret: !!process.env.CASHFREE_SECRET_KEY
        });

        return res.status(500).json({
            message: 'Failed to create Cashfree order',
            error: errorData?.message || errorMessage,
            details: errorData || {},
            status: errorStatus
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
        const receivedSig  = req.headers['x-webhook-signature'];
        const timestamp    = req.headers['x-webhook-timestamp'];
        const rawBody      = req.body; // express.raw buffer

        if (!receivedSig || !timestamp) {
            console.warn('[Webhook] Missing X-Webhook-Signature or X-Webhook-Timestamp');
            return;
        }

        if (!rawBody || !(rawBody instanceof Buffer)) {
            console.error('[Webhook] FATAL: req.body is not a Buffer. Check express.raw order in server.js');
            return;
        }

        const secretKey      = process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_SECRET_KEY;
        const signatureInput = timestamp + rawBody.toString('utf8');

        const expectedSig = crypto
            .createHmac('sha256', secretKey)
            .update(signatureInput)
            .digest('base64');

        if (expectedSig !== receivedSig) {
            console.warn('[Webhook] ⚠ Signature Mismatch!');
            console.warn(`[Webhook] Expected: ${expectedSig.substring(0, 10)}...`);
            console.warn(`[Webhook] Received: ${receivedSig.substring(0, 10)}...`);
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

        const booking = await Booking.findOne({ cashfreeOrderId: orderId });

        if (!booking) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // If local status is PENDING, we CRITICALLY need to verify with Cashfree directly
        // in case the webhook was missed or delayed.
        if (booking.paymentStatus === 'PENDING') {
            console.log(`[StatusCheck] Re-verifying order ${orderId} with Cashfree...`);
            try {
                const { data: cfOrder } = await cashfree.get(`/orders/${orderId}`);
                
                // If Cashfree says it's PAID, we update everything locally now
                if (cfOrder.order_status === 'PAID') {
                    console.log(`[StatusCheck] Order ${orderId} confirmed PAID by API. Updating DB...`);
                    
                    booking.paymentStatus = 'SUCCESS';
                    booking.status        = 'upcoming';
                    booking.paidAt        = new Date();
                    await booking.save();
                    
                    // Trigger emails if they haven't been sent
                    // (The handlePaymentSuccess logic is reused here)
                    const populated = await Booking.findById(booking._id)
                        .populate({ path: 'gymId', populate: { path: 'ownerId' } })
                        .populate('planId')
                        .populate('userId');

                    const { sendBookingConfirmation, sendOwnerBookingNotification } = require('../utils/emailService');
                    sendBookingConfirmation(populated.memberEmail, populated).catch(e => console.error(e));
                    const ownerEmail = populated.gymId?.ownerId?.email || populated.gymId?.email;
                    if (ownerEmail) sendOwnerBookingNotification(ownerEmail, populated).catch(e => console.error(e));
                }
            } catch (cfErr) {
                console.error('[StatusCheck] Cashfree API check failed:', cfErr.response?.data || cfErr.message);
            }
        }

        return res.json({
            status:          booking.paymentStatus, // For frontend compatibility
            paymentStatus:   booking.paymentStatus,
            bookingStatus:   booking.status,
            amount:          booking.amount,
            startDate:       booking.startDate,
            endDate:         booking.endDate,
            booking:         booking // Full object for success screen
        });

    } catch (err) {
        console.error('❌ getPaymentStatus error:', err.message);
        return res.status(500).json({ message: err.message });
    }
};

// ─── 4. Register EasySplit Vendor (DEPRECATED - Direct Admin Payments) ─────────────
/**
 * POST /api/payments/vendors/register
 * 
 * DEPRECATED: No longer used since payment system switched to direct admin payments.
 * All payments now go directly to admin account (no EasySplit).
 * 
 * Legacy: Previously registered gym's bank account with Cashfree EasySplit.
 */
exports.registerVendor = async (req, res) => {
    try {
        return res.status(400).json({ 
            message: 'Vendor registration deprecated',
            info: 'All payments are now processed directly to admin account. EasySplit is no longer used.'
        });

    } catch (err) {
        console.error('❌ registerVendor error:', err.message);
        return res.status(500).json({
            message: 'Operation not available',
            error: err.message
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
