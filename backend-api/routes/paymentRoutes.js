/**
 * paymentRoutes.js
 * ─────────────────
 * Mounts all Cashfree + EasySplit endpoints.
 *
 * IMPORTANT — Registration order in server.js matters:
 *   The WEBHOOK route uses express.raw() and MUST be mounted BEFORE
 *   the global express.json() middleware in server.js.
 *   See server.js for the correct registration pattern.
 */

const express    = require('express');
const router     = express.Router();
const {
    createOrder,
    verifyWebhook,
    getPaymentStatus,
    registerVendor,
    triggerRefund
} = require('../controllers/paymentController');

const { protect } = require('../middleware/authMiddleware');

// ── Public ─────────────────────────────────────────────────────────────────────
router.post('/webhook', verifyWebhook);

// ── Authenticated ──────────────────────────────────────────────────────────────
router.use(protect);

// Create a Cashfree order for an existing DB booking
router.post('/create-order', createOrder);

// Poll payment result (called after user returns from CF checkout)
router.get('/status/:orderId', getPaymentStatus);

// Register gym as an EasySplit vendor (owner portal action)
router.post('/vendors/register', registerVendor);

// Admin / user cancellation refund
router.post('/refund', triggerRefund);

module.exports = router;
