// src/services/notifierService.js
const emailNotifier = require('../notifiers/emailNotifier');
const smsNotifier = require('../notifiers/smsNotifier');
const whatsappNotifier = require('../notifiers/whatsappNotifier');
const webhookNotifier = require('../notifiers/webhookNotifier');

async function sendNotification({ type, to, subject, message, webhookUrl }) {
    switch (type) {
        case 'email':
            return await emailNotifier.sendEmail(to, subject, message);
        case 'sms':
            return await smsNotifier.sendSMS(to, message);
        case 'whatsapp':
            return await whatsappNotifier.sendWhatsApp(to, message);
        case 'webhook':
            return await webhookNotifier.sendWebhook(webhookUrl, message);
        default:
            throw new Error(`Unsupported notification type: ${type}`);
    }
}

module.exports = { sendNotification };
