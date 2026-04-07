const express = require('express');
const router = express.Router();
const { getPayoutHistory, requestPayout, updateGymBankDetails, getAllAdminPayouts, updatePayoutStatus } = require('../controllers/payoutController');
const { protect } = require('../middleware/authMiddleware');

router.get('/history', protect, getPayoutHistory);
router.post('/request', protect, requestPayout);
router.put('/bank-details', protect, updateGymBankDetails);

// Admin Routes
router.get('/admin/all', protect, getAllAdminPayouts);
router.put('/admin/:id', protect, updatePayoutStatus);

module.exports = router;
