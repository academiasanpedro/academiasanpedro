// Cómo funciona — el embudo online explicado en 4 pasos

import { ClipboardList, PhoneCall, Target, UserPlus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const STEPS = [
  { icon: UserPlus, title: "Crea tu cuenta", text: "Gratis, con tu email o con Google. Menos de un minuto." },
  { icon: ClipboardList, title: "Cuéntanos tu objetivo", text: "Idioma, nivel estimado y horario que prefieres." },
  { icon: Target, title: "Haz el test online", text: "Preguntas tipo test sin límite de tiempo, desde casa." },
  { icon: PhoneCall, title: "Te asignamos grupo", text: "Un profesor evalúa tu nivel y te contactamos con tu recomendación." },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Cómo funciona"
          title="De cero a tu grupo ideal en 4 pasos"
          description="Sin desplazamientos ni compromiso: empieza online y nosotros nos encargamos del resto."
        />

        <ol className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute top-8 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent lg:block" />
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="reveal relative rounded-3xl p-6 text-center">
              <div className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-white text-primary shadow-soft ring-1 ring-neutral-200/70">
                <Icon size={26} aria-hidden="true" />
                <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-secondary text-xs font-black text-white shadow-glow-secondary">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-black tracking-tight text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
