// Ruta: /dashboard/questionnaire

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import QuestionnaireForm from "@/components/features/QuestionnaireForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cuestionario Inicial | Academia San Pedro",
  description: "Cuestionario de perfilado de alumnos.",
};

export const dynamic = "force-dynamic";

export default function QuestionnairePage() {
  return (
    <main className="min-h-screen bg-neutral-50/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-neutral-500 bg-white border border-neutral-200/60 shadow-sm hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all mb-10"
        >
          <ArrowLeft size={16} />
          Volver al panel
        </Link>
        
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-600 tracking-tight">
            Cuestionario Inicial
          </h1>
          <p className="mt-4 text-neutral-500 leading-relaxed font-medium text-lg">
            Ayúdanos a conocerte mejor. Con esta información podremos ofrecerte los grupos y niveles que mejor se adapten a tus necesidades antes de que realices la prueba oficial.
          </p>
        </div>

        <Suspense fallback={<div className="h-40 flex items-center justify-center text-neutral-500">Cargando formulario...</div>}>
          <QuestionnaireContent />
        </Suspense>
      </div>
    </main>
  );
}

async function QuestionnaireContent() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Verificar si ya lo ha completado
  const { data: existingQ } = await supabase
    .from("leads_questionnaire")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingQ) {
    redirect("/dashboard");
  }

  return <QuestionnaireForm userId={user.id} />;
}
