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
    getProfile, 
    getAllUsers, 
    updateProfile 
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
