// Hero Section — Primer impacto visual
// Ref: AcademiaSanPedro/01_Requirements/01.1_Business_Profile.md → Mensaje comercial recomendado

import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero-cta"
      className="relative overflow-hidden bg-primary-dark pt-10"
    >
      {/* Mesh Gradient Animado / Estático Premium */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/40 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-secondary/30 blur-[100px] mix-blend-screen" />
        <div className="absolute -bottom-[20%] left-[10%] w-[80%] h-[80%] rounded-full bg-[#1A2954]/80 blur-[130px] mix-blend-screen" />
      </div>

      {/* Patrón decorativo sutil (dots) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8 py-20 md:py-32 lg:py-40">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-white/5 border border-white/10 px-5 py-2 text-sm font-bold text-white/90 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-white/10 transition-colors">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
            </span>
            Centro Preparador Oficial Cambridge
          </div>

          {/* H1 */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-black text-white leading-[1.05] tracking-tighter mb-8">
            Tu idioma. Tu nivel.{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-[#ff6b6b] to-amber-200">
              Tu objetivo.
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-medium mb-12">
            Aprende inglés, francés, alemán o italiano con grupos adaptados a tu
            nivel y prepárate para conseguir tu certificación oficial.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              href="/auth/registro"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-secondary to-[#e52e2e] px-8 py-4 text-lg font-black text-white shadow-[0_0_40px_-10px_rgba(200,50,50,0.5)] transition-all duration-300 hover:shadow-[0_0_60px_-10px_rgba(200,50,50,0.6)] hover:-translate-y-1 active:scale-95"
            >
              Realizar Prueba de Nivel
              <ArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </Link>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 active:scale-95 hover:border-white/30"
            >
              Solicitar Información
            </a>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6 mt-16 pt-10 border-t border-white/10">
            <div className="flex flex-col gap-1 text-white/60">
              <span className="text-3xl font-black text-white tracking-tight">+300</span>
              <span className="text-sm font-bold uppercase tracking-wider">Alumnos formados</span>
            </div>
            <div className="flex flex-col gap-1 text-white/60">
              <span className="text-3xl font-black text-white tracking-tight">+90%</span>
              <span className="text-sm font-bold uppercase tracking-wider">Aprobados Cambridge</span>
            </div>
            <div className="flex flex-col gap-1 text-white/60">
              <span className="text-3xl font-black text-white tracking-tight">+25</span>
              <span className="text-sm font-bold uppercase tracking-wider">Años de experiencia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
