import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import LegalEditor from "./LegalEditor";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ajustes Legales | Admin Academia San Pedro",
};

export default function AdminLegalPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Textos Legales</h1>
        <p className="text-neutral-500 mt-1">
          Modifica el contenido de la Política de Privacidad, Aviso Legal y Cookies.
        </p>
      </div>

      <Suspense fallback={<div className="py-20 text-center text-neutral-500">Cargando editor...</div>}>
        <AdminLegalContent />
      </Suspense>
    </div>
  );
}

async function AdminLegalContent() {
  await connection();
  const supabase = await createClient();

  const { data: pages } = await supabase
    .from("legal_pages")
    .select("slug, title, content")
    .order("slug");

  return <LegalEditor pages={pages || []} />;
}
