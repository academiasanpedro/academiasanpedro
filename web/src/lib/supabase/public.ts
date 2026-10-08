// Supabase — Cliente anónimo sin cookies para datos públicos (permite páginas estáticas/ISR).
// Solo para tablas con lectura pública por RLS (p. ej. legal_pages).

import { createClient } from "@supabase/supabase-js";

export function createPublicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
