const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const workoutController = require('../controllers/workoutController');

router.post('/', protect, workoutController.logWorkout);
router.get('/passport', protect, workoutController.getDailyPassport);
router.put('/target', protect, workoutController.updateTarget);
router.get('/stats', protect, workoutController.getMonthlyStats);
router.post('/water', protect, workoutController.logWater);
router.put('/water/target', protect, workoutController.updateWaterTarget);

module.exports = router;
