const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // SMTP server for Gmail
  port: 465, // Port for secure SMTP
  secure: true,
  auth: {
    user: "agrocom0532@gmail.com", // Your Gmail email or App Password email
    pass: "vsyt utba ftmp hqww", // Your App Password (if using) or Gmail account password
  },
});

// Export the transporter for use in other parts of the application
module.exports = transporter;
