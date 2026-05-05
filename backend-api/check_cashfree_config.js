#!/usr/bin/env node

require('dotenv').config();

console.log('\n=== CASHFREE CONFIGURATION CHECK ===\n');

const requiredEnvVars = [
    'CASHFREE_APP_ID',
    'CASHFREE_SECRET_KEY',
    'CASHFREE_ENV',
    'MONGODB_URI',
    'MARKETPLACE_URL',
    'BACKEND_URL'
];

let allPresent = true;

requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅' : '❌';
    const display = value ? (value.length > 20 ? value.substring(0, 20) + '...' : value) : 'NOT SET';
    console.log(`${status} ${varName}: ${display}`);
    if (!value) allPresent = false;
});

console.log('\n=== CASHFREE API TEST ===\n');

if (process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY) {
    const axios = require('axios');
    const isSandbox = (process.env.CASHFREE_ENV || 'sandbox') === 'sandbox';
    const baseUrl = isSandbox 
        ? 'https://sandbox.cashfree.com/pg' 
        : 'https://api.cashfree.com/pg';

    console.log(`Mode: ${isSandbox ? 'SANDBOX' : 'PRODUCTION'}`);
    console.log(`Base URL: ${baseUrl}`);
    console.log(`\nTesting API connectivity...\n`);

    const testClient = axios.create({
        baseURL: baseUrl,
        headers: {
            'x-client-id': process.env.CASHFREE_APP_ID,
            'x-client-secret': process.env.CASHFREE_SECRET_KEY,
            'x-api-version': '2023-08-01',
            'Content-Type': 'application/json'
        }
    });

    // Test a simple request to verify credentials
    testClient.post('/orders', {
        order_id: `TEST-${Date.now()}`,
        order_amount: 1,
        order_currency: 'INR',
        customer_details: {
            customer_id: 'TEST_USER',
            customer_name: 'Test User',
            customer_email: 'test@example.com',
            customer_phone: '9999999999'
        }
    }).then(res => {
        console.log('✅ Cashfree API is working!');
        console.log('✅ Response:', res.data);
    }).catch(err => {
        console.error('❌ Cashfree API Error:');
        console.error('Status:', err.response?.status);
        console.error('Message:', err.response?.data?.message);
        console.error('Full Error:', err.response?.data);
    });
} else {
    console.log('❌ Cannot test API - credentials not set');
}

console.log('\n=== END CHECK ===\n');
