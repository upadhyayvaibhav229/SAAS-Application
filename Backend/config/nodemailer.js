import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    host: `smtp-relay.brevo.com`,
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP connection failed:", error.message);
    } else {
        console.log("SMTP transporter is ready.");
    }
});

export default transporter
