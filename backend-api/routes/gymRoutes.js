const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');
const { protect, protectOptional } = require('../middleware/authMiddleware');

router.get('/', protectOptional, gymController.getAllGyms);
router.post('/', protect, gymController.createGym);
router.get('/:id', gymController.getGymById);
router.put('/:id', protect, gymController.updateGym);
router.delete('/:id', protect, gymController.deleteGym);

// Declaration routes
router.post('/declaration', protect, gymController.submitDeclaration);
router.get('/declaration/:gymId', protect, gymController.getDeclarationByGymId);

module.exports = router;
