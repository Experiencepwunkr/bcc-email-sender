// Load .env variables
require("dotenv").config();

console.log("SMTP Host:", process.env.EMAIL_HOST);
console.log("SMTP User:", process.env.EMAIL_USER);
