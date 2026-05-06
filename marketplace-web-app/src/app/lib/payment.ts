import { load } from '@cashfreepayments/cashfree-js';
import { CASHFREE_APP_ID, CASHFREE_MODE } from '../config/api';

/**
 * Payment Service – Official Cashfree JS SDK Integration
 * ───────────────────────────────────────────────────────
 * 
 * Integrates the official @cashfreepayments/cashfree-js SDK for payment processing.
 * 
 * Key Features:
 * ✓ Automatic sandbox/production detection based on App ID
 * ✓ Popup modal checkout (beautiful, non-blocking UX)
 * ✓ Promise-based API for easy integration
 * ✓ Comprehensive error handling
 * 
 * Setup:
 * 1. npm install @cashfreepayments/cashfree-js
 * 2. Set VITE_CASHFREE_APP_ID in your .env:
 *    - Sandbox: VITE_CASHFREE_APP_ID=TEST1104...  (TEST prefix auto-detects sandbox)
 *    - Production: VITE_CASHFREE_APP_ID=APP1234... (no TEST prefix = production)
 * 3. Backend returns paymentSessionId from /api/payments/create-order
 * 4. Call initiateCheckout(paymentSessionId) to open the payment modal
 * 
 * Payment Flow:
 * ─────────────
 * 1. User initiates booking → PaymentScreen component
 * 2. PaymentScreen.handlePayment():
 *    a. Create pending booking in DB
 *    b. Call backend POST /api/payments/create-order
 *    c. Backend returns { paymentSessionId, cashfreeOrderId, ... }
 *    d. Call initiateCheckout(paymentSessionId)
 * 3. Cashfree checkout modal opens
 * 4. User completes payment (or closes modal)
 * 5. Backend receives webhook from Cashfree
 * 6. Payment status is verified and booking is activated
 * 
 * Documentation: https://docs.cashfree.com/docs/payment-gateway-api
 */

let cashfreeInstance: any = null;

/**
 * Lazy-loads and returns the Cashfree SDK instance
 * Auto-initializes in sandbox or production mode
 */
const getCashfree = async () => {
    if (!cashfreeInstance) {
        if (!CASHFREE_APP_ID) {
            throw new Error(
                'Cashfree App ID not configured. ' +
                'Set VITE_CASHFREE_APP_ID environment variable to enable payments.'
            );
        }

        const mode = CASHFREE_MODE;
        console.log(`[Cashfree] Initializing Official SDK in ${mode} mode`);
        console.log(`[Cashfree] App ID: ${CASHFREE_APP_ID.substring(0, 20)}...`);
        
        try {
            cashfreeInstance = await load({
                mode: mode as "sandbox" | "production"
            });
            console.log('[Cashfree] SDK loaded successfully');
        } catch (error) {
            console.error('[Cashfree] SDK initialization failed:', error);
            throw new Error(`Failed to load Cashfree SDK: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    return cashfreeInstance;
};

/**
 * Initiates the Cashfree Checkout Modal
 * 
 * @param paymentSessionId - Session ID from backend /api/payments/create-order
 * @returns Promise resolving to checkout result (success/error/redirect status)
 * 
 * Handles three outcomes:
 * 1. result.error: User closed modal or payment error occurred
 * 2. result.redirect: Payment redirecting (rare, in-app browser only)
 * 3. result.paymentDetails: Payment completed (always verify server-side)
 */
export const initiateCheckout = async (paymentSessionId: string) => {
    try {
        if (!paymentSessionId?.trim()) {
            throw new Error("Invalid or missing payment session ID");
        }

        console.log(`[Cashfree] Opening checkout modal for session: ${paymentSessionId.substring(0, 20)}...`);
        
        const cashfree = await getCashfree();
        
        const checkoutOptions = {
            paymentSessionId: paymentSessionId,
            returnUrl: `${window.location.origin}/?order_id={order_id}`,
            redirectTarget: "_modal" // Opens in beautiful popup (non-blocking)
        };

        console.log(`[Cashfree] Checkout options:`, {
            returnUrl: checkoutOptions.returnUrl,
            redirectTarget: checkoutOptions.redirectTarget,
            sessionId: paymentSessionId.substring(0, 20) + '...'
        });
        
        const result = await cashfree.checkout(checkoutOptions);
        
        console.log(`[Cashfree] Checkout result:`, {
            hasError: !!result?.error,
            hasRedirect: !!result?.redirect,
            hasPaymentDetails: !!result?.paymentDetails,
            errorCode: result?.error?.code,
            errorDescription: result?.error?.description
        });
        
        return result;
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error("[Cashfree] Checkout initialization failed:", errorMsg);
        throw new Error(`Payment gateway error: ${errorMsg}`);
    }
};

/**
 * Verifies payment status after checkout closes
 * 
 * Called by PaymentScreen after modal closes to verify:
 * - Payment success (even if user closed modal)
 * - Payment pending (webhook still processing)
 * - Payment failed (user cancellation, declined card, etc.)
 * 
 * @param orderId - Cashfree order ID
 * @returns Status data from backend
 */
export const verifyPaymentStatus = async (orderId: string) => {
    try {
        console.log(`[Cashfree] Verifying payment status for order: ${orderId}`);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.gymkaana.com/api'}/payments/status/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('gymkaana_token')}`
            }
        });
        
        const data = await response.json();
        
        console.log(`[Cashfree] Payment status response:`, {
            status: data.status,
            paymentStatus: data.paymentStatus,
            bookingStatus: data.status
        });
        
        return data;
    } catch (error) {
        console.error("[Cashfree] Status verification failed:", error);
        throw error;
    }
};
