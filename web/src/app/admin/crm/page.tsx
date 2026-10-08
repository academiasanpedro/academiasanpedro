// Vista: CRM Leads y Alumnos (/admin/crm)

import { Search, Filter, MessageSquareText, Phone, Mail, MoreVertical, Database, UserPlus } from "lucide-react";
import { IDIOMAS_OFERTADOS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";
export const dynamic = "force-dynamic";

export default function CRMPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="text-center py-20 text-neutral-500 font-bold">Cargando CRM...</div>}>
        <CRMContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CRMContent({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await connection();
  const supabase = await createClient();
  const params = await searchParams;
  const query = params?.q?.toLowerCase() || "";
  
  // Fetch real data from DB
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      full_name,
      phone,
      created_at,
      leads_questionnaire ( status, target_language, internal_note ),
      level_tests ( assigned_level )
    `)
    .order("created_at", { ascending: false });

  // Map to UI format
  const leads = (profiles || []).map((p: any) => {
    const q = p.leads_questionnaire?.[0] || {};
    const t = p.level_tests?.[0] || {};
    
    return {
      id: p.id,
      nombre: p.full_name || "Sin nombre",
      email: p.email,
      telefono: p.phone || "No especificado",
      idioma: q.target_language || "No definido",
      nivel: t.assigned_level || "Pendiente",
      estado: q.status || "Nuevo",
      fecha: new Date(p.created_at).toLocaleDateString(),
      nota: q.internal_note || null,
    };
  }).filter((lead: any) => {
    if (!query) return true;
    return lead.nombre.toLowerCase().includes(query) || 
           lead.email.toLowerCase().includes(query) || 
           (lead.telefono && lead.telefono.includes(query));
  });
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Interesado":
        return "bg-neutral-100 text-neutral-600 border border-neutral-200/60";
      case "Prueba Realizada":
        return "bg-secondary/10 text-secondary border border-secondary/20";
      case "Matriculado":
        return "bg-success/10 text-success border border-success/20";
      default:
        return "bg-neutral-100 text-neutral-600 border border-neutral-200/60";
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-600 tracking-tight">CRM: Leads y Alumnos</h1>
          <p className="text-neutral-500 mt-2 font-medium">
            Gestiona la base de datos completa y haz seguimiento comercial.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95">
          <UserPlus size={18} />
          Nuevo Registro
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-xl shadow-neutral-200/40 ring-1 ring-neutral-900/5 overflow-hidden">
        {/* Toolbar & Filters */}
        <div className="p-6 border-b border-neutral-200/60 bg-neutral-50/50 space-y-5">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, email o teléfono..." 
                className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200/80 rounded-xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-neutral-600 bg-white border border-neutral-200/80 px-5 py-3 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-all w-full sm:w-auto justify-center shadow-sm">
              <Filter size={16} />
              Más Filtros
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select className="px-4 py-2 bg-white border border-neutral-200/80 rounded-lg text-xs font-bold text-neutral-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm appearance-none pr-8">
              <option value="">Estado: Todos</option>
              <option value="Interesado">Interesado</option>
              <option value="Prueba Realizada">Prueba Realizada</option>
              <option value="Matriculado">Matriculado</option>
            </select>
            <select className="px-4 py-2 bg-white border border-neutral-200/80 rounded-lg text-xs font-bold text-neutral-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm appearance-none pr-8">
              <option value="">Idioma: Todos</option>
              {IDIOMAS_OFERTADOS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50/50 text-neutral-500 font-bold uppercase tracking-wider text-[11px] border-b border-neutral-200/60">
              <tr>
                <th className="px-6 py-5">Usuario</th>
                <th className="px-6 py-5">Contacto</th>
                <th className="px-6 py-5">Interés</th>
                <th className="px-6 py-5">Estado</th>
                <th className="px-6 py-5">Nota Interna</th>
                <th className="px-6 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-400">
                      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                        <Database size={28} className="text-neutral-300" />
                      </div>
                      <p className="text-base font-bold text-neutral-900">No hay registros</p>
                      <p className="text-sm mt-1 font-medium text-neutral-500">Cuando los alumnos se registren, aparecerán aquí.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-black text-neutral-900">{lead.nombre}</div>
                      <div className="text-neutral-400 font-medium text-[11px] mt-1 uppercase tracking-wider">Reg: {lead.fecha}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-neutral-600 font-medium text-xs mb-1.5 hover:text-primary transition-colors cursor-pointer">
                        <Mail size={12} className="text-neutral-400" /> {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600 font-medium text-xs">
                        <Phone size={12} className="text-neutral-400" /> {lead.telefono}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-neutral-900">{lead.idioma}</div>
                      <div className="text-neutral-400 font-medium text-[11px] mt-1 uppercase tracking-wider">Nivel: {lead.nivel}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black shadow-sm ${getEstadoBadge(lead.estado)}`}>
                        {lead.estado}
                      </span>
                    </td>
                    <td className="px-6 py-5 max-w-[200px] truncate">
                      {lead.nota ? (
                        <span className="text-neutral-600 text-xs font-medium flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100" title={lead.nota}>
                          <MessageSquareText size={14} className="text-primary shrink-0" />
                          <span className="truncate">{lead.nota}</span>
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-xs font-medium">-</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors">
                          <MessageSquareText size={14} />
                          Nota
                        </button>
                        <button className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
