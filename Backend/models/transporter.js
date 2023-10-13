const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'agrocom0532@gmail.com', // Your Gmail email or App Password email
        pass: 'dvzi gpwr ggrl tdjo' // Your App Password (if using) or Gmail account password
    }
});

module.exports = transporter;