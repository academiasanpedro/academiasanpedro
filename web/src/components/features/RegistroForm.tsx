// Formulario de Registro
// Ref: AcademiaSanPedro/03_Flows.md → Registro

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registroSchema, type RegistroFormData } from "@/lib/validators/auth";
import { authCallbackUrl, rememberNextPath } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase/client";
import { CheckboxField, InputField } from "@/components/ui/Form";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

const AFTER_SIGNUP = "/dashboard/questionnaire";

export default function RegistroForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: { privacy: false, marketing_consent: false },
  });

  const onSubmit = async (data: RegistroFormData) => {
    setServerError(null);

    rememberNextPath(AFTER_SIGNUP);
    const { data: authData, error } = await createClient().auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name, marketing_consent: data.marketing_consent },
        emailRedirectTo: authCallbackUrl(),
      },
    });

    if (error) {
      setServerError(
        /already registered|already exists/i.test(error.message)
          ? "Este email ya está registrado. Inicia sesión o recupera tu contraseña."
          : "No hemos podido crear la cuenta. Inténtalo de nuevo en unos segundos."
      );
      return;
    }

    // Supabase devuelve un usuario sin identidades si el email ya existía (protección anti-enumeración)
    if (authData.user && authData.user.identities?.length === 0) {
      setServerError("Este email ya está registrado. Inicia sesión o recupera tu contraseña.");
      return;
    }

    // Con confirmación de email activada no hay sesión todavía
    if (!authData.session) {
      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
      return;
    }

    router.replace(AFTER_SIGNUP);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <InputField
          label="Nombre completo"
          placeholder="María García López"
          autoComplete="name"
          error={errors.full_name?.message}
          {...register("full_name")}
        />
        <InputField
          label="Email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordInput
            label="Contraseña"
            placeholder="Mín. 8 caracteres"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordInput
            label="Repite la contraseña"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirm_password?.message}
            {...register("confirm_password")}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-neutral-50 p-4">
          <CheckboxField
            label={
              <>
                He leído y acepto la{" "}
                <Link href="/legal/privacidad" target="_blank" className="font-semibold text-primary underline-offset-2 hover:underline">
                  política de privacidad
                </Link>
                .
              </>
            }
            error={errors.privacy?.message}
            {...register("privacy")}
          />
          <CheckboxField
            label="Quiero recibir novedades, ofertas y apertura de plazos por email (opcional)."
            {...register("marketing_consent")}
          />
        </div>

        {serverError && <Alert tone="error">{serverError}</Alert>}

        <Button type="submit" variant="secondary" size="lg" fullWidth isLoading={isSubmitting} loadingText="Creando cuenta…">
          Crear cuenta gratis
        </Button>
      </form>

      <GoogleButton next={AFTER_SIGNUP} />
      <p className="-mt-2 text-center text-xs text-neutral-400">
        Al continuar con Google aceptas la{" "}
        <Link href="/legal/privacidad" className="underline underline-offset-2 hover:text-neutral-600">
          política de privacidad
        </Link>
        .
      </p>
    </div>
  );
}
