// Preguntas frecuentes (acordeón nativo <details>, sin JS)

import { Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { CONTACT } from "@/lib/constants";

export const FAQS = [
  {
    q: "¿Cómo funciona la prueba de nivel online?",
    a: "Te registras gratis, respondes un breve cuestionario y haces un test tipo test sin límite de tiempo. Un profesor revisa tus respuestas y te comunica tu nivel (A1–C2) por email, junto con una recomendación de grupo.",
  },
  {
    q: "¿Cuánto duran los cursos?",
    a: "Los cursos extensivos duran aproximadamente 9 meses y los intensivos unos 3 meses. También ofrecemos clases individuales one-to-one con horario flexible.",
  },
  {
    q: "¿A partir de qué edad podéis dar clase?",
    a: "Desde los 4 años con Playschool. Tenemos grupos para niños, jóvenes y adultos, y grupos específicos para mayores de 65.",
  },
  {
    q: "¿Preparáis exámenes oficiales?",
    a: "Sí. Somos Centro Preparador Oficial Cambridge (B1 Preliminary, B2 First, C1 Advanced y C2 Proficiency) y preparamos DELF y DALF de francés, además de otros certificados oficiales.",
  },
  {
    q: "¿Cómo se forman los grupos?",
    a: "A partir de la prueba de nivel. Así cada grupo es homogéneo y todos avanzan al mismo ritmo, con seguimiento individual, tutorías y refuerzos cuando hace falta.",
  },
  {
    q: "¿Dónde estáis y cuánto cuesta?",
    a: `Estamos en ${CONTACT.address}, ${CONTACT.postalCode} ${CONTACT.city}. El precio depende del curso y la modalidad: escríbenos o llámanos al ${CONTACT.phone} y te informamos sin compromiso.`,
  },
];

export default function Faq() {
  return (
    <section id="faq" className="bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Preguntas frecuentes"
          title="¿Tienes dudas?"
          description="Estas son las preguntas que más nos hacen. Si no encuentras la tuya, escríbenos."
        />
        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-2 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-xl py-4 text-left text-lg font-bold text-neutral-900 transition hover:text-primary">
                {item.q}
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-500 transition duration-300 group-open:rotate-45 group-open:bg-primary group-open:text-white">
                  <Plus size={18} aria-hidden="true" />
                </span>
              </summary>
              <p className="pr-12 pb-5 leading-relaxed text-neutral-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
