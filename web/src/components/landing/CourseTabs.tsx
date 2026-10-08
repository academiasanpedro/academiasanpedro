"use client";

// Pestañas de cursos por público (accesibles con teclado: ←/→)

import { useRef, useState, type KeyboardEvent } from "react";
import { Baby, Briefcase, GraduationCap, HeartHandshake, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const AUDIENCES = [
  {
    id: "ninos",
    label: "Niños y jóvenes",
    icon: Baby,
    courses: [
      { title: "Playschool", meta: "Desde 4 años", text: "El primer contacto con el inglés, de forma dinámica y adaptada a su edad." },
      { title: "Niños y adolescentes", meta: "Por edad y nivel", text: "Grupos homogéneos con seguimiento personalizado y feedback de sus progresos." },
    ],
  },
  {
    id: "adultos",
    label: "Adultos",
    icon: Users,
    courses: [
      { title: "Cursos extensivos", meta: "~9 meses", text: "Progreso constante durante el curso, en grupos homogéneos por nivel." },
      { title: "Cursos intensivos", meta: "~3 meses", text: "Para avanzar rápido o preparar un examen con fecha cercana." },
      { title: "Clases de conversación", meta: "Todos los niveles", text: "Gana soltura y pierde el miedo a hablar en situaciones reales." },
    ],
  },
  {
    id: "profesionales",
    label: "Profesionales",
    icon: Briefcase,
    courses: [
      { title: "Inglés profesional", meta: "A medida", text: "Formación específica de inglés para tu entorno laboral." },
      { title: "Entrevistas de trabajo", meta: "Preparación", text: "Practica las preguntas clave y presenta tu perfil con confianza." },
      { title: "Clases one-to-one", meta: "Individual", text: "Horario flexible y contenidos 100 % adaptados a tu objetivo." },
    ],
  },
  {
    id: "examenes",
    label: "Exámenes oficiales",
    icon: GraduationCap,
    courses: [
      { title: "Cambridge English", meta: "B1 · B2 · C1 · C2", text: "Centro Preparador Oficial: Preliminary, First, Advanced y Proficiency." },
      { title: "DELF y DALF", meta: "Francés", text: "Preparación de los diplomas oficiales de francés." },
      { title: "Otros certificados", meta: "Alemán · Italiano", text: "Te orientamos sobre el examen oficial que necesitas y te preparamos." },
    ],
  },
  {
    id: "mayores",
    label: "+65 años",
    icon: HeartHandshake,
    courses: [
      { title: "Grupos para mayores de 65", meta: "Grupos específicos", text: "Aprende o retoma un idioma en un ambiente cercano, a tu ritmo." },
      { title: "Clases one-to-one", meta: "Individual", text: "Si prefieres atención exclusiva, adaptamos contenidos y horario a ti." },
    ],
  },
];

export default function CourseTabs() {
  const [active, setActive] = useState(AUDIENCES[1].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = AUDIENCES.find((audience) => audience.id === active) ?? AUDIENCES[0];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const index = AUDIENCES.findIndex((audience) => audience.id === active);
    const next = (index + (event.key === "ArrowRight" ? 1 : -1) + AUDIENCES.length) % AUDIENCES.length;
    setActive(AUDIENCES[next].id);
    tabRefs.current[next]?.focus();
    event.preventDefault();
  };

  return (
    <div className="mt-14">
      <div
        role="tablist"
        aria-label="Cursos por público"
        onKeyDown={onKeyDown}
        className="mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-2xl bg-neutral-100 p-1.5"
      >
        {AUDIENCES.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            id={`tab-${id}`}
            type="button"
            role="tab"
            aria-selected={active === id}
            aria-controls={`panel-${id}`}
            tabIndex={active === id ? 0 : -1}
            onClick={() => setActive(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition",
              active === id ? "bg-white text-primary shadow-sm" : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div
        key={current.id}
        id={`panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${current.id}`}
        className={cn("mx-auto mt-10 grid gap-5", current.courses.length === 2 ? "max-w-4xl md:grid-cols-2" : "md:grid-cols-3")}
      >
        {current.courses.map((course, index) => (
          <article
            key={course.title}
            style={{ animationDelay: `${index * 70}ms` }}
            className="group rounded-3xl border border-neutral-200/70 bg-white p-7 shadow-soft transition duration-300 animate-fade-up hover:-translate-y-1 hover:border-primary/20 hover:shadow-lift"
          >
            <span className="inline-flex rounded-lg bg-secondary/10 px-2.5 py-1 text-xs font-bold text-secondary">{course.meta}</span>
            <h3 className="mt-5 text-xl font-black tracking-tight text-neutral-900 transition group-hover:text-primary">{course.title}</h3>
            <p className="mt-2 leading-relaxed text-neutral-500">{course.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
