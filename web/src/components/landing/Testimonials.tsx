// Testimonios reales publicados por la academia (literales)
// Ref: AcademiaSanPedro/02_Business.md → Testimonios

import { Quote, Star } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const TESTIMONIALS = [
  { text: "Conseguí mi certificado de B1 de inglés en un curso intensivo este verano.", author: "Alumno/a", tag: "Cambridge B1 · Intensivo" },
  { text: "Llevo 3 años en esta academia y he conseguido dos títulos: B1 y B2.", author: "Alumna", tag: "Cambridge B1 y B2" },
  { text: "Academia dinámica y profesional.", author: "Familia de alumna", tag: "Grupo infantil" },
  { text: "Excelente centro con buenos profesionales.", author: "Alumno/a", tag: "Reseña pública" },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="bg-neutral-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="Opiniones"
            title="Lo que dicen nuestros alumnos"
            description="Cientos de alumnos han pasado por nuestras aulas. Estas son algunas de sus palabras."
          />
          <div className="flex items-center gap-4 rounded-3xl border border-neutral-200/70 bg-white px-6 py-4 shadow-soft">
            <p className="text-4xl font-black tracking-tight text-neutral-900">5,0</p>
            <div>
              <div className="flex gap-0.5 text-gold" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={18} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
              <p className="mt-1 text-xs font-semibold text-neutral-500">6 reseñas públicas</p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((item, index) => (
            <figure
              key={item.text}
              className={
                index === 1
                  ? "reveal flex flex-col justify-between rounded-3xl bg-primary p-7 text-white shadow-glow-primary lg:-translate-y-4"
                  : "reveal flex flex-col justify-between rounded-3xl border border-neutral-200/70 bg-white p-7 shadow-soft"
              }
            >
              <div>
                <Quote size={28} className={index === 1 ? "text-secondary-soft" : "text-secondary"} aria-hidden="true" />
                <blockquote className={index === 1 ? "mt-5 text-lg leading-relaxed font-semibold" : "mt-5 text-lg leading-relaxed font-semibold text-neutral-800"}>
                  “{item.text}”
                </blockquote>
              </div>
              <figcaption className="mt-8">
                <p className={index === 1 ? "font-bold" : "font-bold text-neutral-900"}>{item.author}</p>
                <p className={index === 1 ? "mt-0.5 text-sm font-semibold text-white/60" : "mt-0.5 text-sm font-semibold text-secondary"}>{item.tag}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
