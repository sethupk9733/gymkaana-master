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
        
        // Set properties using both camelCase and snake_case (SDK auto-generates from OpenAPI)
        cFOrderRequest.orderAmount = amount;
        cFOrderRequest.orderCurrency = 'INR';
        cFOrderRequest.customerId = booking.userId?._id?.toString() || booking.userId?.toString();
        cFOrderRequest.customerDetails = customerDetails;
        cFOrderRequest.orderNote = `Gymkaana booking — ${gym?.name || 'Gym'}`;
        cFOrderRequest.orderTags = {
            booking_id: booking._id?.toString(),
            gym_id: gym._id?.toString()
        };

        // The SDK serializes to snake_case for the API, but we can also set them directly
        cFOrderRequest['order_id'] = orderId;
        cFOrderRequest['order_meta'] = {
            return_url: `${process.env.MARKETPLACE_URL || 'https://gymkaana.com'}/payment-result?order_id={order_id}`.replace('http://', 'https://'),
            notify_url: `${process.env.BACKEND_URL || 'https://api.gymkaana.com'}/api/payments/webhook`.replace('http://', 'https://')
        };

        console.log('[Cashfree] Order Request Properties:', {
            orderId: cFOrderRequest['order_id'],
            amount: cFOrderRequest.orderAmount,
            currency: cFOrderRequest.orderCurrency,
            customerId: customerDetails.customerId,
            allKeys: Object.keys(cFOrderRequest)
        });

        // ── Call Cashfree using official SDK ─────────────────────────────────
        let cfOrderResponse;
        try {
            const apiInstance = new CFPaymentGateway();
            console.log('[Cashfree] Calling orderCreate with config:', {
                env: process.env.CASHFREE_ENV,
                hasAppId: !!process.env.CASHFREE_APP_ID,
                hasSecret: !!process.env.CASHFREE_SECRET_KEY
            });
            
            cfOrderResponse = await apiInstance.orderCreate(cfConfig, cFOrderRequest);
            
            console.log('[Cashfree] Full SDK Response:', JSON.stringify(cfOrderResponse, null, 2));
            if (cfOrderResponse?.cfOrder) {
                console.log('[Cashfree] cfOrder keys:', Object.keys(cfOrderResponse.cfOrder));
                // Try to extract session ID with various naming conventions
                const possibleNames = [
                    'paymentSessionId', 'payment_session_id',
                    'sessionId', 'session_id', 
                    'cf_payment_session_id', 'cfPaymentSessionId'
                ];
                console.log('[Cashfree] Checking for payment session ID:', possibleNames.map(name => ({
                    name,
                    value: cfOrderResponse.cfOrder[name]
                })));
            }
        } catch (sdkError) {
            console.error('[Cashfree SDK Error]:', {
                message: sdkError.message,
                code: sdkError.code,
                statusCode: sdkError.statusCode,
                response: sdkError.response?.data || sdkError.response,
                fullError: JSON.stringify(sdkError, null, 2)
            });
            throw sdkError;
        }

        const cfOrder = cfOrderResponse?.cfOrder;

        if (!cfOrder) {
            console.error('❌ No cfOrder in response. Full response:', cfOrderResponse);
            return res.status(500).json({
                message: 'Invalid response from Cashfree',
                error: 'No order object in SDK response'
            });
        }

        // Try to extract values with all possible naming conventions
        let paymentSessionId = cfOrder.paymentSessionId || 
                              cfOrder.payment_session_id || 
                              cfOrder.cf_payment_session_id ||
                              cfOrder.cfPaymentSessionId;
        
        let orderIdFromCf = cfOrder.orderId || cfOrder.order_id;
        
        console.log('[Cashfree] Extracted values:', {
            paymentSessionId,
            orderIdFromCf,
            cfOrderKeys: Object.keys(cfOrder)
        });

        if (!orderIdFromCf) {
            console.error('❌ No order ID in response');
            return res.status(500).json({
                message: 'Order creation failed',
                availableFields: Object.keys(cfOrder)
            });
        }

        if (!paymentSessionId) {
            console.error('❌ No payment session ID in response');
            return res.status(500).json({
                message: 'Payment session not created',
                availableFields: Object.keys(cfOrder),
                suggestion: 'Check Cashfree credentials in .env'
            });
        }

        // ── Persist Cashfree IDs to DB ──────────────────────────────────────
        booking.cashfreeOrderId  = orderIdFromCf;
        booking.paymentSessionId = paymentSessionId;
        booking.paymentStatus    = 'PENDING';
        booking.vendorAmount     = 0;
        booking.platformFee      = amount;
        await booking.save();

        console.log(`✅ Cashfree order created: ${orderIdFromCf} | Session: ${paymentSessionId}`);

        return res.status(201).json({
            cashfreeOrderId:  orderIdFromCf,
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

        const secretKey = process.env.CASHFREE_WEBHOOK_SECRET;
        
        if (!secretKey) {
            console.error('[Webhook] CRITICAL: CASHFREE_WEBHOOK_SECRET not set in .env');
            return;
        }

        const signatureInput = timestamp + rawBody.toString('utf8');

        const expectedSigBase64 = crypto
            .createHmac('sha256', secretKey)
            .update(signatureInput)
            .digest('base64');
            
        const expectedSigHex = crypto
            .createHmac('sha256', secretKey)
            .update(signatureInput)
            .digest('hex');

        const matchBase64 = expectedSigBase64 === receivedSig;
        const matchHex = expectedSigHex === receivedSig;

        console.log('[Webhook] Signature verification details:', {
            timestamp: timestamp,
            receivedSig: receivedSig.substring(0, 10) + '...',
            matchBase64,
            matchHex
        });

        if (!matchBase64 && !matchHex) {
            console.warn('[Webhook] ⚠ Signature Mismatch! Webhook potentially insecure or secretKey invalid.');
            console.warn(`[Webhook] Expected (Base64): ${expectedSigBase64}`);
            console.warn(`[Webhook] Expected (Hex): ${expectedSigHex}`);
            console.warn(`[Webhook] Received: ${receivedSig}`);
            // In development, we might allow it, but in production we must block.
            // However, to debug, let's just log it and RETURN for now.
            return;
        }

        const expectedSig = matchHex ? expectedSigHex : expectedSigBase64;

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

        // Gamification Points
        try {
            const pointsEngine = require('../utils/pointsEngine');
            const isTrial = populated.planId?.name?.toLowerCase().includes('day') || 
                            populated.planId?.name?.toLowerCase().includes('trial') || 
                            populated.planId?.sessions === 1;
            const actionType = isTrial ? 'BOOK_TRIAL' : 'PURCHASE_MEMBERSHIP';
            await pointsEngine.awardPoints(populated.userId._id || populated.userId, actionType, populated._id, 'Booking');
        } catch (e) {
            console.error('Gamification points error:', e.message);
        }

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
            return res.status(404).json({ 
                message: 'Order not found',
                status: 'NOT_FOUND',
                paymentStatus: 'NOT_FOUND'
            });
        }

        // If local status is PENDING, verify with Cashfree directly
        // to catch cancelled or failed payments
        if (booking.paymentStatus === 'PENDING') {
            console.log(`[StatusCheck] Verifying PENDING order ${orderId} with Cashfree API...`);
            try {
                // Use direct API call instead of SDK method that may not exist
                const axios = require('axios');
                
                // Auto-detect environment based on App ID prefix
                const isSandbox = (process.env.CASHFREE_APP_ID || '').startsWith('TEST');
                const baseURL = isSandbox ? 'https://sandbox.cashfree.com' : 'https://api.cashfree.com';
                
                console.log(`[StatusCheck] Using ${isSandbox ? 'SANDBOX' : 'PRODUCTION'} URL: ${baseURL}`);

                const response = await axios.get(`${baseURL}/pg/orders/${orderId}`, {
                    headers: {
                        'x-api-version': '2022-09-01',
                        'x-client-id': process.env.CASHFREE_APP_ID,
                        'x-client-secret': process.env.CASHFREE_SECRET_KEY
                    },
                    validateStatus: () => true // Allow us to handle 4xx/5xx responses manually
                });
                
                if (response.status !== 200) {
                    console.error(`❌ [StatusCheck] Cashfree API returned ${response.status}:`, response.data);
                    // On 404, we might want to check if we're hitting the wrong environment
                    if (response.status === 404) {
                        console.warn(`[StatusCheck] Order ${orderId} not found. Check if keys match the environment (isSandbox: ${isSandbox})`);
                    }
                }

                const cfOrder = response.data;
                const cfStatus = (cfOrder?.order_status || '').toUpperCase();
                const payStatus = (cfOrder?.payment_status || '').toUpperCase();

                console.log(`[StatusCheck] Cashfree response for ${orderId}:`, {
                    orderStatus: cfStatus,
                    paymentStatus: payStatus,
                    cf_payment_id: cfOrder?.cf_payment_id,
                    rawResponse: cfOrder
                });
                
                const isSuccess = ['PAID', 'SUCCESS', 'COMPLETED'].includes(cfStatus) ||
                                  ['SUCCESS'].includes(payStatus);
                
                if (isSuccess) {
                    console.log(`✅ [StatusCheck] Order ${orderId} PAID - Updating booking...`);
                    
                    booking.paymentStatus = 'SUCCESS';
                    booking.status        = 'upcoming';
                    booking.paidAt        = new Date();
                    await booking.save();
                    
                    // Send confirmation emails
                    try {
                        const populated = await Booking.findById(booking._id)
                            .populate({ path: 'gymId', populate: { path: 'ownerId' } })
                            .populate('planId')
                            .populate('userId');

                        const { sendBookingConfirmation, sendOwnerBookingNotification } = require('../utils/emailService');
                        sendBookingConfirmation(populated.memberEmail, populated).catch(e => 
                            console.error('❌ Member email failed:', e.message)
                        );

                        // Gamification Points
                        try {
                            const pointsEngine = require('../utils/pointsEngine');
                            const isTrial = populated.planId?.name?.toLowerCase().includes('day') || 
                                            populated.planId?.name?.toLowerCase().includes('trial') || 
                                            populated.planId?.sessions === 1;
                            const actionType = isTrial ? 'BOOK_TRIAL' : 'PURCHASE_MEMBERSHIP';
                            await pointsEngine.awardPoints(populated.userId._id || populated.userId, actionType, populated._id, 'Booking');
                        } catch (e) {
                            console.error('Gamification points error:', e.message);
                        }

                        const ownerEmail = populated.gymId?.ownerId?.email || populated.gymId?.email;
                        if (ownerEmail) {
                            sendOwnerBookingNotification(ownerEmail, populated).catch(e => 
                                console.error('❌ Owner email failed:', e.message)
                            );
                        }
                    } catch (mailErr) {
                        console.error('⚠ Email trigger failed:', mailErr.message);
                    }
                    
                } else if (cfStatus === 'CANCELLED' || cfStatus === 'FAILED' || payStatus === 'FAILED' || payStatus === 'CANCELLED' || payStatus === 'USER_DROPPED') {
                    const finalStatus = (cfStatus === 'CANCELLED' || payStatus === 'CANCELLED' || payStatus === 'USER_DROPPED') ? 'CANCELLED' : 'FAILED';
                    console.log(`❌ [StatusCheck] Order ${orderId} ${finalStatus} - Updating booking...`);
                    booking.paymentStatus = finalStatus;
                    booking.failureReason = cfStatus || payStatus;
                    await booking.save();
                    
                } else if (cfStatus === 'ACTIVE' || cfStatus === 'PENDING') {
                    console.log(`⏳ [StatusCheck] Order ${orderId} still ${cfStatus}`);
                    // Keep as PENDING
                } else {
                    console.warn(`[StatusCheck] Unknown order status: ${cfStatus} / ${payStatus}`);
                }
            } catch (cfErr) {
                console.error('[StatusCheck] Cashfree API check failed:', cfErr.response?.data || cfErr.message);
                // On error, return current local status
            }
        }

        return res.json({
            status:          booking.paymentStatus, // For frontend compatibility
            paymentStatus:   booking.paymentStatus,
            bookingStatus:   booking.status,
            amount:          booking.amount,
            startDate:       booking.startDate,
            endDate:         booking.endDate,
            booking:         booking
        });

    } catch (err) {
        console.error('❌ getPaymentStatus error:', err.message);
        return res.status(500).json({ 
            message: err.message,
            status: 'ERROR',
            paymentStatus: 'ERROR'
        });
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
