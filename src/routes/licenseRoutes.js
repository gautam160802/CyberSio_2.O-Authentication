const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, authorizeRoles('admin'), licenseController.create);
router.post('/validate', licenseController.validate);

module.exports = router;
