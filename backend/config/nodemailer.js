const nodemailer = require("nodemailer");
const {
  createEmailVerificationTemplate,
  generateVerificationToken,
} = require("../util/helper");
const User = require("../models/user");
const AppError = require("../util/appError");
require("dotenv").config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

exports.sendEmail = async (to, subject, text, html) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: '"Clothify" <support@clothify.com>',
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};
