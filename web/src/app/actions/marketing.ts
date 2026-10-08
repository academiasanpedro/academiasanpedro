"use server";

import { getActionContext } from "@/lib/auth";
import { SITE_URL } from "@/lib/constants";
import { emailLayout, escapeHtml, sendEmail, textToHtml } from "@/lib/email";
import type { ActionResult } from "@/lib/types";
import { marketingSchema, type MarketingFormData } from "@/lib/validators/admin";
import { matchesAudience, type AudienceMember } from "@/lib/marketing";

const BATCH_SIZE = 50;

export async function sendMarketingCampaign(input: MarketingFormData): Promise<ActionResult> {
  const parsed = marketingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos." };

  const ctx = await getActionContext({ admin: true });
  if (!ctx) return { ok: false, error: "No autorizado." };

  const { data, error } = await ctx.supabase
    .from("profiles")
    .select("email, leads_questionnaire(status, target_language)")
    .eq("role", "student")
    .eq("marketing_consent", true);

  if (error) {
    console.error("[sendMarketingCampaign]", error.message);
    return {
      ok: false,
      error: /marketing_consent/.test(error.message)
        ? "Falta la columna de consentimiento: ejecuta supabase/migrations/001_hardening.sql."
        : "No se pudieron cargar los destinatarios.",
    };
  }

  const recipients = (data ?? [])
    .filter((row) => {
      const lead = Array.isArray(row.leads_questionnaire) ? row.leads_questionnaire[0] : row.leads_questionnaire;
      const member: AudienceMember = { status: lead?.status ?? null, language: lead?.target_language ?? null };
      return matchesAudience(member, parsed.data.segment, parsed.data.language);
    })
    .map((row) => row.email)
    .filter((email): email is string => Boolean(email));

  if (recipients.length === 0) return { ok: false, error: "No hay destinatarios con consentimiento en este segmento." };

  const html = emailLayout({
    title: escapeHtml(parsed.data.subject),
    body: `<p>${textToHtml(parsed.data.content)}</p>`,
    footer: `Recibes este email porque aceptaste recibir novedades de la academia. Puedes darte de baja en
      <a href="${SITE_URL}/dashboard/settings" style="color:#243b78;">tu perfil</a> o respondiendo a este correo.<br>`,
  });

  // BCC por lotes: los destinatarios nunca ven las direcciones de los demás
  let sent = 0;
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    const result = await sendEmail({
      to: process.env.GMAIL_USER ?? batch[0],
      bcc: batch,
      subject: parsed.data.subject,
      html,
    });
    if (!result.ok) {
      return {
        ok: false,
        error: sent > 0 ? `Envío interrumpido tras ${sent} destinatarios: ${result.error}` : result.error,
      };
    }
    sent += batch.length;
  }

  return { ok: true, message: `Campaña enviada a ${sent} destinatario${sent === 1 ? "" : "s"}.` };
}
