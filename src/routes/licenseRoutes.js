const express = require('express');
const { createLicense, getUserLicenses, validateLicense } = require('../controllers/licenseController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = require('express').Router();

// Admin can create license
router.post('/create', authenticate, authorize(['admin']), createLicense);

// User can get own licenses
router.get('/my-licenses', authenticate, getUserLicenses);

// Validate license key (open route)
router.post('/validate', validateLicense);

module.exports = router;

