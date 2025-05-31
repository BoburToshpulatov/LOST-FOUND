import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function sendEmail({ to, subject, html, text, replyTo }) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"LOST&FOUND" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text: text || html.replace(/<[^>]+>/g, ""), // Fallback to plain text version
    html,
    replyTo,
  });
}
