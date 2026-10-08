"use server";

import nodemailer from "nodemailer";

export async function sendEmail(to: string | string[], subject: string, html: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // e.g. academiasanpedro26@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
      },
    });

    const mailOptions = {
      from: `"Academia San Pedro" <${process.env.GMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(",") : to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}
