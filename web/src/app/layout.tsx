import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Academia de Idiomas San Pedro",
  description:
    "Aprende idiomas con los mejores profesores. Regístrate y descubre tu nivel con nuestro test online gratuito.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Suspense fallback={null}>
          <GlobalHeader />
        </Suspense>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
