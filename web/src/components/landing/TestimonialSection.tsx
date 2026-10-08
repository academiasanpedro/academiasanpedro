// Sección "Testimonios" — Prueba Social
// Ref: AcademiaSanPedro/01_Requirements/01.1_Business_Profile.md → Testimonios reales

import { Star } from "lucide-react";

export default function TestimonialSection() {
  const testimonials = [
    {
      texto: "Excelente centro con buenos profesionales.",
      autor: "Alumno/a Verificado",
      logro: "Aprobado Oficial",
    },
    {
      texto: "Conseguí mi certificado de B1 de inglés en un curso intensivo este verano.",
      autor: "Alumno/a Verificado",
      logro: "Cambridge B1",
    },
    {
      texto: "Llevo 3 años en esta academia y he conseguido dos títulos: B1 y B2.",
      autor: "Alumno/a Verificado",
      logro: "Cambridge B1 y B2",
    },
    {
      texto: "Academia dinámica y profesional. Mi hija está muy contenta.",
      autor: "Padre/Madre de Alumno/a",
      logro: "Playschool",
    },
  ];

  return (
    <section id="testimonios" className="py-24 bg-neutral-900 text-white overflow-hidden relative">
      {/* Decoración */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-1 mb-6 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={28} fill="currentColor" />
            ))}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Lo que dicen nuestros alumnos
          </h2>
          <p className="text-lg text-white/70">
            Descubre por qué cientos de alumnos confían en nosotros cada año para
            alcanzar sus objetivos con los idiomas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonio, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-colors duration-500 shadow-2xl"
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xl font-medium leading-relaxed mb-8 text-white/90 group-hover:text-white transition-colors">
                  "{testimonio.texto}"
                </p>
              </div>
              <div>
                <p className="font-bold text-white text-lg">{testimonio.autor}</p>
                <p className="text-sm text-secondary font-bold tracking-wide mt-1 uppercase">
                  {testimonio.logro}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
