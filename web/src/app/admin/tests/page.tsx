// Gestión de tests de nivel — Ruta: /admin/tests (?tab=builder)

import type { Metadata } from "next";
import TestsManager from "@/components/admin/TestsManager";
import type { AdminTest } from "@/components/admin/TestEvaluator";
import PageHeader from "@/components/ui/PageHeader";
import { gradeAnswers, parseTestData } from "@/lib/level-test";
import { createClient } from "@/lib/supabase/server";
import type { TestStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Tests de nivel" };

interface TestRow {
  id: string;
  language: string;
  score: number | null;
  max_score: number | null;
  answers: unknown;
  assigned_level: string | null;
  status: TestStatus;
  completed_at: string;
  profiles: { full_name: string | null; email: string; phone: string | null } | { full_name: string | null; email: string; phone: string | null }[] | null;
}

export default async function AdminTestsPage({ searchParams }: PageProps<"/admin/tests">) {
  const { tab } = await searchParams;
  const supabase = await createClient();

  const [{ data: rows }, { data: testRow }] = await Promise.all([
    supabase
      .from("level_tests")
      .select("id, language, score, max_score, answers, assigned_level, status, completed_at, profiles(full_name, email, phone)")
      .order("completed_at", { ascending: false })
      .limit(300),
    supabase.from("global_test").select("test_data").eq("id", 1).maybeSingle(),
  ]);

  const testData = parseTestData(testRow?.test_data);

  const tests: AdminTest[] = ((rows ?? []) as TestRow[]).map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const answers = Array.isArray(row.answers) ? (row.answers as number[]) : [];
    const questions = testData[row.language] ?? [];
    // Se recalcula con el test maestro para no fiarse de la puntuación almacenada
    const comparable = questions.length > 0 && answers.length === questions.length;
    return {
      id: row.id,
      student: profile?.full_name || "Sin nombre",
      email: profile?.email ?? "",
      phone: profile?.phone ?? null,
      language: row.language,
      completedAt: row.completed_at,
      status: row.status,
      assignedLevel: row.assigned_level,
      answers,
      score: comparable ? gradeAnswers(questions, answers) : row.score ?? 0,
      maxScore: comparable ? questions.length : row.max_score ?? answers.length,
      outdated: !comparable,
    };
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tests de nivel"
        description="Evalúa a los alumnos y gestiona las preguntas del test online de cada idioma."
      />
      <TestsManager tests={tests} testData={testData} initialTab={tab === "builder" ? "builder" : "evaluator"} />
    </div>
  );
}
