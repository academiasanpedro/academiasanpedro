// Página de Registro
// Ruta: /auth/registro
// Ref: AcademiaSanPedro/02_Architecture/02_Frontend_Routes.md

import type { Metadata } from "next";
import Link from "next/link";
import RegistroForm from "@/components/features/RegistroForm";

export const metadata: Metadata = {
  title: "Crear Cuenta | Academia San Pedro",
  description:
    "Regístrate en la Academia de Idiomas San Pedro. Descubre tu nivel y comienza tu camino para dominar un nuevo idioma.",
};

export default function RegistroPage() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-600 tracking-tight">
          Crea tu cuenta
        </h1>
        <p className="mt-3 text-neutral-500 font-medium text-lg">
          Regístrate para descubrir tu nivel y encontrar el curso perfecto.
        </p>
      </div>

      <RegistroForm />

      <p className="mt-8 text-center text-sm text-neutral-700">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-primary hover:text-primary-dark transition-colors duration-200"
        >
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
