const express = require('express');
const router = express.Router();
const { getAccountingData, getAdminAccountingData } = require('../controllers/accountingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getAccountingData);
router.get('/admin', protect, admin, getAdminAccountingData);

module.exports = router;
