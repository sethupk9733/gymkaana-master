const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for landing page
router.post('/', inquiryController.createInquiry);

// Admin only route to view inquiries
router.get('/', protect, admin, inquiryController.getAllInquiries);
router.put('/:id/status', protect, admin, inquiryController.updateInquiryStatus);
router.delete('/:id', protect, admin, inquiryController.deleteInquiry);

module.exports = router;
