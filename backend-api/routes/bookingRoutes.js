const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Create booking - with auth from localStorage userId
router.post('/', bookingController.createBooking);

// All other routes require authentication
router.use(protect);

router.get('/', bookingController.getAllBookings);
router.get('/my', bookingController.getMyBookings);
router.get('/gym/:gymId', bookingController.getBookingsByGym);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/cancel', bookingController.cancelBooking);
router.put('/:id/update-date', bookingController.updateBookingDate);
router.post('/verify-qr', bookingController.verifyBooking);

module.exports = router;
