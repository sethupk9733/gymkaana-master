const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    googleLogin,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    refresh,
    logout,
    getProfile, 
    getAllUsers, 
    updateProfile 
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin); // Changed from google-login to google to match frontend
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
