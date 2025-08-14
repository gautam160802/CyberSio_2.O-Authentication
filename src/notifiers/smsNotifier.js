// src/notifiers/smsNotifier.js
async function sendSMS(to, message) {
    // For now, just simulate SMS sending
    console.log(`SMS to ${to}: ${message}`);
    return { status: 'success', message: 'SMS sent (simulation)' };
}

module.exports = { sendSMS };
