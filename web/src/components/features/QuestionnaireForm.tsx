"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { questionnaireSchema, type QuestionnaireFormData } from "@/lib/validators/questionnaire";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { IDIOMAS_OFERTADOS } from "@/lib/constants";

export default function QuestionnaireForm({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireSchema),
  });

  const onSubmit = async (data: QuestionnaireFormData) => {
    setServerError(null);

    const { error } = await supabase.from("leads_questionnaire").insert({
      user_id: userId,
      target_language: data.target_language,
      current_level: data.current_level,
      preferred_schedule: data.preferred_schedule,
      goals: data.goals || "",
      status: "Interesado"
    });

    if (error) {
      // 23505 is PostgreSQL unique violation (409 Conflict)
      if (error.code === "23505" || error.message.toLowerCase().includes("duplicate")) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 2000);
        return;
      }
      
      setServerError(`Error de base de datos (${error.code || '409'}): ${error.message}`);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 2000);
  };

  if (success) {
    return (
      <div className="bg-success/10 border border-success/30 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-success-dark mb-2">¡Gracias por tus respuestas!</h3>
        <p className="text-success-dark/80">Estamos preparando tu perfil. Te redirigiremos en breve...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] border border-white/60 shadow-xl shadow-neutral-200/50 ring-1 ring-neutral-900/5 relative overflow-hidden">
      
      {/* Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <label className="block text-sm font-black text-neutral-900 mb-3 uppercase tracking-wider">¿Qué idioma quieres aprender o mejorar?</label>
        <div className="relative">
          <select 
            {...register("target_language")}
            className="w-full px-5 py-4 bg-white border border-neutral-200/80 rounded-2xl text-base font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Selecciona un idioma...</option>
            {IDIOMAS_OFERTADOS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-neutral-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.target_language && <p className="text-error text-sm mt-2 font-bold flex items-center gap-1"><span className="text-lg">⚠</span> {errors.target_language.message}</p>}
      </div>

      <div className="relative z-10">
        <label className="block text-sm font-black text-neutral-900 mb-3 uppercase tracking-wider">¿Cuál crees que es tu nivel actual?</label>
        <div className="relative">
          <select 
            {...register("current_level")}
            className="w-full px-5 py-4 bg-white border border-neutral-200/80 rounded-2xl text-base font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Selecciona tu nivel...</option>
            <option value="No estoy seguro/a">No estoy seguro/a (Empezar desde cero)</option>
            <option value="Principiante (A1-A2)">Principiante (A1-A2)</option>
            <option value="Intermedio (B1-B2)">Intermedio (B1-B2)</option>
            <option value="Avanzado (C1-C2)">Avanzado (C1-C2)</option>
          </select>
          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-neutral-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.current_level && <p className="text-error text-sm mt-2 font-bold flex items-center gap-1"><span className="text-lg">⚠</span> {errors.current_level.message}</p>}
      </div>

      <div className="relative z-10">
        <label className="block text-sm font-black text-neutral-900 mb-3 uppercase tracking-wider">¿Qué horario prefieres para tus clases?</label>
        <div className="relative">
          <select 
            {...register("preferred_schedule")}
            className="w-full px-5 py-4 bg-white border border-neutral-200/80 rounded-2xl text-base font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Selecciona tu disponibilidad...</option>
            <option value="Mañanas">Mañanas</option>
            <option value="Tardes">Tardes</option>
            <option value="Noches">Noches</option>
            <option value="Fines de semana">Fines de semana</option>
            <option value="Flexible">Soy flexible</option>
          </select>
          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-neutral-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.preferred_schedule && <p className="text-error text-sm mt-2 font-bold flex items-center gap-1"><span className="text-lg">⚠</span> {errors.preferred_schedule.message}</p>}
      </div>

      <div className="relative z-10">
        <label className="block text-sm font-black text-neutral-900 mb-3 uppercase tracking-wider flex items-center justify-between">
          <span>¿Cuáles son tus objetivos?</span>
          <span className="text-xs text-neutral-400 font-bold bg-neutral-100 px-2 py-1 rounded-md">Opcional</span>
        </label>
        <textarea 
          {...register("goals")}
          rows={3}
          placeholder="Ej: Necesito sacarme el B2 para la universidad, quiero mejorar mi speaking..."
          className="w-full px-5 py-4 bg-white border border-neutral-200/80 rounded-2xl text-base font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm resize-none"
        ></textarea>
        {errors.goals && <p className="text-error text-sm mt-2 font-bold flex items-center gap-1"><span className="text-lg">⚠</span> {errors.goals.message}</p>}
      </div>

      {serverError && (
        <div className="relative z-10 rounded-2xl bg-error/10 px-5 py-4 text-sm text-error border border-error/20 font-bold shadow-sm">
          {serverError}
        </div>
      )}

      <div className="pt-4 relative z-10">
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full py-4 rounded-xl font-black text-white text-lg bg-gradient-to-r from-primary to-primary-dark hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : "Enviar Cuestionario"}
        </button>
      </div>
    </form>
  );
}
