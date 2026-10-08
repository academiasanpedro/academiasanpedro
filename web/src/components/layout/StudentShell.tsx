// Estructura del área de alumno: barra superior con navegación y menú de usuario

import type { ReactNode } from "react";
import { ClipboardList, LayoutDashboard, Target, UserRound } from "lucide-react";
import Logo from "@/components/ui/Logo";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";

const NAV = [
  { href: "/dashboard", label: "Mi panel", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/questionnaire", label: "Cuestionario", icon: ClipboardList },
  { href: "/dashboard/level-test", label: "Test de nivel", icon: Target },
  { href: "/dashboard/settings", label: "Perfil", icon: UserRound },
];

interface StudentShellProps {
  name: string;
  email?: string | null;
  isAdmin: boolean;
  children: ReactNode;
}

export default function StudentShell({ name, email, isAdmin, children }: StudentShellProps) {
  const linkBase = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold whitespace-nowrap transition";
  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-primary-50 to-transparent" />

      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-5 lg:px-8">
          <Logo href="/dashboard" subtitle="Área de alumnos" />
          <nav aria-label="Área de alumnos" className="hidden items-center gap-1 md:flex">
            {NAV.map(({ href, label, icon: Icon, exact }) => (
              <NavLink
                key={href}
                href={href}
                exact={exact}
                className={linkBase}
                activeClassName="bg-primary-50 text-primary"
                inactiveClassName="text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
          <UserMenu name={name} email={email} isAdmin={isAdmin} />
        </div>

        <nav aria-label="Área de alumnos (móvil)" className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
          {NAV.map(({ href, label, icon: Icon, exact }) => (
            <NavLink
              key={href}
              href={href}
              exact={exact}
              className={linkBase}
              activeClassName="bg-primary text-white"
              inactiveClassName="bg-neutral-100 text-neutral-600"
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main id="contenido" className="relative mx-auto w-full max-w-6xl flex-1 px-5 py-10 lg:px-8 lg:py-12">
        {children}
      </main>
    </div>
  );
}
