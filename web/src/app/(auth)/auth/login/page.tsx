// Página de Login
// Ruta: /auth/login
// Ref: AcademiaSanPedro/02_Architecture/02_Frontend_Routes.md

import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/features/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Academia San Pedro",
  description:
    "Accede a tu cuenta de la Academia de Idiomas San Pedro para gestionar tus clases y realizar el test de nivel.",
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-600 tracking-tight">
          Bienvenido/a de nuevo
        </h1>
        <p className="mt-3 text-neutral-500 font-medium text-lg">
          Inicia sesión para acceder a tu panel de alumno.
        </p>
      </div>

      <LoginForm />

      <p className="mt-8 text-center text-sm text-neutral-700">
        ¿No tienes cuenta?{" "}
        <Link
          href="/auth/registro"
          className="font-semibold text-primary hover:text-primary-dark transition-colors duration-200"
        >
          Regístrate
        </Link>
      </p>
    </>
  );
}
