// Mailing — Ruta: /admin/marketing
// Solo destinatarios con consentimiento explícito (marketing_consent)

import type { Metadata } from "next";
import MarketingForm from "@/components/admin/MarketingForm";
import Alert from "@/components/ui/Alert";
import PageHeader from "@/components/ui/PageHeader";
import { isEmailConfigured } from "@/lib/email";
import type { AudienceMember } from "@/lib/marketing";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Mailing" };

export default async function MarketingPage() {
  const supabase = await createClient();
  const [{ data, error }, totalStudents] = await Promise.all([
    supabase
      .from("profiles")
      .select("leads_questionnaire(status, target_language)")
      .eq("role", "student")
      .eq("marketing_consent", true),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
  ]);

  // Solo se envía al cliente lo necesario para calcular la audiencia (sin emails)
  const audience: AudienceMember[] = (data ?? []).map((row) => {
    const lead = (Array.isArray(row.leads_questionnaire) ? row.leads_questionnaire[0] : row.leads_questionnaire) as
      | { status: string | null; target_language: string | null }
      | null
      | undefined;
    return { status: lead?.status ?? null, language: lead?.target_language ?? null };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mailing"
        description="Envía ofertas, apertura de plazos o avisos a los alumnos que han aceptado recibir comunicaciones."
      />
      {error && /marketing_consent/.test(error.message) && (
        <Alert tone="warning" title="Falta la migración de consentimiento">
          Ejecuta <code>supabase/migrations/001_hardening.sql</code> en Supabase para activar el mailing.
        </Alert>
      )}
      {!isEmailConfigured() && (
        <Alert tone="warning">El envío de emails no está configurado (GMAIL_USER / GMAIL_APP_PASSWORD).</Alert>
      )}
      <MarketingForm audience={audience} totalStudents={totalStudents.count ?? 0} sender={process.env.GMAIL_USER ?? ""} />
    </div>
  );
}
