import { Settings as SettingsIcon, Save, Key, Mail, Globe } from "lucide-react";

export const metadata = {
  title: "Configuración | Admin San Pedro",
};

export default function SettingsPage() {
  return (
    <div className="space-y-10 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-600 tracking-tight flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Configuración Global
        </h1>
        <p className="mt-3 text-neutral-500 font-medium max-w-2xl">
          Ajustes generales de la plataforma, notificaciones y conexión con servicios externos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* General */}
        <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <Globe className="text-primary" size={20} />
            Datos de la Academia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700">Nombre Público</label>
              <input type="text" defaultValue="Academia de Idiomas San Pedro" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700">Email de Contacto</label>
              <input type="email" defaultValue="academiasanpedro26@gmail.com" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm" />
            </div>
          </div>
          <div className="mt-6">
            <button className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition-colors flex items-center gap-2">
              <Save size={16} />
              Guardar Cambios
            </button>
          </div>
        </div>

        {/* API & Supabase */}
        <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm opacity-70">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <Key className="text-neutral-400" size={20} />
            Integraciones (Próximamente)
          </h2>
          <p className="text-neutral-500 text-sm mb-4">
            La gestión de claves de API de Supabase y servicios de mailing se realizará desde este panel en futuras actualizaciones.
          </p>
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">SendGrid API Key / SMTP</label>
            <input type="password" disabled defaultValue="**********************" className="w-full px-4 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-sm text-neutral-400 cursor-not-allowed" />
          </div>
        </div>
      </div>
    </div>
  );
}
