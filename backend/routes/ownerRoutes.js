const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken, authorizeRoles('STORE_OWNER'));

router.get('/dashboard', ownerController.getOwnerDashboard);
router.get('/ratings', ownerController.getOwnerRatings);

module.exports = router;
