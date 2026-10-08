// Dashboard Principal (Admin)
// TODO: Fetch de datos reales desde Supabase

import { Users, UserPlus, FileSignature, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-neutral-500">Cargando dashboard...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  await connection();
  const supabase = await createClient();

  // Fetch counts
  const { count: leadsCount } = await supabase
    .from("leads_questionnaire")
    .select("*", { count: 'exact', head: true });

  const { count: pendingTestsCount } = await supabase
    .from("level_tests")
    .select("*", { count: 'exact', head: true })
    .eq("status", "pending_review");

  const { count: studentsCount } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true })
    .eq("role", "student");

  // Fetch recent activity (last 3 registered users)
  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("id, full_name, created_at, role")
    .order("created_at", { ascending: false })
    .limit(3);

  const kpis = [
    {
      title: "Nuevos Leads",
      value: leadsCount || 0,
      subtitle: "total registrados",
      trend: "+12%",
      icon: UserPlus,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      title: "Pruebas Pendientes",
      value: pendingTestsCount || 0,
      subtitle: "por revisar",
      trend: pendingTestsCount && pendingTestsCount > 0 ? "¡Revisar!" : "Al día",
      icon: FileSignature,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Total Alumnos",
      value: studentsCount || 0,
      subtitle: "usuarios en plataforma",
      trend: "+5%",
      icon: Users,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-600 tracking-tight">Dashboard General</h1>
        <p className="text-neutral-500 mt-2 font-medium">
          Resumen de actividad y estado de la academia en tiempo real.
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx}
            className="group bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/60 shadow-xl shadow-neutral-200/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-neutral-200/60 ring-1 ring-neutral-900/5 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neutral-100 to-transparent rounded-full opacity-50 blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-neutral-400 mb-2">
                  {kpi.title}
                </p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-4xl font-black text-neutral-900 tracking-tighter">
                    {kpi.value}
                  </h3>
                  <span className={`text-sm font-bold flex items-center px-2 py-1 rounded-md ${
                    kpi.trend === "¡Revisar!" ? "bg-error/10 text-error" : "bg-success/10 text-success"
                  }`}>
                    <TrendingUp size={14} className="mr-1" />
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-500 mt-2">{kpi.subtitle}</p>
              </div>
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner ${kpi.bg}`}>
                <kpi.icon size={28} className={kpi.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actividad Reciente Placeholder */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-xl shadow-neutral-200/40 ring-1 ring-neutral-900/5 p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">Actividad Reciente</h2>
          <button className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">Ver todo</button>
        </div>
        <div className="space-y-1">
          {recentUsers && recentUsers.length > 0 ? recentUsers.map((user) => (
            <div key={user.id} className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-neutral-50 transition-colors cursor-pointer border border-transparent hover:border-neutral-100">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-neutral-100 to-white flex items-center justify-center shadow-sm border border-neutral-100 group-hover:shadow-md transition-shadow">
                <UserPlus size={20} className="text-neutral-500" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-neutral-900">Nuevo usuario registrado: {user.full_name || "Anónimo"}</p>
                <p className="text-sm font-medium text-neutral-400 mt-0.5">{new Date(user.created_at).toLocaleString()}</p>
              </div>
              <div className="text-neutral-300 group-hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )) : (
            <p className="text-sm text-neutral-500 p-4">No hay actividad reciente.</p>
          )}
        </div>
      </div>
    </div>
  );
}
