// Formulario de Login
// Ref: AcademiaSanPedro/03_Flows.md → Login

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";
import { createClient } from "@/lib/supabase/client";
import { InputField } from "@/components/ui/Form";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

const URL_ERRORS: Record<string, string> = {
  oauth: "No se pudo completar el inicio de sesión con Google. Inténtalo de nuevo.",
  link: "El enlace ha caducado o se abrió en otro navegador. Inicia sesión o solicita uno nuevo.",
};

export default function LoginForm({ next, urlError }: { next: string; urlError?: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(urlError ? URL_ERRORS[urlError] ?? null : null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const { error } = await createClient().auth.signInWithPassword(data);

    if (error) {
      setServerError(
        /not confirmed/i.test(error.message)
          ? "Tu email aún no está confirmado. Revisa tu bandeja de entrada (o spam) y pulsa el enlace de verificación."
          : "Email o contraseña incorrectos."
      );
      return;
    }

    router.replace(next);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <InputField
          label="Email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <div className="flex flex-col gap-2">
          <PasswordInput
            label="Contraseña"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Link
            href="/auth/recuperar"
            className="self-end text-sm font-semibold text-primary transition hover:text-primary-dark"
          >
            ¿Has olvidado tu contraseña?
          </Link>
        </div>

        {serverError && <Alert tone="error">{serverError}</Alert>}

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} loadingText="Entrando…">
          Iniciar sesión
        </Button>
      </form>

      <GoogleButton next={next} />
    </div>
  );
}
