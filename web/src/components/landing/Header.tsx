// Header / Navegación principal
// Ref: AcademiaSanPedro/01_Requirements/01.1_Business_Profile.md

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Idiomas", href: "/#idiomas" },
  { label: "Método", href: "/#metodo" },
  { label: "Exámenes", href: "/#examenes" },
  { label: "Testimonios", href: "/#testimonios" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/assets/logo.png"
            alt="Academia de Idiomas San Pedro"
            width={44}
            height={44}
            className="rounded-full"
            priority
          />
          <span className="hidden sm:block text-lg font-bold text-primary-dark tracking-tight">
            San Pedro <span className="font-normal text-neutral-500">Idiomas</span>
          </span>
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTAs Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all duration-300 hover:bg-neutral-100 hover:border-neutral-300 hover:-translate-y-0.5"
          >
            Acceso Alumnos
          </Link>
          <Link
            href="/#hero-cta"
            className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(200,50,50,0.35)] transition-all duration-300 hover:bg-secondary-dark hover:shadow-[0_6px_20px_rgba(200,50,50,0.25)] hover:-translate-y-0.5"
          >
            Prueba de Nivel
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-neutral-700 hover:text-primary transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 w-full bg-white border-b border-neutral-200 shadow-lg z-40">
          <nav className="flex flex-col px-5 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-neutral-200">
              <Link
                href="/auth/login"
                className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 text-center transition-all hover:bg-neutral-100"
              >
                Acceso Alumnos
              </Link>
              <Link
                href="/#hero-cta"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white text-center transition-all hover:bg-secondary-dark"
              >
                Prueba de Nivel
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
