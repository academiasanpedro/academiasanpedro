// Textos legales — Ruta: /admin/legal

import type { Metadata } from "next";
import LegalEditor from "@/components/admin/LegalEditor";
import PageHeader from "@/components/ui/PageHeader";
import { LEGAL_PAGES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Textos legales" };

export default async function AdminLegalPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("legal_pages").select("slug, content");

  // Siempre las 3 páginas, aunque falten filas en BD
  const pages = LEGAL_PAGES.map((page) => ({
    ...page,
    content: (data ?? []).find((row) => row.slug === page.slug)?.content ?? "",
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Textos legales"
        description="Aviso legal, privacidad y cookies. Los cambios se publican al guardar."
      />
      <LegalEditor pages={pages} />
    </div>
  );
}
