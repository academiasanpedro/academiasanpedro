"use server";

import { emailLayout, escapeHtml, getAcademyInbox, sendEmail, textToHtml } from "@/lib/email";
import { CONTACT } from "@/lib/constants";
import type { ActionResult } from "@/lib/types";
import { contactSchema, type ContactFormData } from "@/lib/validators/contact";

export async function sendContactRequest(input: ContactFormData): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Revisa los campos." };

  // Honeypot relleno → bot: respondemos OK sin enviar nada
  if (parsed.data.website) return { ok: true };

  const { name, email, phone, language, message } = parsed.data;
  const rows = [
    ["Nombre", name],
    ["Email", email],
    ["Teléfono", phone || "—"],
    ["Idioma de interés", language || "—"],
  ]
    .map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">${label}</td><td><strong>${escapeHtml(value)}</strong></td></tr>`)
    .join("");

  const result = await sendEmail({
    to: getAcademyInbox(),
    replyTo: email,
    subject: `Solicitud de información de ${name}`,
    html: emailLayout({
      title: "Nueva solicitud desde la web",
      body: `<table role="presentation" style="margin-bottom:16px;font-size:14px;">${rows}</table>
        <p style="padding:16px;border-radius:12px;background:#f8fafc;">${textToHtml(message)}</p>
        <p style="font-size:13px;color:#64748b;">Responde directamente a este email para contestar a ${escapeHtml(name)}.</p>`,
    }),
  });

  if (!result.ok) {
    return {
      ok: false,
      error: `No hemos podido enviar tu mensaje. Llámanos al ${CONTACT.phone} o escríbenos a ${CONTACT.email}.`,
    };
  }

  return { ok: true, message: "¡Mensaje enviado! Te responderemos lo antes posible." };
}
