const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const gamificationController = require('../controllers/gamificationController');
const adminGamificationController = require('../controllers/adminGamificationController');

// User Routes
router.get('/dashboard', protect, gamificationController.getDashboardData);
router.get('/leaderboard', gamificationController.getLeaderboard); // Public or protect? Let's make it public to encourage logins
router.get('/challenges', gamificationController.getActiveChallenges);
router.post('/challenges/join', protect, gamificationController.joinChallenge);

// Admin Routes
router.post('/admin/challenges', protect, admin, adminGamificationController.createChallenge);
router.put('/admin/challenges/:id', protect, admin, adminGamificationController.updateChallenge);
router.put('/admin/challenges/:id/end', protect, admin, adminGamificationController.endChallenge);
router.get('/admin/analytics', protect, admin, adminGamificationController.getAnalytics);
router.get('/admin/challenges', protect, admin, adminGamificationController.getAllChallenges);

module.exports = router;
