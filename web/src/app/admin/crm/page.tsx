// CRM de alumnos y leads — Ruta: /admin/crm (?q&estado&idioma)

import type { Metadata } from "next";
import { Mail, Phone, Users } from "lucide-react";
import CrmFilters from "@/components/admin/CrmFilters";
import LeadManager, { type CrmLead } from "@/components/admin/LeadManager";
import Badge, { leadStatusTone } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Flag from "@/components/ui/Flag";
import PageHeader from "@/components/ui/PageHeader";
import { LEAD_STATUSES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "CRM alumnos" };

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  leads_questionnaire: {
    id: string;
    status: string | null;
    target_language: string | null;
    current_level: string | null;
    preferred_schedule: string | null;
    goals: string | null;
    internal_note: string | null;
  }[];
  level_tests: { language: string; status: string; assigned_level: string | null }[];
}

export default async function CrmPage({ searchParams }: PageProps<"/admin/crm">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().toLowerCase() : "";
  const status = typeof params.estado === "string" ? params.estado : "";
  const language = typeof params.idioma === "string" ? params.idioma : "";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, phone, created_at, leads_questionnaire(id, status, target_language, current_level, preferred_schedule, goals, internal_note), level_tests(language, status, assigned_level)"
    )
    .eq("role", "student")
    .order("created_at", { ascending: false })
    .limit(1000);

  const all: CrmLead[] = ((data ?? []) as ProfileRow[]).map((row) => {
    const lead = row.leads_questionnaire?.[0] ?? null;
    return {
      id: row.id,
      name: row.full_name || "Sin nombre",
      email: row.email,
      phone: row.phone,
      createdAt: row.created_at,
      lead: lead && {
        id: lead.id,
        status: lead.status ?? "Interesado",
        language: lead.target_language,
        level: lead.current_level,
        schedule: lead.preferred_schedule,
        goals: lead.goals,
        note: lead.internal_note,
      },
      tests: row.level_tests ?? [],
    };
  });

  const leads = all.filter((item) => {
    if (q && ![item.name, item.email, item.phone ?? ""].some((value) => value.toLowerCase().includes(q))) return false;
    if (status === "Sin cuestionario" ? item.lead : status && item.lead?.status !== status) return false;
    if (language && item.lead?.language !== language) return false;
    return true;
  });

  const counts = LEAD_STATUSES.map((value) => ({ value, count: all.filter((item) => item.lead?.status === value).length }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRM de alumnos"
        description="Todos los alumnos registrados, su cuestionario y sus tests. Gestiona el estado comercial y las notas."
      />

      <div className="flex flex-wrap gap-2">
        <Badge tone="neutral">{all.length} alumnos</Badge>
        {counts.map(({ value, count }) => (
          <Badge key={value} tone={leadStatusTone(value)}>
            {value}: {count}
          </Badge>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CrmFilters
          key={`${params.q ?? ""}-${status}-${language}`}
          q={typeof params.q === "string" ? params.q : ""}
          status={status}
          language={language}
        />

        {error ? (
          <p className="p-6 text-sm text-error">No se pudieron cargar los alumnos.</p>
        ) : leads.length === 0 ? (
          <EmptyState
            icon={Users}
            title={all.length === 0 ? "Aún no hay alumnos" : "Sin resultados"}
            description={all.length === 0 ? "Cuando se registren aparecerán aquí." : "Prueba con otros filtros."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-100 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3">Alumno</th>
                  <th scope="col" className="px-5 py-3">Contacto</th>
                  <th scope="col" className="px-5 py-3">Interés</th>
                  <th scope="col" className="px-5 py-3">Test</th>
                  <th scope="col" className="px-5 py-3">Estado</th>
                  <th scope="col" className="px-5 py-3 text-right"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {leads.map((item) => {
                  const test = item.tests[0];
                  return (
                    <tr key={item.id} className="align-top transition hover:bg-neutral-50">
                      <td className="px-5 py-4">
                        <p className="font-bold text-neutral-900">{item.name}</p>
                        <p className="text-xs text-neutral-400">Alta: {formatDate(item.createdAt)}</p>
                        {item.lead?.note && <p className="mt-1 max-w-56 truncate text-xs text-primary" title={item.lead.note}>📝 {item.lead.note}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <a href={`mailto:${item.email}`} className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-primary">
                          <Mail size={13} aria-hidden="true" />
                          {item.email}
                        </a>
                        {item.phone && (
                          <a href={`tel:${item.phone.replace(/\s/g, "")}`} className="mt-1 flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-primary">
                            <Phone size={13} aria-hidden="true" />
                            {item.phone}
                          </a>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {item.lead?.language ? (
                          <span className="flex items-center gap-2">
                            <Flag language={item.lead.language} className="size-6 ring-1" />
                            <span>
                              <span className="block font-semibold text-neutral-800">{item.lead.language}</span>
                              <span className="block text-xs text-neutral-400">{item.lead.schedule}</span>
                            </span>
                          </span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {test ? (
                          <Badge tone={test.status === "evaluated" ? "success" : "warning"}>
                            {test.status === "evaluated" ? test.assigned_level : "Pendiente"}
                          </Badge>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Badge tone={item.lead ? leadStatusTone(item.lead.status) : "neutral"}>
                          {item.lead?.status ?? "Sin cuestionario"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <LeadManager lead={item} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
