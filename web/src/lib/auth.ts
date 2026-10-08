// Helpers de autenticación y autorización (solo servidor)
// Los layouts usan requireUser/requireAdmin; las Server Actions usan getActionContext.

import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const getSessionUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getSessionUser();
  if (!user) return null;

  const supabase = await createClient();
  // select("*") para no depender de columnas añadidas por migraciones
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) console.error("[auth] Error leyendo el perfil:", error.message);
  return (data as Profile | null) ?? null;
});

/** Nombre visible: perfil → metadata de auth → parte local del email. */
export function getDisplayName(user: User, profile: Profile | null) {
  const metadata = user.user_metadata as { full_name?: string; name?: string };
  return (
    profile?.full_name?.trim() ||
    metadata.full_name?.trim() ||
    metadata.name?.trim() ||
    user.email?.split("@")[0] ||
    "Alumno/a"
  );
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");
  const profile = await getCurrentProfile();
  return { user, profile, displayName: getDisplayName(user, profile) };
}

export async function requireAdmin() {
  const session = await requireUser();
  if (session.profile?.role !== "admin") redirect("/dashboard");
  return session;
}

/** Contexto para Server Actions: devuelve null si no hay sesión o falta el rol. */
export async function getActionContext(options: { admin?: boolean } = {}) {
  const user = await getSessionUser();
  if (!user) return null;

  const profile = await getCurrentProfile();
  if (options.admin && profile?.role !== "admin") return null;

  const supabase = await createClient();
  return { supabase, user, profile };
}
