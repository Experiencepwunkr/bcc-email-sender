const transporter = require('../config/email');
const { validateEmailList } = require('../utils/emailValidator');

const sendBccEmail = async (subject, htmlContent, recipients) => {
  const { valid, invalid } = validateEmailList(recipients);

  if (valid.length === 0) {
    throw new Error('No valid email addresses provided');
  }

  const mailOptions = {
    from: `"${process.env.SENDER_NAME}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // BCC recipients don't see this
    bcc: valid,
    subject: subject,
    html: htmlContent
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: `Email sent successfully to ${valid.length} recipients`,
      validCount: valid.length,
      invalidCount: invalid.length,
      invalidEmails: invalid
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = { sendBccEmail };