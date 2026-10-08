"use client";

// Estructura del panel admin: sidebar (drawer en móvil), buscador global y notificaciones

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Globe,
  LayoutDashboard,
  Megaphone,
  Menu,
  Scale,
  Search,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { cn, formatDateTime } from "@/lib/utils";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";

const NAV = [
  { name: "Resumen", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Tests de nivel", href: "/admin/tests", icon: Scale },
  { name: "CRM alumnos", href: "/admin/crm", icon: Users },
  { name: "Mailing", href: "/admin/marketing", icon: Megaphone },
  { name: "Textos legales", href: "/admin/legal", icon: Shield },
  { name: "Configuración", href: "/admin/settings", icon: Settings },
];

export interface PendingNotification {
  id: string;
  language: string;
  completed_at: string;
  student: string;
}

interface AdminShellProps {
  name: string;
  email?: string | null;
  pendingCount: number;
  notifications: PendingNotification[];
  children: ReactNode;
}

export default function AdminShell({ name, email, pendingCount, notifications, children }: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Cierra el drawer y el panel al navegar
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setSidebarOpen(false);
    setNotificationsOpen(false);
  }

  useEffect(() => {
    if (!sidebarOpen && !notificationsOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSidebarOpen(false);
      setNotificationsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sidebarOpen, notificationsOpen]);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-neutral-950/50 backdrop-blur-sm animate-fade-in lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-primary-950 text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
        aria-label="Navegación del panel"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 size-60 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Logo tone="dark" href="/admin" subtitle="Panel admin" />
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="relative flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {NAV.map(({ name: label, href, icon: Icon, exact }) => (
            <NavLink
              key={href}
              href={href}
              exact={exact}
              className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition"
              activeClassName="bg-white text-primary-dark shadow-lg shadow-black/20"
              inactiveClassName="text-white/60 hover:bg-white/10 hover:text-white"
            >
              <Icon size={19} aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {href === "/admin/tests" && pendingCount > 0 && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-black text-white">{pendingCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="relative border-t border-white/10 p-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
          >
            <Globe size={16} aria-hidden="true" />
            Ver la web
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-neutral-200/70 bg-white/80 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex flex-1 items-center gap-3">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-xl border border-neutral-200 bg-white text-neutral-600 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
            <form action="/admin/crm" method="get" role="search" className="relative hidden w-full max-w-md sm:block">
              <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
              <input
                type="search"
                name="q"
                aria-label="Buscar alumnos"
                placeholder="Buscar alumnos por nombre, email o teléfono…"
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pr-4 pl-11 text-sm font-medium transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 focus:outline-none"
              />
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((open) => !open)}
                aria-expanded={notificationsOpen}
                aria-label={pendingCount > 0 ? `${pendingCount} tests pendientes` : "Notificaciones"}
                className="relative grid size-11 place-items-center rounded-xl text-neutral-500 transition hover:bg-primary-50 hover:text-primary"
              >
                <Bell size={20} />
                {pendingCount > 0 && (
                  <span className="absolute top-2 right-2 flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-secondary" />
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-lift animate-scale-in">
                    <div className="border-b border-neutral-100 px-4 py-3">
                      <p className="font-bold text-neutral-900">Tests pendientes</p>
                    </div>
                    <div className="max-h-80 space-y-2 overflow-y-auto p-3">
                      {notifications.length > 0 ? (
                        notifications.map((item) => (
                          <Link
                            key={item.id}
                            href="/admin/tests"
                            className="block rounded-xl bg-primary-50/60 p-3 transition hover:bg-primary-50"
                          >
                            <p className="text-sm font-semibold text-neutral-900">{item.student}</p>
                            <p className="text-xs text-neutral-500">
                              Test de {item.language} · {formatDateTime(item.completed_at)}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <p className="p-4 text-center text-sm text-neutral-500">Todo al día 🎉</p>
                      )}
                    </div>
                    <Link href="/admin/tests" className="block border-t border-neutral-100 px-4 py-3 text-center text-sm font-bold text-primary hover:bg-neutral-50">
                      Ir a tests
                    </Link>
                  </div>
                </>
              )}
            </div>
            <div className="hidden h-8 w-px bg-neutral-200 sm:block" />
            <UserMenu name={name} email={email} isAdmin />
          </div>
        </header>

        <main id="contenido" className="flex-1 p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
