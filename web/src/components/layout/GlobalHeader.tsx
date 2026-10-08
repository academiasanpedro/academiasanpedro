"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/landing/Header";

export default function GlobalHeader() {
  const pathname = usePathname();

  // Ocultamos el header global en rutas de administración y autenticación
  // porque ya tienen sus propios layouts a pantalla completa (sidebar o paneles).
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) {
    return null;
  }

  return <Header />;
}
