"use client";

import { useState } from "react";
import { Send, Users, AlignLeft, Bold, Italic, Link as LinkIcon, Image as ImageIcon, Mail, CheckCircle } from "lucide-react";
import { sendMarketingCampaign } from "@/app/actions/marketing";

export default function MarketingForm({ audienceCount }: { audienceCount: number }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await sendMarketingCampaign(formData);
    
    setLoading(false);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert("Error al enviar la campaña: " + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col md:flex-row relative">
      
      {success && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">¡Campaña Enviada!</h2>
          <p className="text-neutral-500 font-medium mt-2">
            El correo se ha enviado a {audienceCount} destinatarios.
          </p>
        </div>
      )}

      {/* Panel Lateral: Selector de Audiencia */}
      <div className="w-full md:w-1/3 bg-neutral-50/50 border-b md:border-b-0 md:border-r border-neutral-200 p-6">
        <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Users size={18} className="text-primary" />
          Público Objetivo
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Segmentar por Estado</label>
            <select name="segment" className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary shadow-sm">
              <option>Todos los registros</option>
              <option>Solo Leads (No matriculados)</option>
              <option>Solo Alumnos Matriculados</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Segmentar por Nivel/Idioma</label>
            <select className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary shadow-sm">
              <option>Cualquier idioma/nivel</option>
              <option>Interesados en Inglés B1</option>
              <option>Interesados en Inglés B2</option>
              <option>Interesados en Francés</option>
            </select>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="bg-primary/10 rounded-xl p-4 flex items-start gap-3 border border-primary/20">
              <div className="text-primary mt-0.5"><Users size={16} /></div>
              <div>
                <p className="text-xs font-bold text-primary">Audiencia Estimada</p>
                <p className="text-2xl font-black text-primary-dark tracking-tight mt-1">{audienceCount}</p>
                <p className="text-xs text-primary-dark/70 mt-0.5">Contactos recibirán este email</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-neutral-500 bg-neutral-100 p-3 rounded-lg border border-neutral-200/60">
              <Mail size={14} className="shrink-0" />
              <span>
                Remitente: <strong className="text-neutral-700">academiasanpedro26@gmail.com</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Principal: Editor de Email */}
      <div className="w-full md:w-2/3 p-6 flex flex-col">
        <div className="mb-4">
          <label className="block text-sm font-bold text-neutral-900 mb-1">Asunto del Email</label>
          <input 
            type="text" 
            name="subject"
            required
            placeholder="Ej: ¡Últimas plazas para el intensivo B1!" 
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
          />
        </div>

        <div className="flex-1 flex flex-col border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          {/* Toolbar WYSIWYG Mock */}
          <div className="flex items-center gap-1 p-2 bg-neutral-50 border-b border-neutral-200">
            <button type="button" className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded transition-colors"><Bold size={16} /></button>
            <button type="button" className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded transition-colors"><Italic size={16} /></button>
            <div className="w-px h-4 bg-neutral-300 mx-1"></div>
            <button type="button" className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded transition-colors"><AlignLeft size={16} /></button>
            <div className="w-px h-4 bg-neutral-300 mx-1"></div>
            <button type="button" className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded transition-colors"><LinkIcon size={16} /></button>
            <button type="button" className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded transition-colors"><ImageIcon size={16} /></button>
          </div>
          {/* Editor Area */}
          <textarea 
            name="content"
            required
            className="flex-1 w-full p-4 resize-none focus:outline-none text-sm text-neutral-700 min-h-[300px]"
            placeholder="Escribe aquí el contenido de tu comunicado..."
          ></textarea>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgba(200,50,50,0.39)] hover:bg-secondary-dark hover:shadow-[0_6px_20px_rgba(200,50,50,0.23)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Send size={18} />
            )}
            {loading ? "Enviando..." : "Enviar Campaña"}
          </button>
        </div>
      </div>

    </form>
  );
}
