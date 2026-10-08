"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateLegalPage(slug: string, content: string) {
  const supabase = await createClient();

  // Verificar si es admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false, error: "No autorizado" };
  }

  const { error } = await supabase
    .from("legal_pages")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) {
    return { success: false, error: error.message };
  }

  // Revalidar la ruta para que los cambios se reflejen inmediatamente
  revalidatePath(`/legal/${slug}`);
  return { success: true };
}
