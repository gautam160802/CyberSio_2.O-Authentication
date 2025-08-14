// src/notifiers/webhookNotifier.js
const axios = require('axios');

async function sendWebhook(webhookUrl, message) {
    await axios.post(webhookUrl, { message });
    return { status: 'success', message: 'Webhook triggered' };
}
module.exports = { sendWebhook };
