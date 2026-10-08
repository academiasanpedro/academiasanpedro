// Layout compartido para las páginas de autenticación (Login y Registro)
// Ref: AcademiaSanPedro/00_Meta/02_UI_UX_Guidelines.md → Layout de Páginas de Auth
// Desktop: Split layout (panel decorativo izquierdo + formulario derecho)
// Mobile: Solo el formulario con el logo arriba

import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Panel decorativo — Solo visible en desktop (lg+) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-neutral-950">
        {/* Mesh Gradient Animado / Estático Premium */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/40 blur-[120px] mix-blend-screen" />
          <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-[100px] mix-blend-screen" />
          <div className="absolute -bottom-[20%] left-[10%] w-[80%] h-[80%] rounded-full bg-primary-dark/60 blur-[130px] mix-blend-screen" />
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

        {/* Contenido del panel */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white h-full w-full">
          {/* Glassmorphism Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-10 xl:p-12 rounded-[2rem] shadow-2xl">
            {/* Logo / Nombre */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-2">
                <Image
                  src="/assets/logo.png"
                  alt="Logo Academia San Pedro"
                  width={48}
                  height={48}
                  className="rounded-2xl border border-white/20 shadow-inner brightness-0 invert drop-shadow-md"
                />
                <span className="text-xl font-semibold tracking-wide text-white/90">
                  Academia San Pedro
                </span>
              </div>
            </div>

            {/* Tagline */}
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6 tracking-tight">
              Tu idioma. Tu nivel.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-amber-200">
                Tu objetivo.
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-md leading-relaxed font-light">
              Aprende inglés, francés, alemán o italiano con grupos adaptados a tu nivel y prepárate para conseguir tu certificación oficial.
            </p>

            {/* Estadísticas decorativas */}
            <div className="flex gap-10 mt-12 pt-10 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white tracking-tight">+300</div>
                <div className="text-sm text-white/60 mt-1.5 font-medium">Alumnos formados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white tracking-tight">4</div>
                <div className="text-sm text-white/60 mt-1.5 font-medium">Idiomas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white tracking-tight">+90%</div>
                <div className="text-sm text-white/60 mt-1.5 font-medium">Aprobados Cambridge</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel del formulario */}
      <div className="flex w-full lg:w-1/2 xl:w-[45%] flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-12">
        {/* Logo mobile — Solo visible en móvil */}
        <div className="mb-8 lg:hidden">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logo.png"
              alt="Logo Academia San Pedro"
              width={36}
              height={36}
              className="rounded-lg drop-shadow-md"
            />
            <span className="text-lg font-semibold text-neutral-900">
              Academia San Pedro
            </span>
          </div>
        </div>

        {/* Contenido del formulario (inyectado por cada página) */}
        <div className="w-full max-w-md mx-auto lg:mx-0">{children}</div>
      </div>
    </div>
  );
}
