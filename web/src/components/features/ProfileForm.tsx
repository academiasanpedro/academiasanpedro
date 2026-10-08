"use client";

// Formulario de perfil (nombre, teléfono y consentimiento de comunicaciones)

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { CheckboxField, InputField } from "@/components/ui/Form";
import { profileSchema, type ProfileFormData } from "@/lib/validators/profile";

export default function ProfileForm({ defaults, email }: { defaults: ProfileFormData; email: string }) {
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema), defaultValues: defaults });

  const onSubmit = async (data: ProfileFormData) => {
    setFeedback(null);
    const result = await updateProfile(data);
    if (result.ok) {
      reset(data);
      setFeedback({ ok: true, text: result.message ?? "Cambios guardados." });
    } else {
      setFeedback({ ok: false, text: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField label="Nombre completo" autoComplete="name" error={errors.full_name?.message} {...register("full_name")} />
        <InputField
          label="Teléfono"
          type="tel"
          autoComplete="tel"
          placeholder="600 000 000"
          optional
          hint="Para avisarte del resultado del test."
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>
      <InputField label="Email" type="email" value={email} disabled readOnly hint="El email no se puede cambiar." />

      <div className="rounded-2xl bg-neutral-50 p-4">
        <CheckboxField
          label="Quiero recibir novedades, ofertas y apertura de plazos por email. Puedes desmarcarlo cuando quieras."
          {...register("marketing_consent")}
        />
      </div>

      {feedback && <Alert tone={feedback.ok ? "success" : "error"}>{feedback.text}</Alert>}

      <div className="flex justify-end border-t border-neutral-100 pt-6">
        <Button type="submit" size="lg" isLoading={isSubmitting} loadingText="Guardando…" disabled={!isDirty}>
          <Save size={18} aria-hidden="true" />
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
