"use server";

import { revalidatePath } from "next/cache";
import { getActionContext } from "@/lib/auth";
import type { ActionResult } from "@/lib/types";
import { profileSchema, type ProfileFormData } from "@/lib/validators/profile";

export async function updateProfile(input: ProfileFormData): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos." };

  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión ha caducado. Vuelve a iniciar sesión." };
  const { supabase, user } = ctx;
  const { full_name, phone, marketing_consent } = parsed.data;

  let { error } = await supabase
    .from("profiles")
    .update({ full_name, phone: phone || null, marketing_consent })
    .eq("id", user.id);

  // Compatibilidad si aún no se ha ejecutado la migración 001 (columna marketing_consent)
  if (error && /marketing_consent/.test(error.message)) {
    ({ error } = await supabase
      .from("profiles")
      .update({ full_name, phone: phone || null })
      .eq("id", user.id));
  }

  if (error) {
    console.error("[updateProfile]", error.message);
    return { ok: false, error: "No se pudieron guardar los cambios." };
  }

  // Mantiene la metadata de auth sincronizada (la usa el saludo si no hay perfil)
  await supabase.auth.updateUser({ data: { full_name, marketing_consent } });

  revalidatePath("/dashboard", "layout");
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Perfil actualizado." };
}
