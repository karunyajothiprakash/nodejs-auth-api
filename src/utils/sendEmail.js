// src/utils/sendEmail.js
import nodemailer from "nodemailer";

// 👉 Just to confirm envs are loaded – watch these in the terminal
console.log("SMTP CONFIG:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  from: process.env.EMAIL_FROM,
});

let transporter;

export const initializeEmailTransporter = () => {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true if 465, else false
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Optional: check connection when server starts
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP connection error:", error);
    } else {
      console.log("SMTP server is ready to take our messages");
    }
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    console.error("Email transporter not initialized!");
    throw new Error("Email transporter not initialized. Call initializeEmailTransporter first.");
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.messageId);
  } catch (err) {
    console.error("Nodemailer error:", err);
    throw err; // so your controller's catch runs
  }
};
