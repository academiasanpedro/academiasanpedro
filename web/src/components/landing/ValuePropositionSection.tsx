// Sección "Por qué elegirnos" — Propuesta de Valor
// Ref: AcademiaSanPedro/01_Requirements/01.1_Business_Profile.md → Servicios diferenciadores

import { Target, Users, BookMarked, UserCheck } from "lucide-react";

export default function ValuePropositionSection() {
  const values = [
    {
      title: "Profesores Experimentados",
      description:
        "Equipo nativo y bilingüe con más de 25 años de experiencia acumulada impartiendo clases.",
      icon: <Users className="h-7 w-7 text-white" />,
    },
    {
      title: "Centro Oficial Cambridge",
      description:
        "Somos Centro Preparador Oficial. Más del 90% de nuestros alumnos presentados consiguen su título.",
      icon: <BookMarked className="h-7 w-7 text-white" />,
    },
    {
      title: "Seguimiento Individual",
      description:
        "Tutorías, feedback constante de progresos y refuerzos individualizados para garantizar tu éxito.",
      icon: <Target className="h-7 w-7 text-white" />,
    },
    {
      title: "Para Todas las Edades",
      description:
        "Desde Playschool para niños de 4 años hasta grupos específicos para adultos mayores de 65 años.",
      icon: <UserCheck className="h-7 w-7 text-white" />,
    },
  ];

  return (
    <section id="metodo" className="py-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-white to-neutral-50/50 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          {/* Texto Intro */}
          <div className="lg:w-5/12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 mb-8 tracking-tighter leading-[1.1]">
              ¿Por qué elegir <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                Academia San Pedro?
              </span>
            </h2>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              No solo enseñamos idiomas. Te ofrecemos una experiencia integral de
              aprendizaje con un enfoque claro en resultados y certificados
              oficiales, respaldado por décadas de experiencia.
            </p>
            <a
              href="#hero-cta"
              className="inline-flex items-center font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Realiza tu prueba de nivel
              <span className="ml-2 text-xl">→</span>
            </a>
          </div>

          {/* Grid de Valores */}
          <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            {values.map((val, index) => (
              <div key={index} className="flex flex-col gap-5 group">
                <div className="shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-primary via-primary-dark to-[#1A2954] shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                    {val.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-neutral-900 mb-3 tracking-tight group-hover:text-primary transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-neutral-500 font-medium leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
