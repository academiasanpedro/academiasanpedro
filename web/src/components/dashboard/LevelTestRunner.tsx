"use client";

import { useState } from "react";
import { Check, ChevronRight, AlertCircle, RefreshCcw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { IDIOMAS_OFERTADOS } from "@/lib/constants";

export default function TestRunner({ testData }: { testData: Record<string, any[]> }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [language, setLanguage] = useState("");
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const languageQuestions = language ? (testData[language] || []) : [];

  const handleStart = () => {
    if (!language || languageQuestions.length === 0) {
      alert("Lo sentimos, aún no hay preguntas configuradas para este idioma.");
      return;
    }
    setAnswers(new Array(languageQuestions.length).fill(-1));
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-neutral-100 mt-10">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            📝
          </div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-4">
            Test de Nivel Global
          </h1>
          <p className="text-neutral-500 mb-8 font-medium">
            Selecciona el idioma que deseas evaluar. No hay límite de tiempo, pero intenta no usar traductores para que podamos evaluar tu nivel real.
          </p>
          
          <div className="max-w-xs mx-auto mb-8 text-left space-y-2">
            <label className="font-bold text-sm text-neutral-700">Idioma a evaluar:</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold focus:outline-none focus:border-primary shadow-sm"
            >
              <option value="" disabled>Selecciona un idioma...</option>
              {IDIOMAS_OFERTADOS.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleStart}
            disabled={!language}
            className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
          >
            Comenzar Prueba
          </button>
        </div>
      </div>
    );
  }

  const q = languageQuestions[currentQuestion];
  const isLast = currentQuestion === languageQuestions.length - 1;

  const handleSelect = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === -1) {
      setError("Por favor, selecciona una respuesta antes de continuar.");
      return;
    }
    setError("");
    if (!isLast) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    setSubmitting(true);
    let score = 0;
    
    // Calcular score localmente
    answers.forEach((ans, idx) => {
      if (ans === languageQuestions[idx].answer) {
        score++;
      }
    });

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from("level_tests").insert({
        user_id: user.id,
        language,
        score,
        max_score: languageQuestions.length,
        answers: answers
      });
      router.push("/dashboard?test_completed=true");
    }
  };

  const progress = ((currentQuestion + 1) / languageQuestions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-neutral-100 relative overflow-hidden">
        {submitting && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
            <RefreshCcw className="w-10 h-10 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-bold text-neutral-900">Enviando resultados...</h2>
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between items-center text-sm font-bold text-neutral-400 mb-4">
            <span>Pregunta {currentQuestion + 1} de {languageQuestions.length}</span>
            <span>{Math.round(progress)}% Completado</span>
          </div>
          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h2 className="text-2xl font-black text-neutral-900 mb-8 leading-relaxed">
          {q.q}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-error/10 text-error text-sm font-bold rounded-xl flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="space-y-4 mb-10">
          {q.options.map((opt: string, idx: number) => {
            const isSelected = answers[currentQuestion] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-medium text-lg flex items-center justify-between group ${
                  isSelected 
                    ? "border-primary bg-primary/5 text-primary shadow-sm" 
                    : "border-neutral-200 text-neutral-600 hover:border-primary/50 hover:bg-neutral-50"
                }`}
              >
                <span>{opt}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "border-primary bg-primary text-white" : "border-neutral-300 group-hover:border-primary/50"
                }`}>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-neutral-100">
          <button 
            onClick={() => {
              if (currentQuestion > 0) setCurrentQuestion(curr => curr - 1);
              setError("");
            }}
            disabled={currentQuestion === 0}
            className="px-6 py-3 text-sm font-bold text-neutral-500 hover:text-neutral-900 disabled:opacity-0 transition-all"
          >
            Atrás
          </button>
          
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark hover:-translate-y-0.5 transition-all"
          >
            {isLast ? "Finalizar y Enviar" : "Siguiente"}
            {!isLast && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
