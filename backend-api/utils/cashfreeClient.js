/**
 * cashfreeClient.js
 * ─────────────────
 * Official Cashfree Payments Gateway SDK client.
 * Auto-detects sandbox/production from CASHFREE_ENV env var.
 *
 * Usage:
 *   const { CFPaymentGateway, cfConfig } = require('../utils/cashfreeClient');
 *   const apiInstance = new CFPaymentGateway();
 *   const result = await apiInstance.orderCreate(cfConfig, cfOrderRequest);
 */

const {
    CFPaymentGateway,
    CFConfig,
    CFEnvironment
} = require('cashfree-pg-sdk-nodejs');

// Initialize configuration
const isSandbox = (process.env.CASHFREE_ENV || 'sandbox') === 'sandbox';
const environment = isSandbox ? CFEnvironment.SANDBOX : CFEnvironment.PRODUCTION;
const apiVersion = '2022-09-01';

const cfConfig = new CFConfig(
    environment,
    apiVersion,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
);

const paymentGateway = new CFPaymentGateway();

console.log(`[Cashfree] Initialized in ${isSandbox ? 'SANDBOX' : 'PRODUCTION'} mode`);

module.exports = {
    CFPaymentGateway,
    cfConfig,
    paymentGateway
};
