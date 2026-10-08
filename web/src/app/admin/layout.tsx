// Layout Principal del Admin Dashboard (Avanzado)
// TODO: Implementar protección de ruta (middleware o check en layout)

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PenTool, 
  Scale, 
  Users, 
  Megaphone,
  Settings, 
  Menu,
  Home,
  Bell,
  Search,
  User,
  Shield
} from "lucide-react";
import Image from "next/image";
import ProfileDropdown from "@/components/ui/ProfileDropdown";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchNotifications() {
      const supabase = createClient();
      const { data } = await supabase
        .from("level_tests")
        .select(`id, completed_at, language, profiles(full_name)`)
        .eq("status", "pending_review")
        .order("completed_at", { ascending: false })
        .limit(3);
      
      if (data) {
        setNotifications(data);
      }
    }
    fetchNotifications();
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Tests de Nivel", href: "/admin/tests", icon: Scale },
    { name: "CRM: Leads y Alumnos", href: "/admin/crm", icon: Users },
    { name: "Ofertas y Avisos", href: "/admin/marketing", icon: Megaphone },
    { name: "Legal y Privacidad", href: "/admin/legal", icon: Shield },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 font-sans">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#1A2954] to-primary-dark text-white transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } flex flex-col border-r border-white/5`}
      >
        <div className="flex h-20 shrink-0 items-center gap-3 px-6 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
          <Image
            src="/assets/logo.png"
            alt="Logo Academia San Pedro"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-lg font-black tracking-widest uppercase relative z-10 text-white">Academia</span>
        </div>

        <div className="flex flex-col flex-1 py-8 px-4 overflow-y-auto custom-scrollbar">
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/25 font-bold" 
                      : "text-white/60 hover:bg-white/10 hover:text-white font-medium hover:translate-x-1"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} className={`transition-colors duration-300 ${isActive ? "text-white" : "text-white/60 group-hover:text-white"}`} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-6 border-t border-white/10 bg-black/10 relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
          <Link 
            href="/"
            className="relative z-10 flex w-full items-center justify-center gap-2 px-4 py-4 bg-white/95 text-primary-dark font-black rounded-2xl shadow-xl hover:bg-white hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
          >
            <Home size={18} />
            Web Principal
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Decorative ambient light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Header Superior */}
        <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-neutral-200/60 bg-white/60 backdrop-blur-xl px-4 sm:px-8 shadow-sm z-30 sticky top-0">
          <div className="flex items-center flex-1 gap-4">
            <button 
              className="lg:hidden p-2.5 -ml-2 text-neutral-500 hover:text-primary bg-white rounded-xl shadow-sm border border-neutral-100 transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            {/* Buscador Global */}
            <form action="/admin/crm" method="GET" className="relative hidden sm:block max-w-md w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                name="q"
                placeholder="Buscar alumnos por email o nombre..." 
                className="w-full pl-11 pr-4 py-2.5 bg-neutral-100/50 border border-neutral-200/80 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all shadow-sm"
              />
            </form>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            {/* Notificaciones */}
            <div className="relative">
              <button 
                className="relative p-2.5 text-neutral-400 hover:text-primary transition-all rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/10 focus:outline-none"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                </span>
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-neutral-100 z-50 overflow-hidden transform opacity-100 scale-100 transition-all">
                    <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                      <h3 className="font-bold text-neutral-900">Notificaciones</h3>
                    </div>
                    <div className="p-4 flex flex-col gap-3 max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? notifications.map(notif => (
                        <div key={notif.id} className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                          <p className="text-sm font-semibold text-neutral-900">Test pendiente de evaluar</p>
                          <p className="text-xs text-neutral-500 mt-1">{(notif.profiles as any)?.full_name || "Alumno"} ha completado el test de {notif.language}.</p>
                          <p className="text-[10px] text-neutral-400 mt-2">{new Date(notif.completed_at).toLocaleString()}</p>
                        </div>
                      )) : (
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                          <p className="text-sm font-medium text-neutral-500">No hay notificaciones pendientes</p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-neutral-100 bg-neutral-50/50 text-center flex justify-between px-6">
                      <Link href="/admin/tests" onClick={() => setNotificationsOpen(false)} className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">
                        Ver todas
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="h-8 w-px bg-neutral-200/80"></div>

            {/* Perfil Admin Interactivo */}
            <ProfileDropdown userName="Administrador" userInitials="AD" isAdmin={true} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
