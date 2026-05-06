# Cashfree JS SDK Integration Guide

## Official Cashfree Payments Gateway Integration
This marketplace uses the official **@cashfreepayments/cashfree-js** SDK for handling payment processing.

## Setup & Installation

### 1. SDK Installation
The SDK is already installed in `package.json`:
```bash
npm install @cashfreepayments/cashfree-js
```

### 2. Environment Configuration
Create or update `.env` file with:
```env
# Backend API
VITE_API_URL=https://api.gymkaana.com/api

# Cashfree (Auto-detects sandbox/production based on App ID prefix)
# - TEST prefix → Sandbox mode
# - No TEST prefix → Production mode
VITE_CASHFREE_APP_ID=TEST110453444cb726ad00d64258379644354011
```

See `.env.example` for all available configuration options.

## Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User Initiates Booking                                       │
│    ├─ Selects gym, plan, dates                                  │
│    └─ Clicks "Checkout" → PaymentScreen component              │
│                                                                  │
│ 2. PaymentScreen.handlePayment()                               │
│    ├─ Creates pending booking in database                       │
│    ├─ Calls backend POST /api/payments/create-order            │
│    └─ Receives { paymentSessionId, cashfreeOrderId, ... }      │
│                                                                  │
│ 3. Cashfree Checkout Modal Opens                               │
│    ├─ Call: initiateCheckout(paymentSessionId)                 │
│    ├─ SDK loads and displays popup modal                       │
│    └─ User completes payment (or closes modal)                 │
│                                                                  │
│ 4. Payment Processing (Webhook)                                 │
│    ├─ Cashfree sends webhook to backend                        │
│    ├─ Backend verifies signature and updates booking           │
│    └─ Database: paymentStatus = 'SUCCESS', status = 'upcoming' │
│                                                                  │
│ 5. Status Verification                                          │
│    ├─ PaymentScreen checks status after modal closes          │
│    ├─ Calls backend GET /api/payments/status/:orderId         │
│    └─ Updates UI or shows "processing" message                 │
│                                                                  │
│ 6. Booking Confirmation                                         │
│    └─ User sees booking details, receives confirmation email   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Files

### 1. `src/app/config/api.ts`
Central configuration for all API endpoints and Cashfree settings.
- Exports: `API_URL`, `CASHFREE_APP_ID`, `CASHFREE_MODE`
- Auto-detects sandbox/production based on App ID

### 2. `src/app/lib/payment.ts`
Payment service with official SDK integration:
- **`getCashfree()`** - Lazy-loads SDK instance
- **`initiateCheckout(paymentSessionId)`** - Opens payment modal
- **`verifyPaymentStatus(orderId)`** - Checks payment status

### 3. `src/app/components/PaymentScreen.tsx`
Main booking/payment UI component:
- Calculates booking end date based on plan duration
- Creates booking and calls create-order endpoint
- Opens Cashfree checkout modal
- Verifies payment status after modal closes

## Checkout Modes Supported

### Popup Checkout (Current Implementation)
```javascript
const checkoutOptions = {
    paymentSessionId: "session_id_from_backend",
    returnUrl: `${window.location.origin}/?order_id={order_id}`,
    redirectTarget: "_modal"  // Opens in popup
};
const result = await cashfree.checkout(checkoutOptions);
```

**Result Handling:**
```javascript
if (result.error) {
    // User closed modal or payment error
    console.log("Payment error:", result.error);
}

if (result.redirect) {
    // Exceptional case (in-app browser only)
    console.log("Will redirect to return URL");
}

if (result.paymentDetails) {
    // Payment completed (always verify server-side!)
    console.log("Payment completed:", result.paymentDetails);
}
```

## Sandbox vs Production

### Sandbox Mode (Testing)
- **App ID Format**: Starts with "TEST"
- **Credentials**: Use test card numbers from Cashfree docs
- **Webhook**: Simulated or use Cashfree dashboard
- **Detection**: Automatic (SDK detects TEST prefix)

### Production Mode (Live)
- **App ID Format**: No "TEST" prefix
- **Environment Variable**: `VITE_CASHFREE_APP_ID=APP...`
- **Credentials**: Live merchant account credentials
- **Webhook**: Real Cashfree webhooks received

## Test Credentials

For sandbox testing, use these test cards:

| Card Type | Number | Expiry | CVV |
|-----------|--------|--------|-----|
| Visa | 4111111111111111 | 12/25 | 123 |
| Mastercard | 5555555555554444 | 12/25 | 123 |
| Amex | 378282246310005 | 12/25 | 1234 |

**Test UPI**: `success@cashfree` (for successful payments)

## Troubleshooting

### Issue: "Payment session ID is missing"
**Cause**: Backend didn't return `paymentSessionId`
**Fix**: Check backend `/api/payments/create-order` response

### Issue: Popup doesn't open
**Cause**: SDK not initialized or App ID missing
**Fix**: 
1. Verify `VITE_CASHFREE_APP_ID` is set in `.env`
2. Check browser console for SDK load errors
3. Ensure JavaScript is enabled

### Issue: Payment completes but booking not activated
**Cause**: Webhook not received or processed
**Fix**:
1. Check backend webhook handler in `paymentController.js`
2. Verify CASHFREE_WEBHOOK_SECRET in backend `.env`
3. Check webhook signature verification

### Issue: "Cannot find module '@cashfreepayments/cashfree-js'"
**Cause**: SDK not installed
**Fix**: 
```bash
npm install @cashfreepayments/cashfree-js
```

## Performance Notes

- SDK loads asynchronously on first checkout (slight delay)
- Subsequent checkouts use cached instance (instant)
- Modal opens after ~1-2 seconds of payment session creation
- Status verification happens in background

## Security Best Practices

✅ **Always verify payment server-side** (backend webhook handler)
✅ **Never trust client-side payment status alone**
✅ **Use HTTPS only** for return URLs
✅ **Validate order amounts** before processing
✅ **Keep webhook secrets secure** (in `.env`, never in git)
✅ **Implement idempotency** for webhook handlers (prevent duplicate processing)

## Official Documentation

- **Cashfree Docs**: https://docs.cashfree.com/docs/payment-gateway-api
- **JS SDK Docs**: https://docs.cashfree.com/docs/cashfree-js-sdk
- **Webhooks**: https://docs.cashfree.com/docs/webhooks
- **Testing Guide**: https://docs.cashfree.com/docs/test-credentials

## Support

For issues:
1. Check console logs (look for `[Cashfree]` prefix)
2. Review Cashfree API documentation
3. Contact Cashfree support: https://support.cashfree.com
4. Review backend logs at `/backend-api/server.js`
