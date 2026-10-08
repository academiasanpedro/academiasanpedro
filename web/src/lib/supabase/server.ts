// Supabase — Cliente para el servidor (Server Components, Route Handlers, Server Actions)
// Ref: AcademiaSanPedro/00_Meta/00_Project_Rules.md → "Usar createServerClient en Server Components"

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se ignora en Server Components (solo lectura),
            // pero funciona en Server Actions y Route Handlers.
          }
        },
      },
    }
  );
}
