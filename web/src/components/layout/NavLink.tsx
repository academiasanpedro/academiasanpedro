"use client";

// Enlace de navegación con estado activo (aria-current)

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  exact?: boolean;
  className?: string;
  activeClassName: string;
  inactiveClassName: string;
  onClick?: () => void;
  children: ReactNode;
}

export default function NavLink({ href, exact = false, className, activeClassName, inactiveClassName, onClick, children }: NavLinkProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(className, active ? activeClassName : inactiveClassName)}
    >
      {children}
    </Link>
  );
}
