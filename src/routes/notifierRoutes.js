// src/routes/notifierRoutes.js
const express = require('express');
const { sendNotification } = require('../controllers/notifierController');
const router = express.Router();

router.post('/', sendNotification);

module.exports = router;
