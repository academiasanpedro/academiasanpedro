import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  // Cerrar sesión
  await supabase.auth.signOut();

  // Redirigir al home principal
  return NextResponse.redirect(new URL("/", request.url));
}
