"use client";

// Lista de tests recibidos con filtros, búsqueda y modal de evaluación

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, Inbox, Search, XCircle } from "lucide-react";
import { evaluateLevelTest } from "@/app/actions/level-test";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Flag from "@/components/ui/Flag";
import { CheckboxField, SelectField, TextareaField } from "@/components/ui/Form";
import Modal from "@/components/ui/Modal";
import { CEFR_LEVELS, cefrLabel } from "@/lib/constants";
import type { LevelTestData } from "@/lib/level-test";
import type { TestStatus } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

export interface AdminTest {
  id: string;
  student: string;
  email: string;
  phone: string | null;
  language: string;
  completedAt: string;
  status: TestStatus;
  assignedLevel: string | null;
  answers: number[];
  score: number;
  maxScore: number;
  outdated: boolean;
}

type Filter = "pending_review" | "evaluated" | "all";

function scoreTone(ratio: number) {
  if (ratio >= 0.75) return "bg-success";
  if (ratio >= 0.5) return "bg-warning";
  return "bg-error";
}

export default function TestEvaluator({ tests, testData }: { tests: AdminTest[]; testData: LevelTestData }) {
  const [filter, setFilter] = useState<Filter>("pending_review");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AdminTest | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tests.filter(
      (test) =>
        (filter === "all" || test.status === filter) &&
        (!q || test.student.toLowerCase().includes(q) || test.email.toLowerCase().includes(q))
    );
  }, [tests, filter, query]);

  const counts = {
    pending_review: tests.filter((test) => test.status === "pending_review").length,
    evaluated: tests.filter((test) => test.status === "evaluated").length,
    all: tests.length,
  };

  const filters: { id: Filter; label: string }[] = [
    { id: "pending_review", label: "Pendientes" },
    { id: "evaluated", label: "Evaluados" },
    { id: "all", label: "Todos" },
  ];

  return (
    <div className="space-y-4">
      {flash && <Alert tone="success">{flash}</Alert>}

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-neutral-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1">
            {filters.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                aria-pressed={filter === id}
                className={cn(
                  "rounded-xl px-3.5 py-2 text-sm font-bold transition",
                  filter === id ? "bg-primary text-white" : "text-neutral-500 hover:bg-neutral-100"
                )}
              >
                {label} <span className="opacity-60">{counts[id]}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar alumno…"
              aria-label="Buscar alumno"
              className="h-10 w-full rounded-xl border border-neutral-200 pr-3 pl-10 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={filter === "pending_review" && !query ? "No hay tests pendientes" : "Sin resultados"}
            description={filter === "pending_review" && !query ? "¡Buen trabajo! Has evaluado todos los tests recibidos." : "Prueba con otro filtro o búsqueda."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-100 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3">Alumno</th>
                  <th scope="col" className="px-5 py-3">Idioma</th>
                  <th scope="col" className="hidden px-5 py-3 md:table-cell">Recibido</th>
                  <th scope="col" className="px-5 py-3">Aciertos</th>
                  <th scope="col" className="px-5 py-3">Estado</th>
                  <th scope="col" className="px-5 py-3 text-right"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {visible.map((test) => {
                  const ratio = test.maxScore ? test.score / test.maxScore : 0;
                  return (
                    <tr key={test.id} className="transition hover:bg-neutral-50">
                      <td className="px-5 py-4">
                        <p className="font-bold text-neutral-900">{test.student}</p>
                        <p className="text-xs text-neutral-500">{test.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 font-semibold text-neutral-700">
                          <Flag language={test.language} className="size-6 ring-1" />
                          {test.language}
                        </span>
                      </td>
                      <td className="hidden px-5 py-4 whitespace-nowrap text-neutral-500 md:table-cell">{formatDateTime(test.completedAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-100">
                            <div className={cn("h-full", scoreTone(ratio))} style={{ width: `${ratio * 100}%` }} />
                          </div>
                          <span className="font-bold whitespace-nowrap text-neutral-900">
                            {test.score}/{test.maxScore}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {test.status === "evaluated" ? (
                          <Badge tone="success">{test.assignedLevel ?? "Evaluado"}</Badge>
                        ) : (
                          <Badge tone="warning">Pendiente</Badge>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          size="sm"
                          variant={test.status === "pending_review" ? "primary" : "outline"}
                          onClick={() => {
                            setFlash(null);
                            setSelected(test);
                          }}
                        >
                          <Eye size={15} aria-hidden="true" />
                          {test.status === "pending_review" ? "Evaluar" : "Ver"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selected && (
        <EvaluationModal
          key={selected.id}
          test={selected}
          testData={testData}
          onClose={() => setSelected(null)}
          onDone={(message) => {
            setSelected(null);
            setFlash(message);
          }}
        />
      )}
    </div>
  );
}

function EvaluationModal({
  test,
  testData,
  onClose,
  onDone,
}: {
  test: AdminTest;
  testData: LevelTestData;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const router = useRouter();
  const isPending = test.status === "pending_review";
  const [level, setLevel] = useState(test.assignedLevel ?? "");
  const [notes, setNotes] = useState("");
  const [notify, setNotify] = useState(isPending);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = testData[test.language] ?? [];

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const result = await evaluateLevelTest({ testId: test.id, level, notes, notify });
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
    onDone(result.message ?? "Evaluación guardada.");
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="xl"
      title={`Evaluación de ${test.student}`}
      description={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Flag language={test.language} className="size-5 ring-1" /> {test.language}
          </span>
          <span>· {test.score}/{test.maxScore} aciertos</span>
          {test.phone && <span>· Tel. {test.phone}</span>}
        </span>
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} isLoading={saving} loadingText="Guardando…" disabled={!level}>
            {notify ? "Guardar y enviar email" : "Guardar evaluación"}
          </Button>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h3 className="mb-4 text-sm font-bold tracking-wider text-neutral-400 uppercase">Respuestas</h3>
          {test.outdated && (
            <Alert tone="warning" className="mb-4">
              Las preguntas de {test.language} han cambiado desde que se hizo este test: el desglose puede no coincidir.
            </Alert>
          )}
          {questions.length === 0 || test.answers.length === 0 ? (
            <p className="text-sm text-neutral-500 italic">No hay desglose disponible para este test.</p>
          ) : (
            <ol className="space-y-3">
              {questions.map((question, index) => {
                const answer = test.answers[index];
                const answered = typeof answer === "number" && answer >= 0;
                const correct = answer === question.answer;
                return (
                  <li
                    key={index}
                    className={cn(
                      "rounded-2xl border p-4 text-sm",
                      correct ? "border-success/20 bg-success/5" : answered ? "border-error/20 bg-error/5" : "border-neutral-200 bg-neutral-50"
                    )}
                  >
                    <p className="font-semibold text-neutral-900">
                      {index + 1}. {question.q}
                    </p>
                    <p className={cn("mt-2 flex items-center gap-2 font-medium", correct ? "text-success" : answered ? "text-error" : "text-neutral-500")}>
                      {correct ? <CheckCircle2 size={16} aria-hidden="true" /> : <XCircle size={16} aria-hidden="true" />}
                      {answered ? question.options[answer] ?? "Opción eliminada" : "No lo sabe / sin responder"}
                    </p>
                    {!correct && <p className="mt-1 pl-6 text-xs text-neutral-500">Correcta: {question.options[question.answer]}</p>}
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section className="space-y-5 lg:sticky lg:top-0 lg:self-start">
          <h3 className="text-sm font-bold tracking-wider text-neutral-400 uppercase">Resultado</h3>
          {!isPending && (
            <Alert tone="info">Evaluado como {cefrLabel(test.assignedLevel)}. Puedes corregir el nivel si lo necesitas.</Alert>
          )}
          <SelectField label="Nivel asignado (MCER)" value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="" disabled>
              Selecciona un nivel…
            </option>
            {CEFR_LEVELS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </SelectField>
          <TextareaField
            label="Observaciones para el alumno"
            optional
            rows={5}
            maxLength={1000}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ej.: buena base gramatical; recomendamos grupo B1 de tardes."
            hint={notify ? "Se incluirán en el email." : "No se enviarán si no marcas el email."}
          />
          <CheckboxField label="Enviar el resultado al alumno por email" checked={notify} onChange={(event) => setNotify(event.target.checked)} />
          {error && <Alert tone="error">{error}</Alert>}
        </section>
      </div>
    </Modal>
  );
}
