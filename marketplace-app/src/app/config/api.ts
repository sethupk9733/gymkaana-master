export const API_URL = import.meta.env.VITE_API_URL || 'https://api.gymkaana.com/api';
export const MARKETPLACE_URL = import.meta.env.VITE_MARKETPLACE_URL || 'https://app.gymkaana.com';

/**
 * Cashfree Payment Gateway Configuration
 * ─────────────────────────────────────
 * Uses official @cashfreepayments/cashfree-js SDK
 * 
 * Environment Variables:
 * - VITE_CASHFREE_APP_ID: Your Cashfree merchant app ID
 *   - Starts with "TEST" for sandbox (auto-detects)
 *   - Production ID for live payments
 */
export const CASHFREE_APP_ID = import.meta.env.VITE_CASHFREE_APP_ID || '';

// Detect mode based on App ID prefix
export const CASHFREE_MODE = CASHFREE_APP_ID?.startsWith('TEST') 
  ? 'sandbox' 
  : (import.meta.env.PROD ? 'production' : 'sandbox');
