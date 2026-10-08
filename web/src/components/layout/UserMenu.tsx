"use client";

// Menú de usuario (avatar con iniciales): perfil, volver a la web y cerrar sesión (POST).

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Globe, LogOut, Settings, Shield } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

interface UserMenuProps {
  name: string;
  email?: string | null;
  isAdmin?: boolean;
  tone?: "light" | "dark";
}

export default function UserMenu({ name, email, isAdmin = false, tone = "light" }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-600 transition hover:bg-primary-50 hover:text-primary";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Menú de ${name}`}
        className={cn(
          "flex items-center gap-3 rounded-2xl p-1 pr-1 transition sm:pr-3",
          tone === "dark" ? "hover:bg-white/10" : "hover:bg-neutral-100"
        )}
      >
        <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-sm font-black text-white shadow-glow-primary">
          {getInitials(name)}
        </span>
        <span className="hidden max-w-36 truncate text-left text-sm leading-tight sm:block">
          <span className={cn("block truncate font-bold", tone === "dark" ? "text-white" : "text-neutral-900")}>{name}</span>
          <span className={cn("block text-xs font-medium", tone === "dark" ? "text-white/60" : "text-neutral-500")}>
            {isAdmin ? "Administrador/a" : "Alumno/a"}
          </span>
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-2xl border border-neutral-100 bg-white p-2 shadow-lift animate-scale-in"
        >
          <div className="mb-1 border-b border-neutral-100 px-3 pt-2 pb-3">
            <p className="truncate text-sm font-bold text-neutral-900">{name}</p>
            {email && <p className="truncate text-xs text-neutral-500">{email}</p>}
          </div>
          <Link role="menuitem" href="/dashboard/settings" onClick={() => setOpen(false)} className={itemClass}>
            <Settings size={16} aria-hidden="true" />
            Mi perfil
          </Link>
          {isAdmin && (
            <Link role="menuitem" href="/admin" onClick={() => setOpen(false)} className={itemClass}>
              <Shield size={16} aria-hidden="true" />
              Panel de administración
            </Link>
          )}
          <Link role="menuitem" href="/" onClick={() => setOpen(false)} className={itemClass}>
            <Globe size={16} aria-hidden="true" />
            Web de la academia
          </Link>
          <div className="my-1 h-px bg-neutral-100" />
          <form action="/auth/signout" method="post">
            <button role="menuitem" type="submit" className={cn(itemClass, "text-error hover:bg-error/10 hover:text-error")}>
              <LogOut size={16} aria-hidden="true" />
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
