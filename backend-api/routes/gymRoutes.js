const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');
const { protect, protectOptional, admin, owner } = require('../middleware/authMiddleware');

router.get('/', protectOptional, gymController.getAllGyms);
router.get('/my-gyms', protect, gymController.getMyGyms);
router.post('/', protect, gymController.createGym);
router.get('/:id', gymController.getGymById);
router.put('/:id', protect, owner, gymController.updateGym);
router.delete('/:id', protect, admin, gymController.deleteGym);

// Declaration routes
router.post('/declaration', protect, gymController.submitDeclaration);
router.get('/declaration/:gymId', protect, gymController.getDeclarationByGymId);
router.get('/declaration/:gymId/pdf', protect, gymController.getDeclarationPDF);

module.exports = router;
