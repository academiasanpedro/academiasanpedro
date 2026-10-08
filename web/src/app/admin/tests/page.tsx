// Vista: Evaluador y Resultados (/admin/tests/evaluate)
// TODO: Conectar con base de datos. Implementar Modal accesible con Headless UI o Radix.

"use client";

import { useState, useEffect } from "react";
import { Search, Eye, X, Check, XCircle, Send, Database, PenTool, Save, Plus, Trash2 } from "lucide-react";
import { NIVELES_CAMBRIDGE, IDIOMAS_OFERTADOS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function TestsPage() {
  const [activeTab, setActiveTab] = useState<"evaluator" | "builder">("evaluator");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [allTests, setAllTests] = useState<Record<string, any[]>>({});
  const [selectedLang, setSelectedLang] = useState<string>("Inglés");
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [savingTest, setSavingTest] = useState(false);

  // Evaluation form state
  const [evalLevel, setEvalLevel] = useState("");
  const [evalNotes, setEvalNotes] = useState("");
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("level_tests")
        .select(`
          id,
          language,
          score,
          max_score,
          answers,
          completed_at,
          status,
          profiles(full_name, email)
        `)
        .eq("status", "pending_review")
        .order("completed_at", { ascending: false });

      if (data) {
        const mapped = data.map(item => ({
          id: item.id,
          nombre: (item.profiles as any)?.full_name || "Alumno Anónimo",
          email: (item.profiles as any)?.email,
          fecha: new Date(item.completed_at).toLocaleString(),
          score: `${item.score}/${item.max_score || 0}`,
          score_num: item.score,
          max_score: item.max_score || 0,
          answers: item.answers,
          idioma: item.language,
          respuestas_correctas: item.score || 0
        }));
        setPendientes(mapped);
      }

      // Fetch global test questions
      const { data: testData } = await supabase
        .from("global_test")
        .select("test_data")
        .eq("id", 1)
        .single();
      
      if (testData?.test_data) {
        // If it's an array (old format), convert it to an object under "Inglés"
        if (Array.isArray(testData.test_data)) {
          setAllTests({ "Inglés": testData.test_data });
          setTestQuestions(testData.test_data);
        } else {
          setAllTests(testData.test_data);
          setTestQuestions(testData.test_data["Inglés"] || []);
        }
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gestión de Pruebas de Nivel</h1>
          <p className="text-neutral-500 mt-1">
            Administra el contenido del test maestro y evalúa a los alumnos registrados.
          </p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-neutral-200">
        <button 
          onClick={() => setActiveTab("evaluator")}
          className={`pb-3 text-sm font-bold transition-all ${activeTab === 'evaluator' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500 hover:text-neutral-800'}`}
        >
          Evaluador de Alumnos
        </button>
        <button 
          onClick={() => setActiveTab("builder")}
          className={`pb-3 text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'builder' ? 'border-b-2 border-primary text-primary' : 'text-neutral-500 hover:text-neutral-800'}`}
        >
          <PenTool size={16} />
          Constructor del Test Global
        </button>
      </div>

      {activeTab === "evaluator" && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar alumno..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-neutral-500 font-medium border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">Alumno</th>
                <th className="px-6 py-4">Fecha Finalización</th>
                <th className="px-6 py-4">Idioma</th>
                <th className="px-6 py-4">Puntuación Test</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    Cargando pruebas pendientes...
                  </td>
                </tr>
              ) : pendientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-400">
                      <Database size={32} className="mb-3 text-neutral-300" />
                      <p className="text-sm font-medium text-neutral-900">No hay pruebas pendientes</p>
                      <p className="text-xs mt-1">¡Buen trabajo! Has evaluado todos los tests recibidos.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pendientes.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-900">{item.nombre}</td>
                    <td className="px-6 py-4 text-neutral-600">{item.fecha}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700">
                        {item.idioma}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.score_num / Math.max(item.max_score, 1) > 0.75 ? 'bg-success' : item.score_num / Math.max(item.max_score, 1) > 0.5 ? 'bg-secondary' : 'bg-error'}`} 
                            style={{ width: `${(item.score_num / Math.max(item.max_score, 1)) * 100}%` }}
                          />
                        </div>
                        <span className="font-bold text-neutral-900">{item.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedStudent(item)}
                        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-primary-dark transition-colors"
                      >
                        <Eye size={16} />
                        Evaluar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {activeTab === "builder" && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Editor del Test Global</h2>
              <p className="text-sm text-neutral-500 mt-1 mb-4">
                Añade o modifica las preguntas del test interactivo por cada idioma.
              </p>
              
              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-neutral-700">Idioma:</label>
                <select 
                  value={selectedLang}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    // Guardar el estado actual en allTests antes de cambiar
                    setAllTests(prev => ({ ...prev, [selectedLang]: testQuestions }));
                    setSelectedLang(newLang);
                    setTestQuestions(allTests[newLang] || []);
                  }}
                  className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold focus:outline-none focus:border-primary shadow-sm"
                >
                  {IDIOMAS_OFERTADOS.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button 
                onClick={() => setTestQuestions([...testQuestions, { q: "", options: ["", "", "", ""], answer: 0 }])}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 text-sm font-bold rounded-xl hover:bg-neutral-200 transition-colors"
              >
                <Plus size={16} />
                Añadir Pregunta
              </button>
              <button 
                onClick={async () => {
                  setSavingTest(true);
                  const supabase = createClient();
                  
                  const updatedAllTests = { ...allTests, [selectedLang]: testQuestions };
                  setAllTests(updatedAllTests);
                  
                  await supabase.from("global_test").update({ test_data: updatedAllTests }).eq("id", 1);
                  
                  setSavingTest(false);
                  alert("Test guardado correctamente.");
                }}
                disabled={savingTest}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50"
              >
                <Save size={16} />
                {savingTest ? "Guardando..." : "Guardar Test"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {testQuestions.map((q, i) => (
              <div key={i} className="p-5 border border-neutral-200 rounded-2xl bg-neutral-50/50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-neutral-900">Pregunta {i + 1}</h3>
                  <button 
                    onClick={() => {
                      const newQ = [...testQuestions];
                      newQ.splice(i, 1);
                      setTestQuestions(newQ);
                    }}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Enunciado</label>
                    <input 
                      type="text" 
                      value={q.q}
                      onChange={(e) => {
                        const newQ = [...testQuestions];
                        newQ[i].q = e.target.value;
                        setTestQuestions(newQ);
                      }}
                      placeholder="Ej: I ____ from Spain."
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {q.options.map((opt: string, optIdx: number) => (
                      <div key={optIdx} className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name={`answer-${i}`} 
                          checked={q.answer === optIdx}
                          onChange={() => {
                            const newQ = [...testQuestions];
                            newQ[i].answer = optIdx;
                            setTestQuestions(newQ);
                          }}
                          className="h-4 w-4 text-primary focus:ring-primary border-neutral-300"
                        />
                        <input 
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newQ = [...testQuestions];
                            newQ[i].options[optIdx] = e.target.value;
                            setTestQuestions(newQ);
                          }}
                          placeholder={`Opción ${optIdx + 1}`}
                          className={`w-full px-4 py-2 bg-white border rounded-xl text-sm focus:outline-none shadow-sm ${q.answer === optIdx ? 'border-primary ring-1 ring-primary/20' : 'border-neutral-200 focus:border-primary'}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {testQuestions.length === 0 && (
              <div className="text-center py-12 text-neutral-400">
                <p>El test está vacío.</p>
                <p className="text-sm">Añade la primera pregunta usando el botón superior.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Evaluación (Simplificado) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50/50">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Evaluación: {selectedStudent.nombre}</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Idioma: {selectedStudent.idioma} • Puntuación: {selectedStudent.score}
                </p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Columna Izquierda: Respuestas del alumno */}
              <div>
                <h4 className="font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">Desglose de Respuestas</h4>
                <div className="space-y-4">
                  {testQuestions.map((q, i) => {
                    const studentAnswerIndex = selectedStudent.answers ? selectedStudent.answers[i] : -1;
                    const isCorrect = studentAnswerIndex === q.answer;
                    
                    if (studentAnswerIndex === -1 || studentAnswerIndex === undefined) return null;

                    return (
                      <div key={i} className={`${isCorrect ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'} border rounded-xl p-4`}>
                        <p className="text-sm font-medium text-neutral-900 mb-2">{i + 1}. {q.q}</p>
                        <div className={`flex items-center gap-2 text-sm ${isCorrect ? 'text-success' : 'text-error mb-1'}`}>
                          {isCorrect ? <Check size={16} /> : <XCircle size={16} />}
                          <span className={!isCorrect ? 'line-through opacity-70' : ''}>
                            Respuesta: {q.options[studentAnswerIndex]} {isCorrect && "(Correcta)"}
                          </span>
                        </div>
                        {!isCorrect && (
                          <p className="text-xs text-neutral-600 pl-6">Correcta: {q.options[q.answer]}</p>
                        )}
                      </div>
                    );
                  })}
                  {(!selectedStudent.answers || selectedStudent.answers.length === 0) && (
                    <p className="text-sm text-neutral-500 italic">No hay datos de respuestas para este test (formato antiguo).</p>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Asignación */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">1. Asignar Nivel Oficial</h4>
                  <select 
                    value={evalLevel}
                    onChange={(e) => setEvalLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm font-medium"
                  >
                    <option value="" disabled>Selecciona el nivel acreditado...</option>
                    {NIVELES_CAMBRIDGE.map(nivel => (
                      <option key={nivel} value={nivel}>{nivel}</option>
                    ))}
                    <option value="A1">Iniciación (A1)</option>
                    <option value="A2">Básico (A2)</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-2">Nivel asignado oficialmente al alumno.</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">2. Nota Interna Adicional (Opcional)</h4>
                  <textarea 
                    rows={3} 
                    value={evalNotes}
                    onChange={(e) => setEvalNotes(e.target.value)}
                    placeholder="Escribe alguna observación..."
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/50 flex justify-end gap-3">
              <button 
                disabled={evaluating}
                onClick={() => {
                  setSelectedStudent(null);
                  setEvalLevel("");
                  setEvalNotes("");
                }}
                className="px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                disabled={!evalLevel || evaluating}
                onClick={async () => {
                  setEvaluating(true);
                  try {
                    // Call server action dynamically since this is a client component but we want to avoid import cycle issues if any, or just import it at top
                    // Actually, I can import it at top.
                    const { evaluateTestAndSendEmail } = await import("@/app/actions/tests");
                    const res = await evaluateTestAndSendEmail(selectedStudent.id, selectedStudent.email, evalLevel, evalNotes);
                    
                    if (res.success) {
                      setPendientes(prev => prev.filter(p => p.id !== selectedStudent.id));
                      setSelectedStudent(null);
                      setEvalLevel("");
                      setEvalNotes("");
                    } else {
                      alert("Error: " + res.error);
                    }
                  } catch (e: any) {
                    alert("Error: " + e.message);
                  } finally {
                    setEvaluating(false);
                  }
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-[0_4px_14px_0_rgba(36,59,120,0.39)] hover:bg-primary-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {evaluating ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Send size={16} />
                )}
                {evaluating ? "Enviando..." : "Guardar y Enviar Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
