// Nueva contraseña — Ruta: /auth/nueva-contrasena (se llega desde el email de recuperación)

import type { Metadata } from "next";
import AuthHeading from "@/components/features/AuthHeading";
import NewPasswordForm from "@/components/features/NewPasswordForm";
import Alert from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Nueva contraseña",
  robots: { index: false },
};

export default async function NuevaContrasenaPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <>
        <AuthHeading title="Enlace no válido" description="El enlace ha caducado o ya se ha utilizado." />
        <Alert tone="warning">Por seguridad, los enlaces de recuperación solo funcionan una vez y durante un tiempo limitado.</Alert>
        <ButtonLink href="/auth/recuperar" size="lg" fullWidth className="mt-6">
          Solicitar un enlace nuevo
        </ButtonLink>
      </>
    );
  }

  return (
    <>
      <AuthHeading title="Crea una contraseña nueva" description={`Para la cuenta ${user.email ?? ""}.`} />
      <NewPasswordForm />
    </>
  );
}
