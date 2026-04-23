/**
 * cashfreeClient.js
 * ─────────────────
 * Pre-configured Axios instance for the Cashfree Payments API.
 * Reads CASHFREE_ENV to auto-switch between sandbox and production.
 *
 * Usage:
 *   const cashfree = require('../utils/cashfreeClient');
 *   const response = await cashfree.post('/orders', payload);
 */

const axios = require('axios');

const isSandbox = (process.env.CASHFREE_ENV || 'sandbox') === 'sandbox';

const BASE_URL = isSandbox
    ? 'https://sandbox.cashfree.com/pg'
    : 'https://api.cashfree.com/pg';

const cashfreeClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-client-id':     process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version':   '2023-08-01',
        'Content-Type':    'application/json',
        'Accept':          'application/json'
    },
    timeout: 15000
});

// ─── Request logger (dev only) ────────────────────────────────────────────────
cashfreeClient.interceptors.request.use((config) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[Cashfree ▶] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
});

// ─── Response error logger ────────────────────────────────────────────────────
cashfreeClient.interceptors.response.use(
    (res) => res,
    (err) => {
        const data = err.response?.data;
        console.error(`[Cashfree ✗] ${err.response?.status} —`, data?.message || err.message);
        return Promise.reject(err);
    }
);

module.exports = cashfreeClient;
