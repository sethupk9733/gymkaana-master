/**
 * cleanupExpiredPayments.js
 * ──────────────────────────
 * Marks abandoned Cashfree payment attempts as USER_DROPPED.
 * Runs automatically every 15 minutes via setInterval in server.js.
 *
 * What it does:
 *   - Finds bookings with paymentStatus: PENDING that were last updated
 *     more than 20 minutes ago (Cashfree sessions expire in ~15 min)
 *   - Sets paymentStatus to USER_DROPPED (booking.status stays 'upcoming'
 *     so users can retry payment)
 *
 * What it does NOT do:
 *   - Delete bookings (always preserve audit trail)
 *   - Cancel active/completed bookings
 *   - Touch bookings without a cashfreeOrderId (no CF session was started)
 */

const Booking = require('../models/Booking');

const EXPIRY_MINUTES = 20; // slightly above Cashfree's 15-min session window

async function cleanupExpiredPayments() {
    try {
        const cutoff = new Date(Date.now() - EXPIRY_MINUTES * 60 * 1000);

        const result = await Booking.updateMany(
            {
                paymentStatus:    'PENDING',
                cashfreeOrderId:  { $exists: true, $ne: null },
                updatedAt:        { $lt: cutoff }
            },
            {
                $set: { paymentStatus: 'USER_DROPPED' }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`[Cleanup] ⏰ Marked ${result.modifiedCount} expired payment(s) as USER_DROPPED`);
        }
    } catch (err) {
        console.error('[Cleanup] ❌ cleanupExpiredPayments error:', err.message);
    }
}

module.exports = { cleanupExpiredPayments, EXPIRY_MINUTES };
