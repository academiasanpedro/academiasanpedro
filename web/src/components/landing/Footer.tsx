// Footer — Información de Contacto
// Ref: AcademiaSanPedro/01_Requirements/01.1_Business_Profile.md → Datos de Negocio

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-neutral-950 pt-20 pb-10 text-white/70 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Info Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full brightness-0 invert"
              />
              <span className="text-xl font-bold text-white tracking-tight">
                San Pedro
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Centro preparador oficial Cambridge en Huelva. Aprende idiomas con
              los mejores profesionales.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-bold mb-6">Contacto</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                <span>Plaza San Pedro nº 2,<br />21004 Huelva</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-secondary shrink-0" />
                <span>610 93 25 78</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-secondary shrink-0" />
                <a href="mailto:sanpedroidiomas@gmail.com" className="hover:text-white transition-colors">
                  sanpedroidiomas@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Enlaces Útiles */}
          <div>
            <h4 className="text-white font-bold mb-6">Enlaces Útiles</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a href="#idiomas" className="hover:text-white transition-colors">Nuestra Oferta</a>
              </li>
              <li>
                <a href="#metodo" className="hover:text-white transition-colors">Metodología</a>
              </li>
              <li>
                <a href="#testimonios" className="hover:text-white transition-colors">Testimonios</a>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">Acceso Alumnos</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/legal/aviso-legal" className="hover:text-white transition-colors">Aviso Legal</Link>
              </li>
              <li>
                <Link href="/legal/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-white transition-colors">Política de Cookies</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 text-sm">
          <p>© 2026 Academia de Idiomas San Pedro. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
