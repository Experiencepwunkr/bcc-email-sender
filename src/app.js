require("dotenv").config();
const fs = require("fs");
const nodemailer = require("nodemailer");
const readline = require("readline");

// Load BCC emails from TXT file
const bccList = fs.readFileSync("bcc-list.txt", "utf-8")
  .split("\n")
  .map(email => email.trim())
  .filter(email => email.length > 0);

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask for subject first
rl.question("Enter subject: ", (subject) => {
  console.log("Enter message body (type END on a new line when finished):");

  let body = "";
  rl.on("line", (input) => {
    if (input.trim().toUpperCase() === "END") {
      rl.close();
    } else {
      body += input + "\n";
    }
  });

  rl.on("close", () => {
    sendEmail(subject, body.trim());
  });
});

// Function to send email
async function sendEmail(subject, body) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SENDER_NAME}" <${process.env.EMAIL_USER}>`,
      to: "mail@inc.com", // main recipient
      bcc: bccList,
      subject,
      text: body,                      // plain text fallback
      html: body.replace(/\n/g, "<br>") // HTML version with line breaks
    });

    console.log("✅ Message sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}
