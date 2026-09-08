const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateLogin, validateUpdatePassword } = require('../middleware/validator');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/register', validateSignup, authController.register);
router.post('/login', validateLogin, authController.login);
router.put('/password', authenticateToken, validateUpdatePassword, authController.updatePassword);
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
