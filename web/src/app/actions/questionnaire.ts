"use server";

import { revalidatePath } from "next/cache";
import { getActionContext } from "@/lib/auth";
import type { ActionResult } from "@/lib/types";
import { questionnaireSchema, type QuestionnaireFormData } from "@/lib/validators/questionnaire";

export async function submitQuestionnaire(input: QuestionnaireFormData): Promise<ActionResult> {
  const parsed = questionnaireSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Revisa los campos del formulario." };

  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión ha caducado. Vuelve a iniciar sesión." };
  const { supabase, user } = ctx;

  const { data: existing } = await supabase
    .from("leads_questionnaire")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  // Ya enviado (doble clic u otra pestaña): no es un error para el alumno
  if (existing && existing.length > 0) return { ok: true };

  const { target_language, current_level, preferred_schedule, goals } = parsed.data;
  const { error } = await supabase.from("leads_questionnaire").insert({
    user_id: user.id,
    target_language,
    current_level,
    preferred_schedule,
    goals: goals || null,
    status: "Interesado",
  });

  if (error) {
    console.error("[submitQuestionnaire]", error.message);
    return { ok: false, error: "No hemos podido guardar tus respuestas. Inténtalo de nuevo en unos segundos." };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
