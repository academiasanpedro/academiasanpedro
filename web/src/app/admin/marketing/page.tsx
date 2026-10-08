// Vista: Ofertas y Avisos (/admin/marketing)

import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import MarketingForm from "./MarketingForm";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function MarketingPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Ofertas y Avisos (Mailing)</h1>
        <p className="text-neutral-500 mt-1">
          Comunícate con tus alumnos y leads para enviar descuentos, apertura de plazos o avisos importantes.
        </p>
      </div>
      
      <Suspense fallback={<div className="py-20 text-center text-neutral-500">Cargando datos...</div>}>
        <MarketingContent />
      </Suspense>
    </div>
  );
}

async function MarketingContent() {
  await connection();
  const supabase = await createClient();
  
  // Obtener el número real de perfiles registrados
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const audienceCount = count || 0;

  return <MarketingForm audienceCount={audienceCount} />;
}
