"use client";

// Cabecera pública: sticky con cristal, menú móvil accesible y CTA según sesión.
// La sesión se detecta por la cookie de Supabase para no cargar su SDK en la landing.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Idiomas", href: "/#idiomas" },
  { label: "Cursos", href: "/#cursos" },
  { label: "Exámenes", href: "/#examenes" },
  { label: "Método", href: "/#metodo" },
  { label: "Opiniones", href: "/#testimonios" },
  { label: "Contacto", href: "/#contacto" },
];

function hasSessionCookie() {
  return document.cookie.split(";").some((cookie) => cookie.trim().startsWith("sb-") && cookie.includes("-auth-token"));
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Lectura de cookies del navegador: solo disponible tras hidratar
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoggedIn(hasSessionCookie());
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || menuOpen
          ? "border-neutral-200/80 bg-white/85 shadow-[0_8px_30px_-12px_rgb(15_23_42/0.15)]"
          : "border-transparent bg-white/70"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Logo priority />

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:bg-primary-50 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {loggedIn ? (
            <ButtonLink href="/dashboard" variant="primary">
              Mi panel
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/auth/login" variant="ghost">
                Acceso alumnos
              </ButtonLink>
              <ButtonLink href="/auth/registro" variant="secondary">
                Prueba de nivel gratis
              </ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl text-neutral-700 transition hover:bg-neutral-100 lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="menu-movil"
          className="absolute inset-x-0 top-[72px] h-[calc(100dvh-72px)] overflow-y-auto border-t border-neutral-200 bg-white animate-fade-in lg:hidden"
        >
          <nav aria-label="Principal móvil" className="flex flex-col gap-1 px-5 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-2xl px-4 py-4 text-lg font-bold text-neutral-800 transition hover:bg-primary-50 hover:text-primary"
              >
                {link.label}
                <ArrowRight size={18} className="text-neutral-300" aria-hidden="true" />
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3 border-t border-neutral-100 pt-6">
              {loggedIn ? (
                <ButtonLink href="/dashboard" size="lg" fullWidth onClick={closeMenu}>
                  Ir a mi panel
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink href="/auth/registro" variant="secondary" size="lg" fullWidth onClick={closeMenu}>
                    Prueba de nivel gratis
                  </ButtonLink>
                  <ButtonLink href="/auth/login" variant="outline" size="lg" fullWidth onClick={closeMenu}>
                    Acceso alumnos
                  </ButtonLink>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
