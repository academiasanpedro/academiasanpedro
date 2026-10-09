// Hero — Primer impacto
// Ref: AcademiaSanPedro/02_Business.md → Mensajes y Datos verificados

import { ArrowRight, Award, Check, Clock3, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import Flag from "@/components/ui/Flag";
import { LANGUAGES } from "@/lib/constants";

const TRUST = [
  { value: "+90 %", label: "aprobados en Cambridge" },
  { value: "+25 años", label: "de experiencia del profesorado" },
  { value: "4–65+", label: "años: todas las edades" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-primary-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/3 -left-1/4 h-[80%] w-[70%] rounded-full bg-primary/60 blur-[140px]" />
        <div className="absolute top-1/4 -right-1/4 h-[70%] w-[55%] rounded-full bg-secondary/30 blur-[130px]" />
        <div className="absolute inset-0 bg-dots opacity-[0.04]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary-950 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 pt-16 pb-24 md:pt-24 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:pt-28 lg:pb-32">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-md">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-secondary" />
            </span>
            Centro Preparador Oficial Cambridge<span className="hidden sm:inline"> · Huelva</span>
          </p>

          <h1 className="mt-8 text-5xl leading-[1.02] font-black tracking-tighter text-balance sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
            Tu idioma. Tu nivel.{" "}
            <span className="bg-gradient-to-r from-secondary-soft via-secondary-light to-white bg-clip-text text-transparent">
              Tu objetivo.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed font-medium text-pretty text-white/70 sm:text-xl">
            Aprende inglés, francés, alemán o italiano con grupos adaptados a tu nivel y prepárate para conseguir tu
            certificación oficial.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/auth/registro" variant="secondary" size="lg" className="group">
              Haz tu prueba de nivel gratis
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/#contacto" variant="light" size="lg">
              Solicitar información
            </ButtonLink>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-white/60">
            <span className="flex gap-0.5 text-gold" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </span>
            <span>
              <strong className="text-white">5,0/5</strong> en reseñas públicas
            </span>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {TRUST.map((item) => (
              <div key={item.label}>
                <dt className="sr-only">{item.label}</dt>
                <dd className="text-xl font-black tracking-tight whitespace-nowrap sm:text-3xl">{item.value}</dd>
                <dd className="mt-1 text-xs leading-snug font-semibold text-white/55 sm:text-sm">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

/** Composición decorativa: tarjeta del test online + nivel asignado + idiomas. */
function HeroVisual() {
  return (
    <div className="relative mx-auto hidden w-full max-w-md lg:block" aria-hidden="true">
      <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-xl animate-fade-up [animation-delay:150ms]">
        <div className="flex items-center justify-between text-xs font-bold text-white/50">
          <span className="flex items-center gap-2">
            <Flag language="Inglés" className="size-6 ring-1 ring-white/30" />
            Test de nivel · Inglés
          </span>
          <span>7 / 20</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-secondary to-secondary-soft" />
        </div>
        <p className="mt-6 text-xl font-bold">She ____ to Huelva every summer.</p>
        <div className="mt-5 space-y-2.5">
          {["go", "goes", "going", "gone"].map((option, index) => (
            <div
              key={option}
              className={
                index === 1
                  ? "flex items-center gap-3 rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-bold"
                  : "flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/70"
              }
            >
              <span
                className={
                  index === 1
                    ? "grid size-7 place-items-center rounded-lg bg-white text-xs font-black text-primary"
                    : "grid size-7 place-items-center rounded-lg bg-white/10 text-xs font-black"
                }
              >
                {"ABCD"[index]}
              </span>
              {option}
              {index === 1 && <Check size={16} className="ml-auto" />}
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white/50">
          <Clock3 size={14} />
          Sin límite de tiempo · corregido por profesores
        </div>
      </div>

      <div className="absolute -top-16 -right-8 rounded-2xl bg-white p-4 text-neutral-900 shadow-lift animate-float">
        <p className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Nivel asignado</p>
        <p className="mt-1 flex items-center gap-2 text-2xl font-black text-primary">
          <Award size={22} className="text-secondary" />
          B2 · First
        </p>
      </div>

      <div className="absolute -bottom-16 -left-12 flex items-center gap-3 rounded-2xl border border-white/10 bg-primary-dark/90 px-4 py-3 shadow-2xl backdrop-blur-xl animate-float [animation-delay:-3s]">
        <div className="flex -space-x-2">
          {LANGUAGES.map((language) => (
            <Flag key={language} language={language} className="size-8 ring-2 ring-primary-dark" />
          ))}
        </div>
        <p className="text-sm leading-tight font-bold">
          4 idiomas
          <span className="block text-xs font-semibold text-white/50">desde Playschool a C2</span>
        </p>
      </div>
    </div>
  );
}
