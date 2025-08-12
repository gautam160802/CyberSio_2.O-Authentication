const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin Register
router.post('/register', adminController.register);

// Admin Login
router.post('/login', adminController.login);

module.exports = router;
