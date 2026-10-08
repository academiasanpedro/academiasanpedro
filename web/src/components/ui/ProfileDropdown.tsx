"use client";

import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileDropdown({ userName, userInitials, isAdmin }: { userName: string, userInitials: string, isAdmin?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cerrar si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white font-black flex items-center justify-center text-sm shadow-md shadow-primary/20 hover:scale-105 transition-transform"
      >
        {userInitials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-3 border-b border-neutral-100 mb-1">
            <p className="text-sm font-bold text-neutral-900 truncate">{userName}</p>
            <p className="text-xs text-neutral-500 font-medium">{isAdmin ? "Administrador" : "Alumno"}</p>
          </div>
          
          <Link 
            href={isAdmin ? "/admin/settings" : "/dashboard/settings"} 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <Settings size={16} />
            Configuración de perfil
          </Link>
          
          <div className="h-px bg-neutral-100 my-1 mx-2" />
          
          <a 
            href="/auth/signout"
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-error hover:bg-error/10 transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </a>
        </div>
      )}
    </div>
  );
}
