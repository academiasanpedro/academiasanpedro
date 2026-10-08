// Layout de autenticación — Split: panel de marca (lg+) + formulario
// Ref: AcademiaSanPedro/01_Design.md

import Link from "next/link";
import { ArrowLeft, Quote, Star } from "lucide-react";
import Logo from "@/components/ui/Logo";

const STATS = [
  { value: "+90 %", label: "aprobados Cambridge" },
  { value: "4", label: "idiomas" },
  { value: "5,0", label: "valoración media" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden overflow-hidden bg-primary-950 lg:flex lg:w-1/2 xl:w-[55%]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-1/4 -left-[10%] h-[70%] w-[70%] rounded-full bg-primary/50 blur-[120px]" />
          <div className="absolute top-1/3 -right-1/4 h-[55%] w-[55%] rounded-full bg-secondary/25 blur-[110px]" />
          <div className="absolute inset-0 bg-dots opacity-[0.04]" />
        </div>

        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
          <Logo tone="dark" />

          <div className="max-w-xl">
            <h2 className="text-5xl leading-[1.05] font-black tracking-tight text-white xl:text-6xl">
              Tu idioma. Tu nivel.
              <br />
              <span className="bg-gradient-to-r from-secondary-light via-white to-white bg-clip-text text-transparent">
                Tu objetivo.
              </span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Aprende inglés, francés, alemán o italiano con grupos adaptados a tu nivel y prepárate para conseguir tu
              certificación oficial.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-3xl font-black tracking-tight text-white">{stat.value}</dd>
                  <dd className="mt-1 text-sm font-medium text-white/55">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <Quote size={28} className="text-secondary" aria-hidden="true" />
              <div className="flex gap-0.5 text-gold" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
            </div>
            <blockquote className="mt-4 text-lg font-medium text-white/90">
              “Llevo 3 años en esta academia y he conseguido dos títulos: B1 y B2.”
            </blockquote>
            <figcaption className="mt-3 text-sm font-semibold text-white/50">Alumna · Cambridge B1 y B2</figcaption>
          </figure>
        </div>
      </aside>

      <main id="contenido" className="flex w-full flex-col bg-white lg:w-1/2 xl:w-[45%]">
        <div className="flex items-center justify-between px-6 pt-6 sm:px-12">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-neutral-500 transition hover:text-primary"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Volver a la web
          </Link>
        </div>
        <div className="flex flex-1 items-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20">
          <div className="mx-auto w-full max-w-md animate-fade-up">{children}</div>
        </div>
      </main>
    </div>
  );
}
