// Llamada a la acción final

import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function FinalCta() {
  return (
    <section className="bg-neutral-50 px-5 pb-20 md:pb-28 lg:px-8">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-secondary via-secondary-dark to-primary-dark px-6 py-16 text-center text-white shadow-glow-secondary sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-[0.06]" />
        <div className="pointer-events-none absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-white/10 blur-3xl" />
        <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight text-balance sm:text-5xl">
          Descubre tu nivel hoy y empieza a avanzar
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
          Regístrate gratis, haz el test online y un profesor te dirá qué grupo es el tuyo.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <ButtonLink href="/auth/registro" variant="white" size="lg">
            Empezar ahora
            <ArrowRight size={18} aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/#contacto" variant="light" size="lg">
            Prefiero que me llaméis
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
