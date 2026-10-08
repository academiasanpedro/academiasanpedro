// Componente de negocio — Formulario de Registro
// Ref: AcademiaSanPedro/01_Requirements/01_User_Flow_Login.md → Flujo de Registro (Sign Up)

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registroSchema, type RegistroFormData } from "@/lib/validators/auth";
import { createClient } from "@/lib/supabase/client";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import DividerWithText from "@/components/ui/DividerWithText";
import GoogleIcon from "@/components/ui/GoogleIcon";

export default function RegistroForm() {
  const router = useRouter();
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Registro con email y contraseña
  const onSubmit = async (data: RegistroFormData) => {
    setServerError(null);
    setSuccessMessage(null);

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setServerError("Este email ya está registrado. Inicia sesión.");
      } else {
        setServerError("Error al crear la cuenta. Inténtalo de nuevo.");
      }
      return;
    }

    // Si Supabase requiere confirmación de email, no habrá sesión activa
    if (authData.user && !authData.session) {
      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
      return;
    }

    // Si no requiere confirmación, redirigir al cuestionario
    router.push("/dashboard/cuestionario");
    router.refresh();
  };

  // Registro/Login con Google OAuth
  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mensaje de éxito post-registro (cuando se requiere confirmación de email) */}
      {successMessage && (
        <div
          className="rounded-xl bg-success/10 border border-success/20 px-5 py-4 text-sm text-success"
          role="status"
        >
          <p className="font-semibold mb-1">✅ ¡Registro exitoso!</p>
          <p>{successMessage}</p>
        </div>
      )}

      {/* Formulario de email/contraseña — se oculta si ya se registró */}
      {!successMessage && (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          label="Nombre completo"
          type="text"
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
        <InputField
          label="Contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <InputField
          label="Confirmar contraseña"
          type="password"
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
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
          Crear Cuenta
        </Button>
      </form>
      )}

      {/* Separador y OAuth — se ocultan tras registro exitoso */}
      {!successMessage && (
      <>
      <DividerWithText text="o continúa con" />

      {/* Botón de Google OAuth */}
      <Button variant="google" type="button" onClick={handleGoogleSignUp}>
        <span className="flex items-center justify-center gap-3">
          <GoogleIcon />
          Continuar con Google
        </span>
      </Button>
      </>
      )}
    </div>
  );
}
