// Sección "Nuestra Oferta" — Catálogo de Servicios
// Ref: AcademiaSanPedro/01_Requirements/01.1_Business_Profile.md → Oferta Académica

import { BookOpen, GraduationCap, MessagesSquare, Briefcase } from "lucide-react";
import { IDIOMAS_OFERTADOS } from "@/lib/constants";

export default function OfferSection() {
  const cards = [
    {
      idioma: "Inglés",
      icon: <GraduationCap className="h-8 w-8 text-secondary" />,
      descripcion:
        "Idioma principal. Preparación intensiva y extensiva para certificados de Cambridge (B1, B2, C1, C2).",
    },
    {
      idioma: "Francés",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      descripcion:
        "Grupos adaptados a tu nivel. Preparación para certificados oficiales DELF y DALF.",
    },
    {
      idioma: "Alemán",
      icon: <MessagesSquare className="h-8 w-8 text-primary" />,
      descripcion:
        "Desde niveles iniciales hasta avanzados. Clases dinámicas y prácticas.",
    },
    {
      idioma: "Italiano",
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      descripcion:
        "Conversación, gramática y preparación oficial. Aprende a tu propio ritmo.",
    },
  ];

  return (
    <section id="idiomas" className="py-24 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-600 mb-6 tracking-tight">
            Descubre Nuestra Oferta Académica
          </h2>
          <p className="text-lg md:text-xl text-neutral-500 font-medium leading-relaxed">
            Preparamos para los exámenes oficiales más reconocidos internacionalmente con metodologías adaptadas a cada alumno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/60 shadow-xl shadow-neutral-200/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-neutral-200/60 ring-1 ring-neutral-900/5 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-black text-neutral-900 mb-4 tracking-tight group-hover:text-primary transition-colors">
                  {card.idioma}
                </h3>
                <p className="text-neutral-500 font-medium leading-relaxed">
                  {card.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
