const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// OTP Routes
router.post('/send-otp', emailController.sendOTP);
router.post('/verify-otp', emailController.verifyOTP);

// Generic Email - potentially restricted/secure in future
router.post('/send-email', emailController.sendGenericEmail);

module.exports = router;
