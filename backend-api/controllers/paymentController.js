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
const { CFPaymentGateway, cfConfig } = require('../utils/cashfreeClient');
const {
    CFOrderRequest,
    CFCustomerDetails
} = require('cashfree-pg-sdk-nodejs');

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

        // ── Validate booking has all required fields ────────────────────────
        if (!amount || amount <= 0) {
            console.error('❌ Invalid amount:', amount);
            return res.status(400).json({
                message: 'Invalid booking amount',
                details: `Amount must be greater than 0, got: ${amount}`
            });
        }

        if (!booking.memberName) {
            console.error('❌ Missing member name for booking:', booking._id);
            return res.status(400).json({
                message: 'Booking is missing member name',
                details: 'Cannot proceed without member name'
            });
        }

        if (!booking.userId) {
            console.error('❌ Missing user ID for booking:', booking._id);
            return res.status(400).json({
                message: 'Booking is missing user ID',
                details: 'Cannot proceed without user information'
            });
        }

        if (!gym) {
            console.error('❌ Missing gym for booking:', booking._id);
            return res.status(400).json({
                message: 'Booking is missing gym information',
                details: 'Cannot proceed without gym details'
            });
        }

        // ── Full amount to admin account (no split) ────────────────────────
        console.log(`[Cashfree] Creating order ${orderId}: ₹${amount} for booking ${booking._id}`);

        // ── Build Cashfree request objects ──────────────────────────────────
        const customerDetails = new CFCustomerDetails();
        customerDetails.customerId = booking.userId?._id?.toString() || booking.userId?.toString();
        customerDetails.customerName = booking.memberName;
        customerDetails.customerEmail = booking.memberEmail || `user-${booking.userId}@gymkaana.local`;
        customerDetails.customerPhone = booking.userId?.phone || '9999999999';

        const cFOrderRequest = new CFOrderRequest();
        cFOrderRequest.orderAmount = amount;
        cFOrderRequest.orderCurrency = 'INR';
        cFOrderRequest.customerDetails = customerDetails;
        cFOrderRequest.orderNote = `Gymkaana booking — ${gym?.name || 'Gym'}`;
        cFOrderRequest.orderTags = {
            booking_id: booking._id?.toString(),
            gym_id: gym._id?.toString()
        };

        const orderMeta = {
            return_url: `${process.env.MARKETPLACE_URL || 'https://gymkaana.com'}/payment-result?order_id={order_id}`.replace('http://', 'https://'),
            notify_url: `${process.env.BACKEND_URL || 'https://api.gymkaana.com'}/api/payments/webhook`.replace('http://', 'https://')
        };
        
        // Manually set order_meta since CFOrderRequest may not have this property
        cFOrderRequest['order_meta'] = orderMeta;

        console.log('[Cashfree] Sending order request:', JSON.stringify({
            amount: cFOrderRequest.orderAmount,
            customerId: customerDetails.customerId,
            returnUrl: orderMeta.return_url
        }, null, 2));

        // ── Call Cashfree using official SDK ─────────────────────────────────
        let cfOrderResponse;
        try {
            const apiInstance = new CFPaymentGateway();
            cfOrderResponse = await apiInstance.orderCreate(cfConfig, cFOrderRequest);
            
            console.log('[Cashfree Order Response]', JSON.stringify({
                cfOrder: cfOrderResponse?.cfOrder,
                cfHeaders: cfOrderResponse?.cfHeaders
            }, null, 2));
        } catch (sdkError) {
            console.error('[Cashfree SDK Error]:', sdkError.message);
            throw sdkError;
        }

        const cfOrder = cfOrderResponse?.cfOrder;

        if (!cfOrder.orderId) {
            console.error('❌ Cashfree order creation failed - no orderId:', cfOrder);
            return res.status(500).json({
                message: 'Failed to create order with Cashfree',
                error: cfOrder
            });
        }

        // ── Payment Session is included in order response ────────────────────
        let paymentSessionId = cfOrder.paymentSessionId;
        
        if (!paymentSessionId) {
            console.error('❌ No paymentSessionId in Cashfree response:', {
                orderResponse: cfOrder,
                availableFields: Object.keys(cfOrder)
            });
            return res.status(500).json({
                message: 'Failed to get payment session from Cashfree',
                details: 'Cashfree response missing paymentSessionId',
                orderFields: Object.keys(cfOrder)
            });
        }

        // ── Persist Cashfree IDs to DB ──────────────────────────────────────
        booking.cashfreeOrderId  = cfOrder.orderId;
        booking.paymentSessionId = paymentSessionId;
        booking.paymentStatus    = 'PENDING';
        booking.vendorAmount     = 0;        // No split payment
        booking.platformFee      = amount;   // Full amount to admin
        await booking.save();

        console.log(`✅ Cashfree order created: ${cfOrder.orderId} | Session: ${paymentSessionId}`);

        return res.status(201).json({
            cashfreeOrderId:  cfOrder.orderId,
            paymentSessionId: paymentSessionId,
            paymentStatus:    'PENDING',
            amount,
            vendorAmount:     0,
            platformFee:      amount
        });

    } catch (err) {
        const errorMessage = err.message;
        const errorCode = err.code;

        console.error('❌ createOrder FAILED:', {
            error: errorMessage,
            code: errorCode,
            bookingId: req.body.bookingId,
            timestamp: new Date().toISOString()
        });

        // Handle Cashfree SDK errors
        if (err.statusCode) {
            return res.status(err.statusCode).json({
                message: 'Cashfree API Error',
                error: errorMessage,
                code: errorCode
            });
        }

        // Network or other error
        return res.status(500).json({
            message: 'Failed to create Cashfree order',
            error: errorMessage,
            details: 'Please check backend logs for details'
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
                const apiInstance = new CFPaymentGateway();
                const result = await apiInstance.orderFetch(cfConfig, orderId);
                const cfOrder = result?.cfOrder;
                
                // If Cashfree says it's PAID, we update everything locally now
                if (cfOrder?.orderStatus === 'PAID') {
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
        
        const CFRefundRequest = require('cashfree-pg-sdk-nodejs').CFRefundRequest;
        const refundRequest = new CFRefundRequest();
        refundRequest.refundAmount = booking.amount;
        refundRequest.refundId = refundId;
        refundRequest.refundNote = reason || 'Booking cancelled — refund by Gymkaana';

        try {
            const apiInstance = new CFPaymentGateway();
            const result = await apiInstance.refundCreate(
                cfConfig,
                booking.cashfreeOrderId,
                refundRequest
            );
            
            const refund = result?.cfRefund;

            booking.refundId      = refund?.refundId || refundId;
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
        } catch (sdkErr) {
            console.error('❌ Refund API error:', sdkErr.message);
            throw sdkErr;
        }
    } catch (err) {
        console.error('❌ triggerRefund error:', err.response?.data || err.message);
        return res.status(500).json({
            message: 'Refund failed',
            error:   err.response?.data || err.message
        });
    }
};
