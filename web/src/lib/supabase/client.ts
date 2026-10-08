// Supabase — Cliente para el navegador (Client Components)
// Ref: AcademiaSanPedro/00_Meta/00_Project_Rules.md → "Usar createBrowserClient solo en Client Components"

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
