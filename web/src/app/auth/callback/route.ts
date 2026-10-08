// Route Handler — Callback de Supabase (OAuth, confirmación de email y recuperación de contraseña)
// Intercambia el `code` por una sesión y redirige al destino guardado en la cookie `auth_next`
// (ver src/lib/auth-redirect.ts). Solo se aceptan rutas internas.

import { NextResponse, type NextRequest } from "next/server";
import { NEXT_PATH_COOKIE } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const storedNext = request.cookies.get(NEXT_PATH_COOKIE)?.value;
  const next = safeRedirectPath(searchParams.get("next") ?? (storedNext ? decodeURIComponent(storedNext) : null));

  const supabase = await createClient();

  const redirect = (path: string) => {
    const response = NextResponse.redirect(new URL(path, origin));
    response.cookies.delete(NEXT_PATH_COOKIE);
    return response;
  };

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return redirect(next);
    console.error("[auth/callback]", error.code ?? "", error.message);
  }

  // El mismo enlace/código procesado dos veces (doble clic, recarga): si la sesión ya existe, se entra
  const errorCode = searchParams.get("error_code");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return redirect(next);

  if (errorCode) console.error("[auth/callback] Supabase:", errorCode, searchParams.get("error_description"));
  return redirect(`/auth/login?error=${searchParams.get("error") ? "oauth" : "link"}`);
}
