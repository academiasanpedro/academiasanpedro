// Vista: Constructor de Pruebas (/admin/tests/builder)
// TODO: Guardar datos en Supabase Storage (archivos) y Base de datos (preguntas)

"use client";

import { useState } from "react";
import { UploadCloud, Plus, GripVertical, Trash2, Settings, FileAudio, FileText } from "lucide-react";

export default function TestsBuilderPage() {
  const [questions, setQuestions] = useState([
    { id: 1, text: "", type: "multiple", points: 1 }
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Constructor de Pruebas</h1>
        <p className="text-neutral-500 mt-1">
          Añade material multimedia y crea el cuestionario interactivo para evaluar el nivel de los alumnos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Ajustes Generales y Dropzone */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Settings size={18} className="text-primary" />
              Configuración de la Prueba
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Idioma</label>
                <select className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option>Inglés</option>
                  <option>Francés</option>
                  <option>Alemán</option>
                  <option>Italiano</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Título de la sección</label>
                <input 
                  type="text" 
                  defaultValue="Prueba de Nivel General" 
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">Archivos Adjuntos (Listening / Reading)</h2>
            
            {/* Dropzone Simulada */}
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-neutral-50 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud size={24} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-neutral-900 mb-1">Haz clic o arrastra archivos aquí</p>
              <p className="text-xs text-neutral-500">Admite .mp3 (Audio) y .pdf (Lecturas)</p>
            </div>

            {/* Archivos subidos mock */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex items-center gap-3">
                  <FileAudio size={18} className="text-secondary" />
                  <span className="text-sm font-medium text-neutral-700">listening_part1.mp3</span>
                </div>
                <button className="text-neutral-400 hover:text-error transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-primary" />
                  <span className="text-sm font-medium text-neutral-700">reading_cambridge.pdf</span>
                </div>
                <button className="text-neutral-400 hover:text-error transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Creador de Preguntas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Preguntas del Cuestionario</h2>
            <button 
              onClick={() => setQuestions([...questions, { id: Date.now(), text: "", type: "multiple", points: 1 }])}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-primary-dark transition-colors"
            >
              <Plus size={16} />
              Añadir Pregunta
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 relative group">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 hidden group-hover:flex p-1 bg-white border border-neutral-200 rounded cursor-grab shadow-sm text-neutral-400 hover:text-neutral-700">
                  <GripVertical size={16} />
                </div>
                
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder={`Pregunta ${index + 1}`} 
                      className="w-full text-lg font-semibold text-neutral-900 placeholder:text-neutral-400 bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-primary focus:outline-none transition-colors pb-1"
                      defaultValue={index === 0 ? "What time _____ you usually wake up?" : ""}
                    />
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <select className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-700 focus:outline-none focus:border-primary">
                      <option>Opción Múltiple</option>
                      <option>Verdadero / Falso</option>
                      <option>Texto Libre</option>
                    </select>
                    <div className="flex items-center gap-1.5">
                      <input type="number" defaultValue="1" className="w-16 px-2 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-center focus:outline-none focus:border-primary" />
                      <span className="text-sm text-neutral-500">pts</span>
                    </div>
                    <button className="p-2 text-neutral-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Opciones (Mock de Opción Múltiple) */}
                <div className="space-y-2 mt-4 pl-2 border-l-2 border-neutral-100">
                  <div className="flex items-center gap-3">
                    <input type="radio" name={`correct-${q.id}`} className="h-4 w-4 text-primary focus:ring-primary border-neutral-300" defaultChecked={index === 0} />
                    <input type="text" placeholder="Opción 1" defaultValue={index === 0 ? "do" : ""} className="flex-1 px-3 py-2 bg-neutral-50 border border-transparent hover:border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:bg-white transition-all" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="radio" name={`correct-${q.id}`} className="h-4 w-4 text-primary focus:ring-primary border-neutral-300" />
                    <input type="text" placeholder="Opción 2" defaultValue={index === 0 ? "are" : ""} className="flex-1 px-3 py-2 bg-neutral-50 border border-transparent hover:border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:bg-white transition-all" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="radio" name={`correct-${q.id}`} className="h-4 w-4 text-primary focus:ring-primary border-neutral-300" />
                    <input type="text" placeholder="Opción 3" defaultValue={index === 0 ? "does" : ""} className="flex-1 px-3 py-2 bg-neutral-50 border border-transparent hover:border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:bg-white transition-all" />
                  </div>
                  <button className="text-sm font-medium text-primary hover:text-primary-dark ml-7 mt-2 transition-colors">
                    + Añadir Opción
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button className="bg-success text-white px-6 py-3 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:bg-green-700 hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] hover:-translate-y-0.5 transition-all">
              Guardar Prueba Completa
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
