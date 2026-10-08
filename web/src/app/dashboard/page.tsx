// Panel del Alumno (Dashboard)
// Ruta: /dashboard

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Shield } from "lucide-react";
import ProfileDropdown from "@/components/ui/ProfileDropdown";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel del Alumno | Academia San Pedro",
  description: "Área personal para alumnos de la Academia de Idiomas San Pedro.",
};

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-neutral-50/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Cabecera Estática */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-10 border-b border-neutral-200/60 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/assets/logo.png"
                alt="Logo Academia San Pedro"
                width={40}
                height={40}
                className="rounded-xl drop-shadow-md"
              />
              <span className="text-sm font-bold tracking-widest uppercase text-primary/80">
                Academia San Pedro
              </span>
            </div>
            <Suspense fallback={<h1 className="text-4xl font-black text-neutral-900 tracking-tight">Cargando...</h1>}>
              <DashboardGreeting />
            </Suspense>
            <p className="text-neutral-500 mt-2 text-lg font-medium">
              Bienvenido/a a tu espacio formativo premium.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Suspense fallback={null}>
              <AdminAccessButton />
            </Suspense>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-neutral-600 bg-white border border-neutral-200 rounded-xl hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm active:scale-95 gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Inicio
            </Link>
            <Suspense fallback={<div className="w-10 h-10 rounded-xl bg-neutral-200 animate-pulse"></div>}>
              <DashboardProfileDropdown />
            </Suspense>
          </div>
        </header>

        {/* Tarjetas de acción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Suspense fallback={
            <div className="rounded-3xl border border-neutral-200/60 bg-white/50 backdrop-blur-md p-8 shadow-sm flex items-center justify-center text-neutral-400 h-64 animate-pulse">
              <span className="font-semibold tracking-wide">Cargando módulos...</span>
            </div>
          }>
            <DashboardCards />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

async function DashboardGreeting() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }
  const fullName = user.user_metadata?.full_name || "Alumno/a";
  
  return (
    <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-600 tracking-tight">
      ¡Hola, {fullName}! 👋
    </h1>
  );
}

async function DashboardProfileDropdown() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const fullName = user.user_metadata?.full_name || "Alumno";
  const initials = fullName.substring(0, 2).toUpperCase();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <ProfileDropdown 
      userName={fullName} 
      userInitials={initials} 
      isAdmin={profile?.role === "admin"} 
    />
  );
}

async function DashboardCards() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { data: existingQ } = await supabase
    .from("leads_questionnaire")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: existingTest } = await supabase
    .from("level_tests")
    .select("status, assigned_level, score")
    .eq("user_id", user.id)
    .maybeSingle();

  const hasCompletedQuestionnaire = !!existingQ;
  const hasCompletedTest = !!existingTest;

  return (
    <>
      {/* Cuestionario de objetivos */}
      <div className={`group rounded-3xl p-8 transition-all duration-300 relative overflow-hidden ${
        hasCompletedQuestionnaire 
          ? 'bg-gradient-to-br from-success/10 to-success/5 border border-success/20 shadow-none' 
          : 'bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-neutral-200/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-neutral-200/60 ring-1 ring-neutral-900/5'
      }`}>
        
        {/* Glow effect */}
        {!hasCompletedQuestionnaire && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}

        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm ${hasCompletedQuestionnaire ? 'bg-success text-white shadow-success/20' : 'bg-primary/10 text-primary'}`}>
            📋
          </div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">
            1. Cuestionario Inicial
          </h2>
          <p className="text-neutral-500 text-sm mt-3 leading-relaxed font-medium">
            Cuéntanos tus metas, nivel estimado y disponibilidad horaria para ofrecerte el mejor grupo.
          </p>
          <div className="mt-8">
            {hasCompletedQuestionnaire ? (
              <span className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-success text-white shadow-md shadow-success/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Completado
              </span>
            ) : (
              <Link href="/dashboard/questionnaire" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 group-hover:pr-4">
                Comenzar Cuestionario
                <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Test de nivel online */}
      <div className="group rounded-3xl p-8 transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 shadow-lg shadow-primary/5 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 ring-1 ring-primary/5">
        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm ${hasCompletedTest ? 'bg-success text-white shadow-success/20' : 'bg-primary text-white shadow-primary/20'}`}>
            🎯
          </div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">
            2. Test de Nivel Online
          </h2>
          <p className="text-neutral-500 text-sm mt-3 leading-relaxed font-medium">
            Evalúa tus competencias de forma interactiva. Nuestros profesores revisarán tus respuestas y te contactarán con tu nivel oficial.
          </p>
          <div className="mt-8">
            {hasCompletedTest ? (
              <div className="bg-success/5 border border-success/20 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 text-success font-bold text-sm mb-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Test completado
                </div>
                {existingTest.status === "evaluated" ? (
                  <p className="text-sm font-medium text-neutral-700 mt-2">
                    Tu nivel asignado es: <strong className="text-neutral-900 bg-white px-2 py-1 rounded shadow-sm border border-neutral-100">{existingTest.assigned_level}</strong>
                  </p>
                ) : (
                  <p className="text-sm font-medium text-neutral-600">
                    Aciertos: {existingTest.score}. Pendiente de revisión por un profesor.
                  </p>
                )}
              </div>
            ) : (
              <Link
                href="/tests/level-test"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl bg-primary text-white shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
              >
                Realizar Test Ahora
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

async function AdminAccessButton() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile role:", error);
  }
  
  console.log(`[AdminAccessButton] User ID: ${user.id}, Role in DB: ${profile?.role}`);

  if (profile?.role !== "admin") return null;

  return (
    <a
      href="/admin"
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 hover:shadow-lg transition-all shadow-sm active:scale-95 gap-2"
    >
      <Shield className="w-4 h-4 text-secondary" />
      Panel Admin
    </a>
  );
}
