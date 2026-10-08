// Footer público — datos de contacto reales
// Ref: AcademiaSanPedro/02_Business.md → Identidad

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Facebook from "@/components/ui/FacebookIcon";
import Instagram from "@/components/ui/InstagramIcon";
import Logo from "@/components/ui/Logo";
import { CONTACT, LEGAL_PAGES } from "@/lib/constants";

const NAV = [
  { label: "Idiomas", href: "/#idiomas" },
  { label: "Cursos", href: "/#cursos" },
  { label: "Exámenes Cambridge", href: "/#examenes" },
  { label: "Preguntas frecuentes", href: "/#faq" },
  { label: "Acceso alumnos", href: "/auth/login" },
];

const SOCIAL = [
  { icon: Instagram, label: CONTACT.instagramHandle, href: CONTACT.instagram },
  { icon: Facebook, label: "Facebook", href: CONTACT.facebook },
];

const linkClass = "transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary-950 text-white/65">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-primary/30 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-10 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
          <div>
            <Logo tone="dark" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed">
              Centro Preparador Oficial Cambridge en Huelva. Inglés, francés, alemán e italiano para todas las edades.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Pie de página">
            <h2 className="mb-5 text-sm font-bold tracking-wider text-white uppercase">Explora</h2>
            <ul className="flex flex-col gap-3 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-5 text-sm font-bold tracking-wider text-white uppercase">Contacto</h2>
            <ul className="flex flex-col gap-4 text-sm">
              <li>
                <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className={`flex items-start gap-3 ${linkClass}`}>
                  <MapPin size={18} className="mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
                  <span>
                    {CONTACT.address}
                    <br />
                    {CONTACT.postalCode} {CONTACT.city}
                  </span>
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className={`flex items-center gap-3 ${linkClass}`}>
                  <Phone size={18} className="shrink-0 text-secondary" aria-hidden="true" />
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={CONTACT.landlineHref} className={`flex items-center gap-3 ${linkClass}`}>
                  <Phone size={18} className="shrink-0 text-secondary" aria-hidden="true" />
                  {CONTACT.landline}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className={`flex items-center gap-3 break-all ${linkClass}`}>
                  <Mail size={18} className="shrink-0 text-secondary" aria-hidden="true" />
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
                <span>
                  Secretaría
                  <br />
                  {CONTACT.hours}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-bold tracking-wider text-white uppercase">Legal</h2>
            <ul className="flex flex-col gap-3 text-sm">
              {LEGAL_PAGES.map((page) => (
                <li key={page.slug}>
                  <Link href={`/legal/${page.slug}`} className={linkClass}>
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Academia de Idiomas San Pedro. Todos los derechos reservados.</p>
          <p className="font-semibold text-white/80">Centro Preparador Oficial Cambridge</p>
        </div>
      </div>
    </footer>
  );
}
