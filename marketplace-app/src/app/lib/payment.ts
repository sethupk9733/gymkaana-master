import { load } from '@cashfreepayments/cashfree-js';
import { CASHFREE_APP_ID, CASHFREE_MODE } from '../config/api';

/**
 * Payment Service – Official Cashfree JS SDK Integration
 * ───────────────────────────────────────────────────────
 * 
 * Integrates the official @cashfreepayments/cashfree-js SDK for payment processing
 * in the marketplace app.
 * 
 * Key Features:
 * ✓ Automatic sandbox/production detection based on App ID
 * ✓ Popup modal checkout (beautiful, non-blocking UX)
 * ✓ Promise-based API for easy integration
 * ✓ Comprehensive error handling
 * 
 * Setup:
 * 1. npm install @cashfreepayments/cashfree-js
 * 2. Set VITE_CASHFREE_APP_ID in your .env
 * 3. Backend returns paymentSessionId from /api/payments/create-order
 * 4. Call initiateCheckout(paymentSessionId) to open payment modal
 */

let cashfreeInstance: any = null;

/**
 * Lazy-loads and returns the Cashfree SDK instance
 */
const getCashfree = async () => {
    if (!cashfreeInstance) {
        if (!CASHFREE_APP_ID) {
            throw new Error('Cashfree App ID not configured. Set VITE_CASHFREE_APP_ID in .env');
        }

        const mode = CASHFREE_MODE;
        console.log(`[Cashfree] Initializing Official SDK in ${mode} mode`);
        
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
 * @param paymentSessionId - Session ID from backend
 */
export const initiateCheckout = async (paymentSessionId: string) => {
    if (!paymentSessionId?.trim()) {
        throw new Error("Invalid or missing payment session ID");
    }

    const cashfree = await getCashfree();
    
    const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        returnUrl: `${window.location.origin}/?order_id={order_id}`,
        redirectTarget: "_modal"
    };

    console.log(`[Cashfree] Opening checkout modal for session: ${paymentSessionId.substring(0, 20)}...`);
    console.log(`[Cashfree] Checkout options:`, checkoutOptions);

    // SDK checkout() resolves (not rejects) even for aborts/failures
    // It returns { error: true, errorCode: 'payment_aborted' } for cancellations
    const result = await cashfree.checkout(checkoutOptions);
    console.log(`[Cashfree] Checkout result:`, result);
    
    return {
        success: !result?.error,
        errorCode: result?.error ? (result?.errorCode || 'unknown') : null,
        aborted: result?.errorCode === 'payment_aborted',
        raw: result
    };
};

/**
 * Verifies payment status after checkout
 */
export const verifyPaymentStatus = async (orderId: string) => {
    try {
        console.log(`[Cashfree] Verifying payment status`);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.gymkaana.com/api'}/payments/status/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('gymkaana_token')}`
            }
        });
        
        return await response.json();
    } catch (error) {
        console.error("[Cashfree] Status verification failed:", error);
        throw error;
    }
};
