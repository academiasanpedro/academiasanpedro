// Gestor de Leads / CRM de Alumnos
// TODO: Fetch data from Supabase

import { Search, Filter, MoreVertical, Eye } from "lucide-react";

export default function LeadsPage() {
  const leads = [
    {
      id: 1,
      nombre: "María García",
      email: "maria.g@example.com",
      telefono: "+34 612 345 678",
      idioma: "Inglés",
      nivel: "Pendiente",
      estado: "Nuevo Lead",
    },
    {
      id: 2,
      nombre: "Carlos López",
      email: "carlos.lopez@example.com",
      telefono: "+34 698 765 432",
      idioma: "Inglés",
      nivel: "B1",
      estado: "Contactado",
    },
    {
      id: 3,
      nombre: "Ana Martínez",
      email: "ana.m@example.com",
      telefono: "+34 655 443 322",
      idioma: "Francés",
      nivel: "A2",
      estado: "Matriculado",
    },
  ];

  const getNivelBadge = (nivel: string) => {
    if (nivel === "Pendiente") {
      return "bg-secondary/10 text-secondary border border-secondary/20";
    }
    return "bg-success/10 text-success border border-success/20";
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Nuevo Lead":
        return "bg-primary/10 text-primary";
      case "Contactado":
        return "bg-blue-100 text-blue-700";
      case "Matriculado":
        return "bg-success/10 text-success";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Leads y Alumnos</h1>
          <p className="text-neutral-500 mt-1">
            Gestiona los alumnos registrados y haz seguimiento comercial.
          </p>
        </div>
        <button className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-primary-dark transition-colors">
          + Añadir Alumno
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-neutral-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre, email o teléfono..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filtros
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-neutral-500 font-medium border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">Nombre / Email</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">Idioma</th>
                <th className="px-6 py-4">Nivel Asignado</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">{lead.nombre}</div>
                    <div className="text-neutral-500 text-xs mt-0.5">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{lead.telefono}</td>
                  <td className="px-6 py-4 text-neutral-900 font-medium">{lead.idioma}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getNivelBadge(lead.nivel)}`}>
                      {lead.nivel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getEstadoBadge(lead.estado)}`}>
                      {lead.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-neutral-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="Ver perfil">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors" title="Opciones">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-neutral-200 bg-white flex items-center justify-between text-sm text-neutral-500">
          <span>Mostrando 1 a 3 de 3 resultados</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50" disabled>Anterior</button>
            <button className="px-3 py-1 border border-neutral-200 rounded bg-primary text-white font-medium">1</button>
            <button className="px-3 py-1 border border-neutral-200 rounded hover:bg-neutral-50" disabled>Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
