"use server";

import { revalidatePath } from "next/cache";
import { getActionContext } from "@/lib/auth";
import type { ActionResult } from "@/lib/types";
import { updateLeadSchema } from "@/lib/validators/admin";

export async function updateLead(input: { leadId: string; status: string; note: string }): Promise<ActionResult> {
  const parsed = updateLeadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos." };

  const ctx = await getActionContext({ admin: true });
  if (!ctx) return { ok: false, error: "No autorizado." };

  const { error } = await ctx.supabase
    .from("leads_questionnaire")
    .update({ status: parsed.data.status, internal_note: parsed.data.note || null })
    .eq("id", parsed.data.leadId);

  if (error) {
    console.error("[updateLead]", error.message);
    return { ok: false, error: "No se pudo actualizar el lead." };
  }

  revalidatePath("/admin/crm");
  revalidatePath("/admin");
  return { ok: true, message: "Lead actualizado." };
}
