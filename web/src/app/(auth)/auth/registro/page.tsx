// Página de Registro — Ruta: /auth/registro

import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import AuthHeading from "@/components/features/AuthHeading";
import RegistroForm from "@/components/features/RegistroForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Regístrate gratis en la Academia de Idiomas San Pedro y descubre tu nivel con nuestro test online.",
};

const BENEFITS = ["Test de nivel gratuito", "Evaluado por profesores", "Sin compromiso"];

export default function RegistroPage() {
  return (
    <>
      <AuthHeading title="Crea tu cuenta" description="En 2 minutos podrás hacer tu prueba de nivel online." />
      <ul className="-mt-3 mb-8 flex flex-wrap gap-x-5 gap-y-2">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-center gap-1.5 text-sm font-semibold text-neutral-600">
            <CheckCircle2 size={16} className="text-success" aria-hidden="true" />
            {benefit}
          </li>
        ))}
      </ul>
      <RegistroForm />
      <p className="mt-8 text-center text-sm text-neutral-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="font-bold text-primary transition hover:text-primary-dark">
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
