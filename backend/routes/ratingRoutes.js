const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateRatingSubmit } = require('../middleware/validator');

router.get('/my', authenticateToken, userController.getMyRatings);
router.post('/', authenticateToken, authorizeRoles('USER'), validateRatingSubmit, userController.submitRating);
router.put('/:id', authenticateToken, authorizeRoles('USER'), validateRatingSubmit, userController.modifyRating);

module.exports = router;
