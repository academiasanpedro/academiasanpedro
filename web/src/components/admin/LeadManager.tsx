"use client";

// Ficha del alumno en el CRM: datos del cuestionario, tests y edición de estado + nota interna

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, SlidersHorizontal } from "lucide-react";
import { updateLead } from "@/app/actions/crm";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Flag from "@/components/ui/Flag";
import { SelectField, TextareaField } from "@/components/ui/Form";
import Modal from "@/components/ui/Modal";
import { cefrLabel, LEAD_STATUSES } from "@/lib/constants";

export interface CrmLead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  lead: {
    id: string;
    status: string;
    language: string | null;
    level: string | null;
    schedule: string | null;
    goals: string | null;
    note: string | null;
  } | null;
  tests: { language: string; status: string; assigned_level: string | null }[];
}

export default function LeadManager({ lead: item }: { lead: CrmLead }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(item.lead?.status ?? "Interesado");
  const [note, setNote] = useState(item.lead?.note ?? "");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSave = async () => {
    if (!item.lead) return;
    setSaving(true);
    setFeedback(null);
    const result = await updateLead({ leadId: item.lead.id, status, note });
    setSaving(false);
    if (result.ok) {
      setFeedback({ ok: true, text: result.message ?? "Guardado." });
      router.refresh();
    } else {
      setFeedback({ ok: false, text: result.error });
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <SlidersHorizontal size={14} aria-hidden="true" />
        Gestionar
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={item.name}
        description={
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1.5 hover:text-primary">
              <Mail size={14} aria-hidden="true" /> {item.email}
            </a>
            {item.phone && (
              <a href={`tel:${item.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-primary">
                <Phone size={14} aria-hidden="true" /> {item.phone}
              </a>
            )}
          </span>
        }
        footer={
          item.lead ? (
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cerrar
              </Button>
              <Button onClick={handleSave} isLoading={saving} loadingText="Guardando…">
                Guardar cambios
              </Button>
            </>
          ) : undefined
        }
      >
        <div className="space-y-6 text-left">
          {item.lead ? (
            <dl className="grid gap-3 sm:grid-cols-3">
              {[
                ["Idioma", item.lead.language],
                ["Nivel estimado", item.lead.level],
                ["Horario", item.lead.schedule],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-neutral-50 p-3">
                  <dt className="text-xs font-semibold text-neutral-400">{label}</dt>
                  <dd className="mt-1 flex items-center gap-2 font-bold text-neutral-800">
                    {label === "Idioma" && value && <Flag language={value} className="size-5 ring-1" />}
                    {value || "—"}
                  </dd>
                </div>
              ))}
              {item.lead.goals && (
                <div className="rounded-2xl bg-neutral-50 p-3 sm:col-span-3">
                  <dt className="text-xs font-semibold text-neutral-400">Objetivos</dt>
                  <dd className="mt-1 text-sm whitespace-pre-line text-neutral-700">{item.lead.goals}</dd>
                </div>
              )}
            </dl>
          ) : (
            <Alert tone="info">Este alumno aún no ha completado el cuestionario, por eso no tiene estado comercial.</Alert>
          )}

          <div>
            <p className="mb-2 text-xs font-semibold text-neutral-400">Tests de nivel</p>
            {item.tests.length === 0 ? (
              <p className="text-sm text-neutral-500">Sin tests enviados.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {item.tests.map((test) => (
                  <Badge key={test.language} tone={test.status === "evaluated" ? "success" : "warning"}>
                    {test.language}: {test.status === "evaluated" ? cefrLabel(test.assigned_level) : "pendiente"}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {item.lead && (
            <div className="grid gap-5 border-t border-neutral-100 pt-6">
              <SelectField label="Estado comercial" value={status} onChange={(event) => setStatus(event.target.value)}>
                {LEAD_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </SelectField>
              <TextareaField
                label="Nota interna"
                optional
                rows={4}
                maxLength={2000}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Ej.: llamado el 12/10, interesada en intensivo de verano."
                hint="Solo visible para administradores."
              />
              {feedback && <Alert tone={feedback.ok ? "success" : "error"}>{feedback.text}</Alert>}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
