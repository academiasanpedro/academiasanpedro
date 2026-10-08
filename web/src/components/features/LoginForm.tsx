// Componente de negocio — Formulario de Login
// Ref: AcademiaSanPedro/01_Requirements/01_User_Flow_Login.md → Flujo de Login (Sign In)

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth";
import { createClient } from "@/lib/supabase/client";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import DividerWithText from "@/components/ui/DividerWithText";
import GoogleIcon from "@/components/ui/GoogleIcon";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Login con email y contraseña
  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setServerError(
          "Tu email aún no ha sido confirmado. Revisa tu bandeja de entrada (o spam) y haz clic en el enlace de verificación."
        );
      } else {
        setServerError("Email o contraseña incorrectos");
      }
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  // Login con Google OAuth
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Formulario de email/contraseña */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          label="Email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <InputField
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {serverError && (
          <div
            className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error"
            role="alert"
          >
            {serverError}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Iniciar Sesión
        </Button>
      </form>

      {/* Separador */}
      <DividerWithText text="o continúa con" />

      {/* Botón de Google OAuth */}
      <Button variant="google" type="button" onClick={handleGoogleLogin}>
        <span className="flex items-center justify-center gap-3">
          <GoogleIcon />
          Continuar con Google
        </span>
      </Button>
    </div>
  );
}
