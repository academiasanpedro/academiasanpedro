// Idiomas ofertados
// Ref: AcademiaSanPedro/02_Business.md → Oferta

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Flag from "@/components/ui/Flag";
import SectionHeading from "@/components/ui/SectionHeading";

const LANGUAGE_CARDS = [
  {
    language: "Inglés",
    tag: "Idioma principal",
    text: "Desde los primeros niveles hasta C2. Preparación oficial Cambridge: Preliminary, First, Advanced y Proficiency.",
    exams: ["B1", "B2", "C1", "C2"],
    featured: true,
  },
  {
    language: "Francés",
    tag: "DELF · DALF",
    text: "Grupos adaptados a tu nivel y preparación de los certificados oficiales DELF y DALF.",
    exams: ["DELF", "DALF"],
  },
  {
    language: "Alemán",
    tag: "Extensivo o intensivo",
    text: "Grupos homogéneos por nivel, conversación y preparación de exámenes oficiales.",
    exams: ["Conversación", "Exámenes oficiales"],
  },
  {
    language: "Italiano",
    tag: "Extensivo o intensivo",
    text: "Conversación, preparación de entrevistas y presentaciones, y certificados oficiales.",
    exams: ["Conversación", "Exámenes oficiales"],
  },
];

export default function Languages() {
  return (
    <section id="idiomas" className="bg-neutral-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Idiomas"
          title="Cuatro idiomas, un mismo método"
          description="Te ubicamos en el grupo adecuado tras una prueba de nivel y te acompañamos hasta tu certificación oficial."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LANGUAGE_CARDS.map((card) => (
            <article
              key={card.language}
              className={
                card.featured
                  ? "reveal group relative overflow-hidden rounded-3xl bg-primary p-7 text-white shadow-glow-primary transition duration-300 hover:-translate-y-1.5"
                  : "reveal group relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-lift"
              }
            >
              {card.featured && <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-secondary/40 blur-3xl" />}
              <div className="relative">
                <div className="flex items-start justify-between">
                  <Flag language={card.language} className="size-14 transition duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  <span
                    className={
                      card.featured
                        ? "rounded-lg bg-white/15 px-2.5 py-1 text-xs font-bold text-white"
                        : "rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary"
                    }
                  >
                    {card.tag}
                  </span>
                </div>
                <h3 className="mt-8 text-2xl font-black tracking-tight">{card.language}</h3>
                <p className={card.featured ? "mt-3 text-white/75" : "mt-3 text-neutral-500"}>{card.text}</p>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {card.exams.map((exam) => (
                    <span
                      key={exam}
                      className={
                        card.featured
                          ? "rounded-md bg-white px-2 py-0.5 text-xs font-black text-primary"
                          : "rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-black text-neutral-600"
                      }
                    >
                      {exam}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm font-medium text-neutral-500">
          ¿No sabes qué nivel tienes?{" "}
          <Link href="/auth/registro" className="inline-flex items-center gap-1 font-bold text-primary hover:text-primary-dark">
            Haz la prueba de nivel online <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
