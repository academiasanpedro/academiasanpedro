"use client";

import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";
import { updateLegalPage } from "@/app/actions/legal";

export default function LegalEditor({ 
  pages 
}: { 
  pages: { slug: string; title: string; content: string }[] 
}) {
  const [activeSlug, setActiveSlug] = useState(pages[0]?.slug);
  const [contents, setContents] = useState<Record<string, string>>(() => {
    const acc: Record<string, string> = {};
    pages.forEach(p => {
      acc[p.slug] = p.content;
    });
    return acc;
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: "success"|"error", text: string} | null>(null);

  if (!pages || pages.length === 0) {
    return (
      <div className="text-center py-20 text-neutral-500">
        <AlertCircle className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
        <p>No se han encontrado páginas legales en la base de datos.</p>
        <p className="text-sm mt-2">Ejecuta el script SQL en Supabase para crearlas.</p>
      </div>
    );
  }

  const activePage = pages.find(p => p.slug === activeSlug);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const content = contents[activeSlug];
    const res = await updateLegalPage(activeSlug, content);
    
    if (res.success) {
      setMessage({ type: "success", text: "Página guardada correctamente." });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: "Error al guardar: " + res.error });
    }
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="flex border-b border-neutral-200 overflow-x-auto">
        {pages.map(p => (
          <button
            key={p.slug}
            onClick={() => setActiveSlug(p.slug)}
            className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors ${
              activeSlug === p.slug 
                ? "border-b-2 border-primary text-primary" 
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">{activePage?.title}</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Puedes usar HTML básico como &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, etc. para maquetar el texto.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-[0_4px_14px_0_rgba(36,59,120,0.39)] hover:bg-primary-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
          >
            <Save size={16} />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${
            message.type === "success" ? "bg-success/10 text-success" : "bg-error/10 text-error"
          }`}>
            <AlertCircle size={18} />
            {message.text}
          </div>
        )}

        <textarea
          value={contents[activeSlug] || ""}
          onChange={(e) => setContents(prev => ({ ...prev, [activeSlug]: e.target.value }))}
          className="w-full h-[500px] p-6 bg-neutral-50/50 border border-neutral-200 rounded-2xl text-sm text-neutral-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-inner font-mono resize-none leading-relaxed"
          placeholder="Escribe aquí el contenido legal..."
        />
      </div>
    </div>
  );
}
