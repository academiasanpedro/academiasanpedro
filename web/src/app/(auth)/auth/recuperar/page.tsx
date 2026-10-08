// Recuperar contraseña — Ruta: /auth/recuperar

import type { Metadata } from "next";
import Link from "next/link";
import AuthHeading from "@/components/features/AuthHeading";
import RecoveryForm from "@/components/features/RecoveryForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false },
};

export default function RecuperarPage() {
  return (
    <>
      <AuthHeading
        title="Recupera tu acceso"
        description="Escribe el email de tu cuenta y te enviaremos un enlace para crear una contraseña nueva."
      />
      <RecoveryForm />
      <p className="mt-8 text-center text-sm text-neutral-600">
        ¿La recuerdas?{" "}
        <Link href="/auth/login" className="font-bold text-primary transition hover:text-primary-dark">
          Volver a iniciar sesión
        </Link>
      </p>
    </>
  );
}
