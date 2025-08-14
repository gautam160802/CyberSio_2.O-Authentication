// src/controllers/notifierController.js
const notifierService = require('../services/notifierService');

async function sendNotification(req, res) {
    try {
        const { type, to, subject, message, webhookUrl } = req.body;
        const result = await notifierService.sendNotification({ type, to, subject, message, webhookUrl });
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { sendNotification };
