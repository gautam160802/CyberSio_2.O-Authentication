// src/notifiers/whatsappNotifier.js
async function sendWhatsApp(to, message) {
    console.log(`WhatsApp to ${to}: ${message}`);
    return { status: 'success', message: 'WhatsApp message sent (simulation)' };
}
module.exports = { sendWhatsApp };
