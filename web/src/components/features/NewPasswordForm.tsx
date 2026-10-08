// Nueva contraseña tras abrir el enlace de recuperación (requiere la sesión creada por /auth/callback)

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPasswordSchema, type NewPasswordFormData } from "@/lib/validators/auth";
import { createClient } from "@/lib/supabase/client";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import PasswordInput from "./PasswordInput";

export default function NewPasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormData>({ resolver: zodResolver(newPasswordSchema) });

  const onSubmit = async ({ password }: NewPasswordFormData) => {
    setServerError(null);
    const { error } = await createClient().auth.updateUser({ password });

    if (error) {
      setServerError(
        /different from the old/i.test(error.message)
          ? "La nueva contraseña debe ser distinta de la anterior."
          : "No se pudo actualizar la contraseña. Solicita un nuevo enlace e inténtalo otra vez."
      );
      return;
    }

    router.replace("/dashboard?password_updated=1");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <PasswordInput
        label="Nueva contraseña"
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
      {serverError && <Alert tone="error">{serverError}</Alert>}
      <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} loadingText="Guardando…">
        Guardar contraseña
      </Button>
    </form>
  );
}
