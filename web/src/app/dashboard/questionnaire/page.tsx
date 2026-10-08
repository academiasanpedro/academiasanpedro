// Cuestionario inicial — Ruta: /dashboard/questionnaire

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import QuestionnaireForm from "@/components/features/QuestionnaireForm";
import PageHeader from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Cuestionario inicial" };

export default async function QuestionnairePage() {
  const { user } = await requireUser();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("leads_questionnaire")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (existing && existing.length > 0) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Paso 2 de 4 · 1 minuto"
        title="Cuéntanos sobre ti"
        description="Con estas respuestas te propondremos el grupo y el horario que mejor encajan contigo."
      />
      <QuestionnaireForm />
    </div>
  );
}
