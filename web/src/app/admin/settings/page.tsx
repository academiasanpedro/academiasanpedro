// Configuración — Ruta: /admin/settings (estado de integraciones, solo lectura)

import type { Metadata } from "next";
import { CheckCircle2, Database, ExternalLink, Mail, MapPin, Phone, XCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { CONTACT, SITE_URL } from "@/lib/constants";
import { getAcademyInbox, isEmailConfigured } from "@/lib/email";

export const metadata: Metadata = { title: "Configuración" };

function Status({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${ok ? "text-success" : "text-error"}`}>
      {ok ? <CheckCircle2 size={16} aria-hidden="true" /> : <XCircle size={16} aria-hidden="true" />}
      {label}
    </span>
  );
}

export default function AdminSettingsPage() {
  const emailReady = isEmailConfigured();
  const supabaseReady = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const supabaseProject = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\./)?.[1];

  const rows = [
    {
      icon: Database,
      title: "Supabase (base de datos y acceso)",
      status: <Status ok={supabaseReady} label={supabaseReady ? "Conectado" : "Sin configurar"} />,
      detail: "NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY",
      link: supabaseProject ? `https://supabase.com/dashboard/project/${supabaseProject}` : null,
    },
    {
      icon: Mail,
      title: "Envío de emails (Gmail)",
      status: <Status ok={emailReady} label={emailReady ? "Configurado" : "Sin configurar"} />,
      detail: emailReady
        ? `Remitente ${process.env.GMAIL_USER} · avisos y formulario de contacto a ${getAcademyInbox()}`
        : "Define GMAIL_USER y GMAIL_APP_PASSWORD (contraseña de aplicación de Google).",
      link: null,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Configuración" description="Estado de las integraciones y datos públicos de la academia." />

      <Card className="divide-y divide-neutral-100">
        {rows.map(({ icon: Icon, title, status, detail, link }) => (
          <div key={title} className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-50 text-primary">
              <Icon size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-neutral-900">{title}</p>
              <p className="text-sm break-words text-neutral-500">{detail}</p>
            </div>
            <div className="flex items-center gap-4">
              {status}
              {link && (
                <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                  Abrir <ExternalLink size={14} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-6">
        <h2 className="font-black text-neutral-900">Datos públicos de contacto</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Se muestran en la web y en los emails. Se editan en <code className="rounded bg-neutral-100 px-1.5 py-0.5">src/lib/constants.ts</code>.
        </p>
        <ul className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
          <li className="flex gap-3">
            <MapPin size={18} className="shrink-0 text-secondary" aria-hidden="true" />
            <span>
              {CONTACT.address}, {CONTACT.postalCode} {CONTACT.city}
            </span>
          </li>
          <li className="flex gap-3">
            <Phone size={18} className="shrink-0 text-secondary" aria-hidden="true" />
            <span>{CONTACT.phone}</span>
          </li>
          <li className="flex gap-3">
            <Mail size={18} className="shrink-0 text-secondary" aria-hidden="true" />
            <span className="break-all">{CONTACT.email}</span>
          </li>
        </ul>
        <p className="mt-5 text-xs text-neutral-400">URL del sitio: {SITE_URL}</p>
      </Card>
    </div>
  );
}
