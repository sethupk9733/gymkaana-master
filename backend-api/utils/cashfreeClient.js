/**
 * cashfreeClient.js
 * ─────────────────
 * Official Cashfree Payments Gateway SDK client.
 * Auto-detects sandbox/production from CASHFREE_ENV env var.
 *
 * Usage:
 *   const { Cashfree } = require('../utils/cashfreeClient');
 *   const response = await Cashfree.PGOrder.create(orderPayload);
 */

const { Cashfree } = require('cashfree-pg-sdk-nodejs');

// Initialize Cashfree SDK
const isSandbox = (process.env.CASHFREE_ENV || 'sandbox') === 'sandbox';

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XApiVersion = '2023-08-01';

// Set environment
Cashfree.environment = isSandbox ? Cashfree.Environment.SANDBOX : Cashfree.Environment.PRODUCTION;

console.log(`[Cashfree] Initialized in ${isSandbox ? 'SANDBOX' : 'PRODUCTION'} mode`);

module.exports = { Cashfree };
