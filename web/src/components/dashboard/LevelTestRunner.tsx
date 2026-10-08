"use client";

// Ejecución del test de nivel: una pregunta por pantalla, progreso guardado en localStorage,
// atajos de teclado (1-6 / A-F, Enter, ←/→) y revisión antes de enviar.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, HelpCircle, Send } from "lucide-react";
import { submitLevelTest } from "@/app/actions/level-test";
import Alert from "@/components/ui/Alert";
import Button, { ButtonLink } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Flag from "@/components/ui/Flag";
import type { PublicQuestion } from "@/lib/level-test";
import { cn } from "@/lib/utils";

const UNANSWERED = -1;
const SKIPPED = -2; // "No lo sé" en pantalla; se envía como -1
const LETTERS = ["A", "B", "C", "D", "E", "F"];

type Stage = "intro" | "question" | "review";

function storageKey(language: string, total: number) {
  return `level-test:${language}:${total}`;
}

function loadAnswers(key: string, total: number): number[] {
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) ?? "null");
    if (Array.isArray(saved) && saved.length === total) return saved;
  } catch {
    // almacenamiento no disponible o corrupto: empezar de cero
  }
  return new Array(total).fill(UNANSWERED);
}

const subscribeNoop = () => () => {};

export default function LevelTestRunner({ language, questions }: { language: string; questions: PublicQuestion[] }) {
  const router = useRouter();
  const total = questions.length;
  const key = storageKey(language, total);
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answerList = answers ?? (hydrated ? loadAnswers(key, total) : new Array(total).fill(UNANSWERED));
  const answeredCount = answerList.filter((answer) => answer >= 0).length;
  const startedBefore = hydrated && answerList.some((answer) => answer !== UNANSWERED);

  const choose = (value: number) => {
    const next = [...answerList];
    next[current] = value;
    setAnswers(next);
    setError(null);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // sin persistencia: el test sigue funcionando en memoria
    }
  };

  const goNext = () => {
    if (answerList[current] === UNANSWERED) {
      setError("Elige una respuesta o marca “No lo sé” para continuar.");
      return;
    }
    setError(null);
    if (current < total - 1) setCurrent(current + 1);
    else setStage("review");
  };

  const goBack = () => {
    setError(null);
    if (current > 0) setCurrent(current - 1);
  };

  // Atajos de teclado: el listener se registra una vez y siempre usa el handler más reciente
  const keyHandler = useRef<(event: KeyboardEvent) => void>(() => {});
  useEffect(() => {
    keyHandler.current = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      // Enter sobre un botón enfocado: que actúe el propio botón
      if (event.key === "Enter" && (event.target as HTMLElement | null)?.closest("button")) return;
      const options = questions[current].options.length;
      const digit = Number(event.key);
      const letter = LETTERS.indexOf(event.key.toUpperCase());
      if (digit >= 1 && digit <= options) choose(digit - 1);
      else if (letter >= 0 && letter < options) choose(letter);
      else if (event.key === "Enter" || event.key === "ArrowRight") goNext();
      else if (event.key === "ArrowLeft") goBack();
      else return;
      event.preventDefault();
    };
  });

  useEffect(() => {
    if (stage !== "question") return;
    const onKey = (event: KeyboardEvent) => keyHandler.current(event);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const payload = answerList.map((answer) => (answer >= 0 ? answer : UNANSWERED));
    const result = await submitLevelTest(language, payload);
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch {
      // nada que limpiar
    }
    router.replace("/dashboard?test_enviado=1");
    router.refresh();
  };

  // ── Intro ──────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <Card className="mx-auto max-w-2xl p-8 text-center sm:p-12 animate-fade-up">
        <Flag language={language} className="mx-auto size-16" />
        <p className="mt-6 text-xs font-bold tracking-[0.2em] text-secondary uppercase">Test de nivel</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">{language}</h1>
        <p className="mx-auto mt-4 max-w-md text-neutral-500">
          {total} preguntas tipo test, sin límite de tiempo. Responde sin traductores; si no sabes una respuesta, marca
          “No lo sé”.
        </p>
        <ul className="mx-auto mt-8 max-w-sm space-y-2 text-left text-sm text-neutral-600">
          <li className="flex gap-2">
            <Check size={18} className="shrink-0 text-success" aria-hidden="true" />
            Tu progreso se guarda en este dispositivo.
          </li>
          <li className="flex gap-2">
            <Check size={18} className="shrink-0 text-success" aria-hidden="true" />
            Puedes usar el teclado: 1–{Math.min(6, Math.max(...questions.map((q) => q.options.length)))} para elegir, Enter para avanzar.
          </li>
          <li className="flex gap-2">
            <Check size={18} className="shrink-0 text-success" aria-hidden="true" />
            Un profesor revisará tus respuestas y te comunicará tu nivel.
          </li>
        </ul>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/dashboard/level-test" variant="outline" size="lg">
            Cambiar idioma
          </ButtonLink>
          <Button
            size="lg"
            variant="secondary"
            disabled={!hydrated}
            onClick={() => {
              // Retoma en la primera pregunta pendiente
              const firstOpen = answerList.indexOf(UNANSWERED);
              setAnswers(answerList);
              setCurrent(firstOpen === -1 ? total - 1 : firstOpen);
              setStage("question");
            }}
          >
            {startedBefore ? `Continuar (${answeredCount}/${total})` : "Empezar test"}
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </Card>
    );
  }

  // ── Revisión ───────────────────────────────────────────
  if (stage === "review") {
    const skipped = total - answeredCount;
    return (
      <Card className="mx-auto max-w-2xl p-8 sm:p-10 animate-fade-up">
        <h1 className="text-2xl font-black tracking-tight text-neutral-900">Revisa antes de enviar</h1>
        <p className="mt-2 text-neutral-500">
          Has respondido {answeredCount} de {total} preguntas
          {skipped > 0 ? ` (${skipped} marcadas como “No lo sé”)` : ""}. Pulsa un número para volver a esa pregunta.
        </p>
        <div className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-10">
          {answerList.map((answer, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setCurrent(index);
                setStage("question");
              }}
              className={cn(
                "grid aspect-square place-items-center rounded-xl text-sm font-bold transition hover:scale-105",
                answer >= 0 ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400"
              )}
              aria-label={`Pregunta ${index + 1}${answer >= 0 ? ", respondida" : ", sin responder"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        {error && <Alert tone="error" className="mt-6">{error}</Alert>}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-neutral-100 pt-6 sm:flex-row sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              setCurrent(total - 1);
              setStage("question");
            }}
            disabled={submitting}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Volver
          </Button>
          <Button variant="secondary" size="lg" onClick={handleSubmit} isLoading={submitting} loadingText="Enviando…">
            <Send size={18} aria-hidden="true" />
            Enviar test
          </Button>
        </div>
      </Card>
    );
  }

  // ── Pregunta ───────────────────────────────────────────
  const question = questions[current];
  const selected = answerList[current];
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4 text-sm font-bold text-neutral-500">
        <span className="flex items-center gap-2">
          <Flag language={language} className="size-6 ring-1" />
          Pregunta {current + 1} de {total}
        </span>
        <span>{answeredCount} respondidas</span>
      </div>
      <div
        className="mb-8 h-2 overflow-hidden rounded-full bg-neutral-200/70"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current + 1}
        aria-label="Progreso del test"
      >
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <Card key={current} className="p-6 sm:p-10 animate-fade-up">
        <h1 className="text-2xl leading-snug font-black tracking-tight text-neutral-900 sm:text-3xl">{question.q}</h1>

        <div role="radiogroup" aria-label="Opciones de respuesta" className="mt-8 space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selected === index;
            return (
              <button
                key={index}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => choose(index)}
                className={cn(
                  "group flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left text-base font-semibold transition duration-200 sm:text-lg",
                  isSelected
                    ? "border-primary bg-primary-50 text-primary shadow-[0_0_0_4px_rgb(36_59_120/0.08)]"
                    : "border-neutral-200 text-neutral-700 hover:border-primary/40 hover:bg-neutral-50"
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl text-sm font-black transition",
                    isSelected ? "bg-primary text-white" : "bg-neutral-100 text-neutral-500 group-hover:bg-primary/10"
                  )}
                >
                  {LETTERS[index]}
                </span>
                <span className="flex-1">{option}</span>
                {isSelected && <Check size={20} strokeWidth={3} aria-hidden="true" />}
              </button>
            );
          })}

          <button
            type="button"
            role="radio"
            aria-checked={selected === SKIPPED}
            onClick={() => choose(SKIPPED)}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-3 text-sm font-bold transition",
              selected === SKIPPED
                ? "border-neutral-400 bg-neutral-100 text-neutral-700"
                : "border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600"
            )}
          >
            <HelpCircle size={16} aria-hidden="true" />
            No lo sé
          </button>
        </div>

        {error && <Alert tone="warning" className="mt-6">{error}</Alert>}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-neutral-100 pt-6">
          <Button variant="ghost" onClick={goBack} disabled={current === 0}>
            <ArrowLeft size={16} aria-hidden="true" />
            Atrás
          </Button>
          <Button size="lg" onClick={goNext}>
            {current === total - 1 ? "Revisar y enviar" : "Siguiente"}
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
