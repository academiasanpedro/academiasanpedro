import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";

import { Suspense } from "react";

export const metadata = {
  title: "Configuración de Perfil | Academia San Pedro",
};

export const dynamic = "force-dynamic";

export default function StudentSettingsPage() {
  return (
    <main className="min-h-screen bg-neutral-50/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 px-6 py-12">
      <Suspense fallback={<div className="text-center mt-20">Cargando configuración...</div>}>
        <StudentSettingsContent />
      </Suspense>
    </main>
  );
}

async function saveProfile(formData: FormData) {
  "use server";
  const sb = await createClient();
  const { data: { user: currentUser } } = await sb.auth.getUser();
  if (!currentUser) return;

  const full_name = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;

  await sb.from("profiles").update({ full_name, phone }).eq("id", currentUser.id);
  redirect("/dashboard?settings_updated=true");
}

async function StudentSettingsContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto">
      <Link 
        href="/dashboard" 
        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-primary transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        Volver al Dashboard
      </Link>

      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-neutral-100">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Configuración de Perfil</h1>
          <p className="text-neutral-500 mt-2 font-medium">Actualiza tus datos personales y de contacto.</p>
        </div>

        <form action={saveProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700">Nombre Completo</label>
              <input 
                type="text" 
                name="full_name"
                defaultValue={profile?.full_name || ""}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700">Teléfono</label>
              <input 
                type="tel" 
                name="phone"
                defaultValue={profile?.phone || ""}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                placeholder="+34 600 000 000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">Correo Electrónico (No modificable)</label>
            <input 
              type="email" 
              defaultValue={profile?.email || user.email}
              className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm text-neutral-500 cursor-not-allowed"
              disabled
            />
          </div>

          <div className="pt-6 border-t border-neutral-100 flex justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark hover:-translate-y-0.5 transition-all"
            >
              <Save size={18} />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
