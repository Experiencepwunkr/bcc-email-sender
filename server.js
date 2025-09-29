// server.js
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const app = express();
const upload = multer({ dest: "uploads/" }); // temp folder for file uploads

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // for serving HTML form

// Route: show form
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Route: handle send
app.post("/send", upload.single("bccFile"), async (req, res) => {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPass, from, to, subject, message, bccManual } = req.body;

    // Step 1: Load BCC emails
    let bccList = [];
    if (bccManual) {
      bccList = bccManual.split(/[\s,;]+/).filter(e => e.includes("@"));
    }
    if (req.file) {
      const content = fs.readFileSync(req.file.path, "utf-8");
      const fileEmails = content.split(/[\s,;]+/).filter(e => e.includes("@"));
      bccList = bccList.concat(fileEmails);
      fs.unlinkSync(req.file.path); // cleanup upload
    }

    if (bccList.length === 0) {
      return res.status(400).send("❌ No valid BCC emails provided.");
    }

    // Step 2: Setup transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    // Step 3: Send mail
    const info = await transporter.sendMail({
      from,
      to,
      bcc: bccList,
      subject,
      html: message,
    });

    res.send(`
      ✅ Email sent! <br>
      To: ${to} <br>
      BCC: ${bccList.join(", ")} <br>
      MessageId: ${info.messageId}
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error: " + err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
