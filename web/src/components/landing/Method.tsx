// Método / Por qué elegirnos — servicios diferenciadores (bento)
// Ref: AcademiaSanPedro/02_Business.md → Servicios

import { BookOpen, LineChart, MonitorSmartphone, Snowflake, Users, UserRoundCheck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    icon: UserRoundCheck,
    title: "Profesores nativos y bilingües",
    text: "Un equipo con más de 25 años de experiencia acumulada enseñando idiomas.",
    className: "lg:col-span-2 bg-primary text-white",
    dark: true,
  },
  {
    icon: Users,
    title: "Grupos homogéneos",
    text: "La prueba de nivel nos permite formar grupos donde todos avanzan al mismo ritmo.",
  },
  {
    icon: LineChart,
    title: "Seguimiento individual",
    text: "Tutorías, feedback de tus progresos y refuerzos personalizados cuando los necesitas.",
  },
  {
    icon: BookOpen,
    title: "Material físico y online",
    text: "Recursos actualizados para practicar gramática, vocabulario y pronunciación.",
  },
  {
    icon: MonitorSmartphone,
    title: "Método dinámico y práctico",
    text: "Clases participativas con ejercicios prácticos orientados a usar el idioma desde el primer día.",
    className: "lg:col-span-2",
  },
  {
    icon: Snowflake,
    title: "Aulas equipadas",
    text: "Aulas climatizadas y equipadas con tecnología, en la Plaza San Pedro de Huelva.",
  },
];

export default function Method() {
  return (
    <section id="metodo" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Método San Pedro"
          title={
            <>
              No solo enseñamos idiomas: <span className="text-primary">te acompañamos</span>
            </>
          }
          description="Seguimiento cercano, profesores experimentados y una preparación orientada a resultados, desde los primeros niveles hasta las certificaciones oficiales."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, text, className, dark }) => (
            <article
              key={title}
              className={cn(
                "reveal group rounded-3xl p-7 transition duration-300 hover:-translate-y-1",
                dark ? "shadow-glow-primary" : "border border-neutral-200/70 bg-neutral-50 hover:bg-white hover:shadow-lift",
                className
              )}
            >
              <div
                className={cn(
                  "grid size-12 place-items-center rounded-2xl transition duration-500 group-hover:scale-110 group-hover:-rotate-6",
                  dark ? "bg-white/15 text-white" : "bg-white text-primary shadow-sm ring-1 ring-neutral-200/70"
                )}
              >
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3 className={cn("mt-6 text-xl font-black tracking-tight", dark ? "text-white" : "text-neutral-900")}>{title}</h3>
              <p className={cn("mt-2 leading-relaxed", dark ? "text-white/75" : "text-neutral-500")}>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
