import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import TestRunner from "./TestRunner";
import { Suspense } from "react";

export const metadata = {
  title: "Test de Nivel | Academia San Pedro",
};

export const dynamic = "force-dynamic";

export default function LevelTestPage() {
  return (
    <main className="min-h-screen bg-neutral-50/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 px-6 py-12">
      <Suspense fallback={<div className="text-center py-20 text-neutral-500 font-bold">Cargando test...</div>}>
        <LevelTestContent />
      </Suspense>
    </main>
  );
}

async function LevelTestContent() {
  await connection();
  const supabase = await createClient();

  // Fetch the global test data
  const { data: testData } = await supabase
    .from("global_test")
    .select("test_data")
    .eq("id", 1)
    .single();

  let rawData = testData?.test_data || {};
  if (Array.isArray(rawData)) {
    // Migrate old array format on the fly for the runner
    rawData = { "Inglés": rawData };
  }

  return <TestRunner testData={rawData} />;
}
