// Route Handler — OAuth Callback de Supabase
// Supabase redirige aquí tras el flujo de Google OAuth para intercambiar el code por una sesión.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Si hay error o no hay code, redirigir al login con error
  return NextResponse.redirect(`${origin}/auth/login?error=oauth`);
}
