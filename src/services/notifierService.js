const nodemailer = require('nodemailer');
const axios = require('axios');

// Email setup (SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true if 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = { from: process.env.SMTP_USER, to, subject, text };
  return transporter.sendMail(mailOptions);
};

// SMS (example using hypothetical SMS API)
const sendSMS = async (phone, message) => {
  // Replace with real SMS API
  console.log(`Sending SMS to ${phone}: ${message}`);
  return { status: 'success', phone, message };
};

// Webhook
const sendWebhook = async (url, payload) => {
  try {
    const res = await axios.post(url, payload);
    return res.data;
  } catch (err) {
    throw err;
  }
};

module.exports = { sendEmail, sendSMS, sendWebhook };
