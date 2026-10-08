// Exámenes Cambridge — principal argumento comercial
// Ref: AcademiaSanPedro/02_Business.md → Datos verificados

import { ArrowRight, BadgeCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { CAMBRIDGE_EXAMS } from "@/lib/constants";

const HEIGHTS = ["h-28", "h-40", "h-52", "h-64"];

export default function Exams() {
  return (
    <section id="examenes" className="relative isolate overflow-hidden bg-primary-950 py-20 text-white md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[60%] w-[50%] rounded-full bg-primary/50 blur-[130px]" />
        <div className="absolute right-0 bottom-0 h-[50%] w-[40%] rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute inset-0 bg-dots opacity-[0.03]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            tone="dark"
            eyebrow="Exámenes oficiales"
            title="Centro Preparador Oficial Cambridge"
            description="Te preparamos para Preliminary, First, Advanced y Proficiency con simulacros, tutorías y refuerzos individualizados. También DELF y DALF de francés."
          />
          <div className="mt-10 flex items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="shrink-0 text-5xl font-black tracking-tighter whitespace-nowrap text-white sm:text-6xl">
              {"+90 %"}
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              de nuestros alumnos presentados a exámenes Cambridge consiguen su título, según los datos de la academia.
            </p>
          </div>
          <ButtonLink href="/auth/registro" variant="secondary" size="lg" className="mt-8">
            Descubre tu nivel actual
            <ArrowRight size={18} aria-hidden="true" />
          </ButtonLink>
        </div>

        <div className="reveal" aria-label="Niveles Cambridge de B1 a C2">
          <div className="flex items-end justify-center gap-3 sm:gap-5">
            {CAMBRIDGE_EXAMS.map((exam, index) => (
              <div key={exam.level} className="flex flex-1 flex-col items-center gap-3">
                <BadgeCheck size={22} className={index === 3 ? "text-gold" : "text-white/30"} aria-hidden="true" />
                <div
                  className={`${HEIGHTS[index]} flex w-full flex-col justify-end rounded-2xl border border-white/10 bg-gradient-to-t from-primary to-primary-light/70 p-3 shadow-2xl transition duration-500 hover:-translate-y-2 sm:p-4`}
                >
                  <p className="text-3xl font-black sm:text-4xl">{exam.level}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">{exam.name}</p>
                  <p className="text-xs text-white/50">{exam.short}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
