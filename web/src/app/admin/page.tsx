// Resumen del panel admin — Ruta: /admin (solo datos reales)

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, FileClock, GraduationCap, UserPlus, Users } from "lucide-react";
import Badge, { leadStatusTone } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Flag from "@/components/ui/Flag";
import PageHeader from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { cn, formatDateTime, getInitials } from "@/lib/utils";

export const metadata: Metadata = { title: "Resumen" };

interface RecentStudent {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
  leads_questionnaire: { status: string | null; target_language: string | null }[] | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgoIso(days: number) {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const weekAgo = daysAgoIso(7);

  const [students, newStudents, pending, questionnaires, enrolled, recent] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student").gte("created_at", weekAgo),
    supabase.from("level_tests").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
    supabase.from("leads_questionnaire").select("id", { count: "exact", head: true }),
    supabase.from("leads_questionnaire").select("id", { count: "exact", head: true }).eq("status", "Matriculado"),
    supabase
      .from("profiles")
      .select("id, full_name, email, created_at, leads_questionnaire(status, target_language)")
      .eq("role", "student")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const pendingCount = pending.count ?? 0;
  const kpis = [
    { title: "Alumnos registrados", value: students.count ?? 0, detail: `+${newStudents.count ?? 0} en 7 días`, icon: Users, tone: "bg-primary-50 text-primary" },
    { title: "Tests por evaluar", value: pendingCount, detail: pendingCount > 0 ? "Requieren revisión" : "Todo al día", icon: FileClock, tone: pendingCount > 0 ? "bg-secondary/10 text-secondary" : "bg-success/10 text-success", href: "/admin/tests" },
    { title: "Cuestionarios", value: questionnaires.count ?? 0, detail: "Leads con objetivos", icon: ClipboardList, tone: "bg-warning/10 text-warning", href: "/admin/crm" },
    { title: "Matriculados", value: enrolled.count ?? 0, detail: "Estado en el CRM", icon: GraduationCap, tone: "bg-success/10 text-success", href: "/admin/crm?estado=Matriculado" },
  ];

  const recentStudents = (recent.data ?? []) as RecentStudent[];

  return (
    <div className="space-y-8">
      <PageHeader title="Resumen" description="Actividad de la academia en tiempo real." />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const body = (
            <Card className={cn("h-full p-6 transition duration-300", kpi.href && "hover:-translate-y-1 hover:shadow-lift")}>
              <div className="flex items-start justify-between">
                <p className="text-sm font-bold text-neutral-500">{kpi.title}</p>
                <span className={cn("grid size-10 place-items-center rounded-xl", kpi.tone)}>
                  <kpi.icon size={20} aria-hidden="true" />
                </span>
              </div>
              <p className="mt-4 text-4xl font-black tracking-tight text-neutral-900">{kpi.value}</p>
              <p className="mt-1 text-sm font-medium text-neutral-500">{kpi.detail}</p>
            </Card>
          );
          return kpi.href ? (
            <Link key={kpi.title} href={kpi.href} className="block rounded-3xl">
              {body}
            </Link>
          ) : (
            <div key={kpi.title}>{body}</div>
          );
        })}
      </div>

      {pendingCount > 0 && (
        <Card className="flex flex-col gap-4 border-secondary/20 bg-secondary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-neutral-900">
              Tienes {pendingCount} test{pendingCount > 1 ? "s" : ""} pendiente{pendingCount > 1 ? "s" : ""} de evaluar
            </p>
            <p className="text-sm text-neutral-500">Contestar rápido aumenta la probabilidad de matrícula.</p>
          </div>
          <ButtonLink href="/admin/tests" variant="secondary">
            Evaluar ahora
            <ArrowRight size={16} aria-hidden="true" />
          </ButtonLink>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <h2 className="text-lg font-black tracking-tight text-neutral-900">Últimos registros</h2>
          <Link href="/admin/crm" className="text-sm font-bold text-primary hover:text-primary-dark">
            Ver CRM →
          </Link>
        </div>
        {recentStudents.length === 0 ? (
          <EmptyState icon={UserPlus} title="Aún no hay registros" description="Los alumnos aparecerán aquí al crear su cuenta." />
        ) : (
          <ul className="divide-y divide-neutral-100">
            {recentStudents.map((student) => {
              const lead = student.leads_questionnaire?.[0];
              const name = student.full_name || student.email;
              return (
                <li key={student.id}>
                  <Link
                    href={`/admin/crm?q=${encodeURIComponent(student.email)}`}
                    className="flex items-center gap-4 px-6 py-4 transition hover:bg-neutral-50"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-sm font-black text-primary">
                      {getInitials(name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-neutral-900">{name}</p>
                      <p className="text-xs text-neutral-500">Registro: {formatDateTime(student.created_at)}</p>
                    </div>
                    {lead?.target_language && <Flag language={lead.target_language} className="size-7" />}
                    <Badge tone={lead ? leadStatusTone(lead.status) : "neutral"}>{lead?.status ?? "Sin cuestionario"}</Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
