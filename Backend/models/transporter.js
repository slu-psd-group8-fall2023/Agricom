const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'smtp.gmail.com',
    auth: {
        user: 'agrocom0532@gmail.com', // Your Gmail email or App Password email
        pass: 'Agro@0532' // Your App Password (if using) or Gmail account password
    }
});

module.exports = transporter;