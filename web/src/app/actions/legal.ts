"use server";

import { revalidatePath } from "next/cache";
import { getActionContext } from "@/lib/auth";
import { LEGAL_PAGES } from "@/lib/constants";
import type { ActionResult } from "@/lib/types";
import { legalPageSchema } from "@/lib/validators/admin";

export async function updateLegalPage(slug: string, content: string): Promise<ActionResult> {
  const parsed = legalPageSchema.safeParse({ slug, content });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos." };

  const ctx = await getActionContext({ admin: true });
  if (!ctx) return { ok: false, error: "No autorizado." };
  const { supabase } = ctx;

  const { data: updated, error } = await supabase
    .from("legal_pages")
    .update({ content: parsed.data.content, updated_at: new Date().toISOString() })
    .eq("slug", parsed.data.slug)
    .select("slug");

  let saveError = error;
  if (!error && (!updated || updated.length === 0)) {
    const title = LEGAL_PAGES.find((page) => page.slug === parsed.data.slug)?.title ?? parsed.data.slug;
    ({ error: saveError } = await supabase
      .from("legal_pages")
      .insert({ slug: parsed.data.slug, title, content: parsed.data.content }));
  }

  if (saveError) {
    console.error("[updateLegalPage]", saveError.message);
    return { ok: false, error: "No se pudo guardar la página." };
  }

  revalidatePath(`/legal/${parsed.data.slug}`);
  return {
    ok: true,
    message: parsed.data.content.trim()
      ? "Página guardada y publicada."
      : "Contenido vacío: se mostrará el texto por defecto.",
  };
}
