// src/notifiers/emailNotifier.js
const nodemailer = require('nodemailer');

async function sendEmail(to, subject, message) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    return await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        text: message
    });
}

module.exports = { sendEmail };
