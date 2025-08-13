const { sendEmail, sendSMS, sendWebhook } = require('../services/notifierService');

const notify = async (req, res) => {
  const { type, to, subject, message, url, payload } = req.body;

  try {
    let result;

    switch(type) {
      case 'email':
        result = await sendEmail(to, subject, message);
        break;
      case 'sms':
        result = await sendSMS(to, message);
        break;
      case 'webhook':
        result = await sendWebhook(url, payload);
        break;
      default:
        return res.status(400).json({ error: 'Invalid notification type' });
    }

    res.json({ message: 'Notification sent', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { notify };
