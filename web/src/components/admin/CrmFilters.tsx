"use client";

// Filtros del CRM sincronizados con la URL (?q&estado&idioma). Funciona también sin JS (botón Filtrar).

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { LANGUAGES, LEAD_STATUSES } from "@/lib/constants";

const selectClass =
  "h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-600 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none";

export default function CrmFilters({ q, status, language }: { q: string; status: string; language: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const apply = () => {
    const data = new FormData(formRef.current!);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) if (typeof value === "string" && value) params.set(key, value);
    const query = params.toString();
    router.replace(query ? `/admin/crm?${query}` : "/admin/crm");
  };

  return (
    <form
      ref={formRef}
      action="/admin/crm"
      method="get"
      onSubmit={(event) => {
        event.preventDefault();
        apply();
      }}
      className="flex flex-col gap-3 border-b border-neutral-100 p-4 lg:flex-row lg:items-center"
    >
      <div className="relative flex-1">
        <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Nombre, email o teléfono…"
          aria-label="Buscar"
          className="h-10 w-full rounded-xl border border-neutral-200 pr-3 pl-10 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <select name="estado" defaultValue={status} onChange={apply} aria-label="Estado" className={selectClass}>
          <option value="">Estado: todos</option>
          {LEAD_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
          <option value="Sin cuestionario">Sin cuestionario</option>
        </select>
        <select name="idioma" defaultValue={language} onChange={apply} aria-label="Idioma" className={selectClass}>
          <option value="">Idioma: todos</option>
          {LANGUAGES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline" size="sm" className="h-10">
          Filtrar
        </Button>
      </div>
    </form>
  );
}
