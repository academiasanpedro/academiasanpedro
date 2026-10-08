// Envío de emails vía Gmail (Nodemailer). Solo servidor: nunca exportar desde un fichero "use server".

import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";

let transporter: Transporter | null = null;

export function isEmailConfigured() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

/** Buzón que recibe avisos internos y el formulario de contacto. */
export function getAcademyInbox() {
  return process.env.CONTACT_EMAIL || process.env.GMAIL_USER || CONTACT.email;
}

function getTransporter() {
  transporter ??= nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  return transporter;
}

interface SendEmailOptions {
  to: string | string[];
  bcc?: string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, bcc, subject, html, replyTo }: SendEmailOptions) {
  if (!isEmailConfigured()) {
    return { ok: false as const, error: "El envío de emails no está configurado (GMAIL_USER / GMAIL_APP_PASSWORD)." };
  }

  try {
    await getTransporter().sendMail({
      from: `"Academia San Pedro" <${process.env.GMAIL_USER}>`,
      to,
      bcc,
      subject,
      html,
      replyTo,
    });
    return { ok: true as const };
  } catch (error) {
    console.error("[email] Error enviando email:", error);
    return { ok: false as const, error: "No se pudo enviar el email." };
  }
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Texto plano del usuario → HTML seguro con saltos de línea. */
export function textToHtml(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

/** Plantilla corporativa. `body` debe ser HTML ya escapado. */
export function emailLayout({ title, body, footer }: { title: string; body: string; footer?: string }) {
  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#334155;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr><td style="background:#243b78;padding:24px 32px;">
            <p style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;">${SITE_NAME}</p>
          </td></tr>
          <tr><td style="padding:32px;">
            <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a;">${title}</h1>
            <div style="font-size:15px;line-height:1.6;">${body}</div>
          </td></tr>
          <tr><td style="padding:20px 32px;background:#f8fafc;font-size:12px;line-height:1.5;color:#64748b;">
            ${footer ?? ""}
            ${CONTACT.address}, ${CONTACT.postalCode} ${CONTACT.city} · ${CONTACT.phone} ·
            <a href="${SITE_URL}" style="color:#243b78;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
