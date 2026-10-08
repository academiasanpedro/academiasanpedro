import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · Huelva`,
    template: "%s | Academia San Pedro",
  },
  description:
    "Academia de idiomas en Huelva: inglés, francés, alemán e italiano. Centro Preparador Oficial Cambridge. Haz gratis tu prueba de nivel online.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
    title: `${SITE_NAME} · Huelva`,
    description:
      "Tu idioma. Tu nivel. Tu objetivo. Grupos adaptados a tu nivel y preparación oficial Cambridge.",
    images: [{ url: "/assets/logo_letras.png", width: 225, height: 225, alt: SITE_NAME }],
  },
  twitter: { card: "summary" },
};

export const viewport: Viewport = {
  themeColor: "#243b78",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#contenido"
          className="sr-only z-[100] rounded-xl bg-primary px-4 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
