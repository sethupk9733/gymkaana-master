import { load } from '@cashfreepayments/cashfree-js';

// Configuration: uses VITE_CASHFREE_APP_ID from .env
// Environment is determined by the "sandbox" or "production" flag in checkout
const CASHFREE_APP_ID = import.meta.env.VITE_CASHFREE_APP_ID;

/**
 * Payment Service
 * ────────────────
 * Handles logic for interacting with the Cashfree JS SDK.
 * 
 * Flow:
 * 1. Your app calls backend POST /api/payments/create-order
 * 2. Backend returns paymentSessionId and orderId
 * 3. Your app calls checkout(paymentSessionId) to open the Cashfree UI
 */

let cashfreeInstance: any = null;

const getCashfree = async () => {
    if (!cashfreeInstance) {
        // Auto-detect sandbox mode if using a TEST ID
        const isTestId = CASHFREE_APP_ID?.startsWith('TEST');
        const mode = isTestId ? "sandbox" : (import.meta.env.PROD ? "production" : "sandbox");
        
        console.log(`[Cashfree] Initializing in ${mode} mode`);
        
        cashfreeInstance = await load({
            mode: mode as "sandbox" | "production"
        });
    }
    return cashfreeInstance;
};

/**
 * Opens the Cashfree Checkout Modal
 * @param paymentSessionId from backend
 */
export const initiateCheckout = async (paymentSessionId: string) => {
    try {
        const cashfree = await getCashfree();
        
        const checkoutOptions = {
            paymentSessionId: paymentSessionId,
            returnUrl: `${window.location.origin}/?order_id={order_id}`,
            redirectTarget: "_modal" // Opens in a beautiful popup instead of redirecting
        };

        return cashfree.checkout(checkoutOptions);
    } catch (error) {
        console.error("[Cashfree] Checkout Initialization Failed:", error);
        throw error;
    }
};

/**
 * Optional: Verifies status after returnUrl redirect
 * Use this in your BookingConfirmation screen
 */
export const verifyPaymentStatus = async (orderId: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/status/${orderId}`);
        return await response.json();
    } catch (error) {
        console.error("[Cashfree] Status verification failed:", error);
        throw error;
    }
};
