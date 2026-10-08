// Solicitud de enlace para restablecer la contraseña
// Ref: AcademiaSanPedro/03_Flows.md → Recuperar contraseña

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { recoverySchema, type RecoveryFormData } from "@/lib/validators/auth";
import { authCallbackUrl, rememberNextPath } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase/client";
import { InputField } from "@/components/ui/Form";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";

export default function RecoveryForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoveryFormData>({ resolver: zodResolver(recoverySchema) });

  const onSubmit = async ({ email }: RecoveryFormData) => {
    setServerError(null);
    rememberNextPath("/auth/nueva-contrasena");
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: authCallbackUrl(),
    });

    // Errores de límite de envíos sí se muestran; el resto se trata igual para no revelar si el email existe
    if (error && /rate limit|security purposes/i.test(error.message)) {
      setServerError("Has solicitado demasiados enlaces. Espera unos minutos e inténtalo de nuevo.");
      return;
    }
    setSentTo(email);
  };

  if (sentTo) {
    return (
      <div className="rounded-3xl border border-success/20 bg-success/5 p-6 text-center animate-scale-in">
        <MailCheck size={36} className="mx-auto text-success" aria-hidden="true" />
        <p className="mt-4 font-bold text-neutral-900">Revisa tu correo</p>
        <p className="mt-2 text-sm text-neutral-600">
          Si existe una cuenta con <strong>{sentTo}</strong>, recibirás un enlace para crear una nueva contraseña. Mira
          también en spam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <InputField
        label="Email de tu cuenta"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      {serverError && <Alert tone="error">{serverError}</Alert>}
      <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} loadingText="Enviando…">
        Enviar enlace
      </Button>
    </form>
  );
}
