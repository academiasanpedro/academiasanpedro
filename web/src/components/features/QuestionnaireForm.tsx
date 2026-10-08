// Cuestionario inicial del alumno
// Ref: AcademiaSanPedro/03_Flows.md → Cuestionario

"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, PartyPopper } from "lucide-react";
import { submitQuestionnaire } from "@/app/actions/questionnaire";
import Alert from "@/components/ui/Alert";
import Button, { ButtonLink } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ChoiceCard from "@/components/ui/ChoiceCard";
import Flag from "@/components/ui/Flag";
import { TextareaField } from "@/components/ui/Form";
import { LANGUAGES, SCHEDULES, SELF_ASSESSED_LEVELS } from "@/lib/constants";
import { questionnaireSchema, type QuestionnaireFormData } from "@/lib/validators/questionnaire";

const LEVEL_HINTS: Record<(typeof SELF_ASSESSED_LEVELS)[number], string> = {
  "No estoy seguro/a": "El test de nivel lo aclarará",
  "Principiante (A1-A2)": "Empiezo o me defiendo con lo básico",
  "Intermedio (B1-B2)": "Mantengo conversaciones sencillas",
  "Avanzado (C1-C2)": "Me expreso con fluidez",
};

function Question({ number, title, error, children }: { number: number; title: string; error?: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="flex items-center gap-3 text-lg font-black tracking-tight text-neutral-900">
        <span className="grid size-8 place-items-center rounded-xl bg-primary text-sm text-white">{number}</span>
        {title}
      </legend>
      {children}
      {error && (
        <p role="alert" className="text-sm font-medium text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export default function QuestionnaireForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedLanguage, setSubmittedLanguage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: { goals: "" },
  });

  const goalsLength = useWatch({ control, name: "goals" })?.length ?? 0;

  const onSubmit = async (data: QuestionnaireFormData) => {
    setServerError(null);
    const result = await submitQuestionnaire(data);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    setSubmittedLanguage(data.target_language);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submittedLanguage) {
    return (
      <Card className="p-8 text-center sm:p-12 animate-scale-in">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-success/10 text-success">
          <PartyPopper size={30} aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-2xl font-black tracking-tight text-neutral-900">¡Gracias! Ya casi está</h2>
        <p className="mx-auto mt-3 max-w-md text-neutral-500">
          El último paso es el test de nivel de {submittedLanguage}. No tiene límite de tiempo y lo revisará un profesor.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={`/dashboard/level-test?lang=${encodeURIComponent(submittedLanguage)}`} variant="secondary" size="lg">
            Hacer el test ahora
            <ArrowRight size={18} aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/dashboard" variant="outline" size="lg">
            Ir a mi panel
          </ButtonLink>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
        <Question number={1} title="¿Qué idioma quieres aprender o mejorar?" error={errors.target_language?.message}>
          <div className="grid gap-3 sm:grid-cols-2">
            {LANGUAGES.map((language) => (
              <ChoiceCard
                key={language}
                value={language}
                label={language}
                icon={<Flag language={language} className="size-9" />}
                {...register("target_language")}
              />
            ))}
          </div>
        </Question>

        <Question number={2} title="¿Cuál crees que es tu nivel actual?" error={errors.current_level?.message}>
          <div className="grid gap-3 sm:grid-cols-2">
            {SELF_ASSESSED_LEVELS.map((level) => (
              <ChoiceCard key={level} value={level} label={level} description={LEVEL_HINTS[level]} {...register("current_level")} />
            ))}
          </div>
        </Question>

        <Question number={3} title="¿Qué horario prefieres?" error={errors.preferred_schedule?.message}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SCHEDULES.map((schedule) => (
              <ChoiceCard
                key={schedule}
                value={schedule}
                label={schedule === "Flexible" ? "Soy flexible" : schedule}
                compact
                {...register("preferred_schedule")}
              />
            ))}
          </div>
        </Question>

        <fieldset className="space-y-4">
          <legend className="flex items-center gap-3 text-lg font-black tracking-tight text-neutral-900">
            <span className="grid size-8 place-items-center rounded-xl bg-primary text-sm text-white">4</span>
            ¿Qué te gustaría conseguir?
          </legend>
          <TextareaField
            label="Tus objetivos"
            optional
            rows={4}
            maxLength={500}
            placeholder="Ej.: necesito el B2 para la universidad, quiero ganar soltura hablando…"
            hint={`${goalsLength}/500 caracteres`}
            error={errors.goals?.message}
            {...register("goals")}
          />
        </fieldset>

        {serverError && <Alert tone="error">{serverError}</Alert>}

        <div className="flex flex-col-reverse items-center gap-4 border-t border-neutral-100 pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-neutral-400">Solo lo verá el equipo de la academia.</p>
          <Button type="submit" size="lg" isLoading={isSubmitting} loadingText="Enviando…" className="w-full sm:w-auto">
            Enviar respuestas
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
