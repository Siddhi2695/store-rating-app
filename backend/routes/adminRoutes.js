const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateUserCreate, validateStoreCreate } = require('../middleware/validator');

// All admin routes require ADMIN role authorization
router.use(authenticateToken, authorizeRoles('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.post('/users', validateUserCreate, adminController.addUser);
router.get('/users/:id', adminController.getUserById);
router.get('/stores', adminController.getStores);
router.post('/stores', validateStoreCreate, adminController.addStore);

module.exports = router;
