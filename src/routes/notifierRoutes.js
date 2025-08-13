const express = require('express');
const { notify } = require('../controllers/notifierController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Only admin can send notifications via API
router.post('/', authenticate, authorize(['admin']), notify);

module.exports = router;
