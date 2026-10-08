// Route Handler — Callback de Supabase (OAuth, confirmación de email y recuperación de contraseña)
// Intercambia el `code` por una sesión y redirige a `next` (solo rutas internas).

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    console.error("[auth/callback]", error.message);
  }

  // Enlace caducado, abierto en otro navegador o error del proveedor
  const error = searchParams.get("error") ? "oauth" : "link";
  return NextResponse.redirect(`${origin}/auth/login?error=${error}`);
}
