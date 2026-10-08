"use client";

// Formulario de contacto público (Server Action + honeypot anti-spam)
// Ref: AcademiaSanPedro/03_Flows.md → Contacto público

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { sendContactRequest } from "@/app/actions/contact";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { CheckboxField, InputField, SelectField, TextareaField } from "@/components/ui/Form";
import { LANGUAGES } from "@/lib/constants";
import { contactSchema, type ContactFormData } from "@/lib/validators/contact";

export default function ContactForm() {
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", language: "", message: "", privacy: false, website: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    setResult(null);
    const response = await sendContactRequest(data);
    if (response.ok) {
      reset();
      setResult({ ok: true, text: response.message ?? "¡Mensaje enviado!" });
    } else {
      setResult({ ok: false, text: response.error });
    }
  };

  if (result?.ok) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-success/5 p-10 text-center animate-scale-in">
        <CheckCircle2 size={44} className="text-success" aria-hidden="true" />
        <p className="mt-5 text-2xl font-black tracking-tight text-neutral-900">{result.text}</p>
        <p className="mt-2 text-neutral-500">Solemos responder en menos de 24 horas laborables.</p>
        <Button variant="outline" className="mt-6" onClick={() => setResult(null)}>
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2" noValidate>
      <InputField label="Nombre" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <InputField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <InputField label="Teléfono" type="tel" autoComplete="tel" optional error={errors.phone?.message} {...register("phone")} />
      <SelectField label="Idioma de interés" optional error={errors.language?.message} {...register("language")}>
        <option value="">Aún no lo sé</option>
        {LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </SelectField>
      <TextareaField
        label="Mensaje"
        rows={4}
        wrapperClassName="sm:col-span-2"
        placeholder="Cuéntanos qué necesitas: idioma, edad del alumno, horario, examen…"
        error={errors.message?.message}
        {...register("message")}
      />

      {/* Honeypot: invisible para personas */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">No rellenar</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <CheckboxField
        className="sm:col-span-2"
        label={
          <>
            Acepto la{" "}
            <Link href="/legal/privacidad" target="_blank" className="font-semibold text-primary hover:underline">
              política de privacidad
            </Link>{" "}
            para que podáis responder a mi consulta.
          </>
        }
        error={errors.privacy?.message}
        {...register("privacy")}
      />

      {result && !result.ok && (
        <Alert tone="error" className="sm:col-span-2">
          {result.text}
        </Alert>
      )}

      <Button type="submit" variant="secondary" size="lg" isLoading={isSubmitting} loadingText="Enviando…" className="sm:col-span-2">
        <Send size={18} aria-hidden="true" />
        Enviar mensaje
      </Button>
    </form>
  );
}
