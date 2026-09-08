const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/stores', authenticateToken, userController.getStoresForUser);
router.get('/stores/:id', authenticateToken, userController.getStoreById);

module.exports = router;
