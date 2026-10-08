"use client";

// Constructor del test maestro por idioma (actualizaciones inmutables + validación en servidor)

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Copy, Plus, Save, Trash2, X } from "lucide-react";
import { saveLevelTest } from "@/app/actions/level-test";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Flag from "@/components/ui/Flag";
import { LANGUAGES } from "@/lib/constants";
import type { LevelTestData, LevelTestQuestion } from "@/lib/level-test";
import { cn } from "@/lib/utils";

const emptyQuestion = (): LevelTestQuestion => ({ q: "", options: ["", "", "", ""], answer: 0 });

export default function TestBuilder({ testData }: { testData: LevelTestData }) {
  const router = useRouter();
  const [saved, setSaved] = useState<LevelTestData>(testData);
  const [language, setLanguage] = useState<string>(LANGUAGES[0]);
  const [questions, setQuestions] = useState<LevelTestQuestion[]>(testData[LANGUAGES[0]] ?? []);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const dirty = JSON.stringify(questions) !== JSON.stringify(saved[language] ?? []);

  const switchLanguage = (next: string) => {
    if (dirty && !window.confirm("Tienes cambios sin guardar en este idioma. ¿Descartarlos?")) return;
    setLanguage(next);
    setQuestions(saved[next] ?? []);
    setFeedback(null);
  };

  const updateQuestion = (index: number, patch: Partial<LevelTestQuestion>) =>
    setQuestions((current) => current.map((question, i) => (i === index ? { ...question, ...patch } : question)));

  const updateOption = (index: number, optionIndex: number, value: string) =>
    setQuestions((current) =>
      current.map((question, i) =>
        i === index ? { ...question, options: question.options.map((option, j) => (j === optionIndex ? value : option)) } : question
      )
    );

  const removeOption = (index: number, optionIndex: number) =>
    setQuestions((current) =>
      current.map((question, i) => {
        if (i !== index) return question;
        const options = question.options.filter((_, j) => j !== optionIndex);
        const answer =
          question.answer === optionIndex ? 0 : question.answer > optionIndex ? question.answer - 1 : question.answer;
        return { ...question, options, answer };
      })
    );

  const move = (index: number, direction: -1 | 1) =>
    setQuestions((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    const result = await saveLevelTest(language, questions);
    setSaving(false);
    if (result.ok) {
      setSaved((current) => ({ ...current, [language]: questions }));
      setFeedback({ ok: true, text: result.message ?? "Test guardado." });
      router.refresh();
    } else {
      setFeedback({ ok: false, text: result.error });
    }
  };

  return (
    <div className="space-y-5">
      <Card className="sticky top-24 z-20 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Idioma del test">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => lang !== language && switchLanguage(lang)}
              aria-pressed={lang === language}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition",
                lang === language ? "bg-primary-50 text-primary ring-1 ring-primary/20" : "text-neutral-500 hover:bg-neutral-100"
              )}
            >
              <Flag language={lang} className="size-5 ring-1" />
              {lang}
              <span className="text-xs opacity-60">{saved[lang]?.length ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {dirty && <Badge tone="warning">Sin guardar</Badge>}
          <Button onClick={handleSave} isLoading={saving} loadingText="Guardando…" disabled={!dirty}>
            <Save size={16} aria-hidden="true" />
            Guardar {language}
          </Button>
        </div>
      </Card>

      {feedback && <Alert tone={feedback.ok ? "success" : "error"}>{feedback.text}</Alert>}

      {questions.length === 0 ? (
        <Card>
          <EmptyState
            icon={Plus}
            title={`El test de ${language} está vacío`}
            description="Los alumnos no podrán elegir este idioma hasta que tenga preguntas."
            action={
              <Button onClick={() => setQuestions([emptyQuestion()])}>
                <Plus size={16} aria-hidden="true" />
                Añadir la primera pregunta
              </Button>
            }
          />
        </Card>
      ) : (
        <ol className="space-y-4">
          {questions.map((question, index) => (
            <li key={index}>
              <Card className="p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-sm font-black text-neutral-400">Pregunta {index + 1}</span>
                  <div className="flex gap-1">
                    {[
                      { icon: ArrowUp, label: "Subir", onClick: () => move(index, -1), disabled: index === 0 },
                      { icon: ArrowDown, label: "Bajar", onClick: () => move(index, 1), disabled: index === questions.length - 1 },
                      {
                        icon: Copy,
                        label: "Duplicar",
                        onClick: () =>
                          setQuestions((current) => [
                            ...current.slice(0, index + 1),
                            { ...question, options: [...question.options] },
                            ...current.slice(index + 1),
                          ]),
                        disabled: false,
                      },
                    ].map(({ icon: Icon, label, onClick, disabled }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={onClick}
                        disabled={disabled}
                        aria-label={`${label} pregunta ${index + 1}`}
                        className="grid size-9 place-items-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30"
                      >
                        <Icon size={16} />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setQuestions((current) => current.filter((_, i) => i !== index))}
                      aria-label={`Eliminar pregunta ${index + 1}`}
                      className="grid size-9 place-items-center rounded-lg text-error/70 transition hover:bg-error/10 hover:text-error"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <label className="sr-only" htmlFor={`q-${index}`}>
                  Enunciado de la pregunta {index + 1}
                </label>
                <input
                  id={`q-${index}`}
                  value={question.q}
                  onChange={(event) => updateQuestion(index, { q: event.target.value })}
                  placeholder="Enunciado. Ej.: I ____ from Spain."
                  className="h-12 w-full rounded-xl border border-neutral-200 px-4 font-semibold text-neutral-900 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
                />

                <fieldset className="mt-4">
                  <legend className="mb-2 text-xs font-semibold text-neutral-500">Opciones · marca la correcta</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`answer-${index}`}
                          checked={question.answer === optionIndex}
                          onChange={() => updateQuestion(index, { answer: optionIndex })}
                          aria-label={`Marcar opción ${optionIndex + 1} como correcta`}
                          className="size-5 shrink-0 accent-success"
                        />
                        <input
                          value={option}
                          onChange={(event) => updateOption(index, optionIndex, event.target.value)}
                          placeholder={`Opción ${optionIndex + 1}`}
                          aria-label={`Opción ${optionIndex + 1}`}
                          className={cn(
                            "h-10 min-w-0 flex-1 rounded-xl border px-3 text-sm focus:ring-4 focus:outline-none",
                            question.answer === optionIndex
                              ? "border-success/40 bg-success/5 focus:ring-success/10"
                              : "border-neutral-200 focus:border-primary focus:ring-primary/10"
                          )}
                        />
                        {question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index, optionIndex)}
                            aria-label={`Quitar opción ${optionIndex + 1}`}
                            className="grid size-8 shrink-0 place-items-center rounded-lg text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {question.options.length < 6 && (
                    <button
                      type="button"
                      onClick={() => updateQuestion(index, { options: [...question.options, ""] })}
                      className="mt-3 text-sm font-bold text-primary hover:text-primary-dark"
                    >
                      + Añadir opción
                    </button>
                  )}
                </fieldset>
              </Card>
            </li>
          ))}
        </ol>
      )}

      {questions.length > 0 && (
        <Button variant="outline" size="lg" fullWidth onClick={() => setQuestions((current) => [...current, emptyQuestion()])}>
          <Plus size={18} aria-hidden="true" />
          Añadir pregunta
        </Button>
      )}
    </div>
  );
}
