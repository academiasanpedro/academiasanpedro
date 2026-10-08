// Página de Login — Ruta: /auth/login (?next, ?error)

import type { Metadata } from "next";
import Link from "next/link";
import AuthHeading from "@/components/features/AuthHeading";
import LoginForm from "@/components/features/LoginForm";
import { safeRedirectPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu área de alumno de la Academia de Idiomas San Pedro.",
  robots: { index: false },
};

export default async function LoginPage({ searchParams }: PageProps<"/auth/login">) {
  const params = await searchParams;
  const next = safeRedirectPath(typeof params.next === "string" ? params.next : null);
  const error = typeof params.error === "string" ? params.error : undefined;

  return (
    <>
      <AuthHeading title="Bienvenido/a de nuevo" description="Inicia sesión para continuar con tu test de nivel y tu panel de alumno." />
      <LoginForm next={next} urlError={error} />
      <p className="mt-8 text-center text-sm text-neutral-600">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/registro" className="font-bold text-primary transition hover:text-primary-dark">
          Regístrate gratis
        </Link>
      </p>
    </>
  );
}
