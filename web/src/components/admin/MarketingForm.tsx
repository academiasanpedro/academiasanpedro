"use client";

// Editor de campaña: segmentación con recuento en vivo, vista previa y confirmación antes de enviar

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Mail, PenLine, Send, ShieldCheck, Users } from "lucide-react";
import { sendMarketingCampaign } from "@/app/actions/marketing";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { InputField, SelectField, TextareaField } from "@/components/ui/Form";
import { LANGUAGES } from "@/lib/constants";
import { matchesAudience, type AudienceMember } from "@/lib/marketing";
import { cn } from "@/lib/utils";
import { marketingSchema, type MarketingFormData } from "@/lib/validators/admin";

const SEGMENTS = [
  { value: "all", label: "Todos los alumnos" },
  { value: "leads", label: "Leads (no matriculados)" },
  { value: "enrolled", label: "Matriculados" },
] as const;

export default function MarketingForm({
  audience,
  totalStudents,
  sender,
}: {
  audience: AudienceMember[];
  totalStudents: number;
  sender: string;
}) {
  const [preview, setPreview] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MarketingFormData>({
    resolver: zodResolver(marketingSchema),
    defaultValues: { subject: "", content: "", segment: "all", language: "" },
  });

  const [segment, language, subject, content] = useWatch({ control, name: ["segment", "language", "subject", "content"] });
  const recipients = useMemo(
    () => audience.filter((member) => matchesAudience(member, segment, language)).length,
    [audience, segment, language]
  );

  const onSubmit = async (data: MarketingFormData) => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setFeedback(null);
    const result = await sendMarketingCampaign(data);
    setConfirming(false);
    if (result.ok) {
      setFeedback({ ok: true, text: result.message ?? "Campaña enviada." });
      reset({ ...data, subject: "", content: "" });
    } else {
      setFeedback({ ok: false, text: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[320px_1fr]" noValidate>
      <Card className="h-fit space-y-5 p-6">
        <h2 className="flex items-center gap-2 font-black text-neutral-900">
          <Users size={18} className="text-primary" aria-hidden="true" />
          Audiencia
        </h2>
        <SelectField label="Segmento" {...register("segment")}>
          {SEGMENTS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </SelectField>
        <SelectField label="Idioma de interés" {...register("language")}>
          <option value="">Cualquier idioma</option>
          {LANGUAGES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </SelectField>

        <div className="rounded-2xl bg-primary-50 p-4">
          <p className="text-xs font-bold text-primary">Recibirán el email</p>
          <p className="mt-1 text-4xl font-black tracking-tight text-primary-dark">{recipients}</p>
          <p className="mt-1 text-xs text-primary-dark/70">
            de {audience.length} con consentimiento · {totalStudents} alumnos en total
          </p>
        </div>
        <ul className="space-y-2 text-xs text-neutral-500">
          <li className="flex gap-2">
            <ShieldCheck size={14} className="shrink-0 text-success" aria-hidden="true" />
            Envío en copia oculta: nadie ve las direcciones de los demás.
          </li>
          <li className="flex gap-2">
            <Mail size={14} className="shrink-0 text-primary" aria-hidden="true" />
            Remitente: {sender || "sin configurar"}
          </li>
        </ul>
      </Card>

      <Card className="flex flex-col p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-black text-neutral-900">Contenido</h2>
          <div className="inline-flex rounded-xl bg-neutral-100 p-1">
            {[
              { id: false, label: "Editar", icon: PenLine },
              { id: true, label: "Vista previa", icon: Eye },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => setPreview(id)}
                aria-pressed={preview === id}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition",
                  preview === id ? "bg-white text-primary shadow-sm" : "text-neutral-500"
                )}
              >
                <Icon size={14} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={cn("space-y-5", preview && "hidden")}>
          <InputField
            label="Asunto"
            placeholder="Ej.: ¡Últimas plazas para el intensivo B1!"
            error={errors.subject?.message}
            {...register("subject")}
          />
          <TextareaField
            label="Mensaje"
            rows={12}
            placeholder="Escribe aquí el comunicado. Los saltos de línea se respetan."
            hint="Se añade automáticamente el pie con los datos de la academia y la opción de baja."
            error={errors.content?.message}
            {...register("content")}
          />
        </div>

        {preview && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="bg-primary px-5 py-4 text-sm font-bold text-white">Academia de Idiomas San Pedro</div>
              <div className="p-5">
                <p className="text-lg font-black text-neutral-900">{subject || "Asunto del email"}</p>
                <p className="mt-3 text-sm whitespace-pre-line text-neutral-600">{content || "El contenido aparecerá aquí."}</p>
              </div>
              <div className="bg-neutral-50 px-5 py-3 text-xs text-neutral-400">Pie con datos de contacto y enlace de baja</div>
            </div>
          </div>
        )}

        {feedback && <Alert tone={feedback.ok ? "success" : "error"} className="mt-5">{feedback.text}</Alert>}
        {confirming && (
          <Alert tone="warning" className="mt-5" title="¿Confirmas el envío?">
            Se enviará a {recipients} destinatario{recipients === 1 ? "" : "s"}. Esta acción no se puede deshacer.
          </Alert>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:justify-end">
          {confirming && (
            <Button variant="ghost" onClick={() => setConfirming(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="secondary" isLoading={isSubmitting} loadingText="Enviando…" disabled={recipients === 0}>
            <Send size={16} aria-hidden="true" />
            {confirming ? `Sí, enviar a ${recipients}` : "Enviar campaña"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
