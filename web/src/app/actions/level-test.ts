"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { getActionContext } from "@/lib/auth";
import { cefrLabel, SITE_URL } from "@/lib/constants";
import { emailLayout, escapeHtml, getAcademyInbox, sendEmail, textToHtml } from "@/lib/email";
import { gradeAnswers, parseTestData, type LevelTestQuestion } from "@/lib/level-test";
import type { ActionResult } from "@/lib/types";
import {
  evaluateLevelTestSchema,
  saveLevelTestSchema,
  submitLevelTestSchema,
} from "@/lib/validators/level-test";

/** Alumno: envía sus respuestas. La corrección se hace aquí, nunca en el navegador. */
export async function submitLevelTest(language: string, answers: number[]): Promise<ActionResult> {
  const parsed = submitLevelTestSchema.safeParse({ language, answers });
  if (!parsed.success) return { ok: false, error: "Respuestas no válidas. Recarga la página e inténtalo de nuevo." };

  const ctx = await getActionContext();
  if (!ctx) return { ok: false, error: "Tu sesión ha caducado. Vuelve a iniciar sesión para enviar el test." };
  const { supabase, user, profile } = ctx;

  const { data: existing } = await supabase
    .from("level_tests")
    .select("id")
    .eq("user_id", user.id)
    .eq("language", parsed.data.language)
    .limit(1);

  if (existing && existing.length > 0) {
    return { ok: false, error: `Ya has enviado el test de ${parsed.data.language}.` };
  }

  const { data: testRow } = await supabase
    .from("global_test")
    .select("test_data")
    .eq("id", 1)
    .maybeSingle();

  const questions = parseTestData(testRow?.test_data)[parsed.data.language] ?? [];
  if (questions.length === 0) return { ok: false, error: "Este test ya no está disponible." };
  if (parsed.data.answers.length !== questions.length) {
    return { ok: false, error: "El test se ha actualizado mientras lo hacías. Recarga la página para empezar de nuevo." };
  }

  const score = gradeAnswers(questions, parsed.data.answers);
  const { error } = await supabase.from("level_tests").insert({
    user_id: user.id,
    language: parsed.data.language,
    score,
    max_score: questions.length,
    answers: parsed.data.answers,
    status: "pending_review",
  });

  if (error) {
    console.error("[submitLevelTest]", error.message);
    return { ok: false, error: "No hemos podido guardar el test. Inténtalo de nuevo." };
  }

  // Aviso interno sin bloquear la respuesta al alumno
  const studentName = profile?.full_name || user.email || "Un alumno";
  after(async () => {
    await sendEmail({
      to: getAcademyInbox(),
      subject: `Nuevo test de ${parsed.data.language} pendiente de evaluar`,
      html: emailLayout({
        title: "Nuevo test de nivel recibido",
        body: `<p><strong>${escapeHtml(studentName)}</strong> ha completado el test de ${escapeHtml(parsed.data.language)}.</p>
          <p><a href="${SITE_URL}/admin/tests" style="color:#243b78;font-weight:bold;">Evaluar en el panel →</a></p>`,
      }),
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/tests");
  return { ok: true };
}

/** Admin: guarda las preguntas de un idioma en el test maestro. */
export async function saveLevelTest(language: string, questions: LevelTestQuestion[]): Promise<ActionResult> {
  const parsed = saveLevelTestSchema.safeParse({ language, questions });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const index = typeof issue?.path[1] === "number" ? ` (pregunta ${issue.path[1] + 1})` : "";
    return { ok: false, error: `${issue?.message ?? "Datos no válidos"}${index}.` };
  }

  const ctx = await getActionContext({ admin: true });
  if (!ctx) return { ok: false, error: "No autorizado." };
  const { supabase } = ctx;

  const { data: testRow } = await supabase
    .from("global_test")
    .select("test_data")
    .eq("id", 1)
    .maybeSingle();

  const testData = { ...parseTestData(testRow?.test_data), [parsed.data.language]: parsed.data.questions };

  const { error } = testRow
    ? await supabase.from("global_test").update({ test_data: testData }).eq("id", 1)
    : await supabase.from("global_test").insert({ id: 1, test_data: testData });

  if (error) {
    console.error("[saveLevelTest]", error.message);
    return { ok: false, error: "No se pudo guardar el test." };
  }

  revalidatePath("/admin/tests");
  revalidatePath("/dashboard/level-test");
  return { ok: true, message: `Test de ${parsed.data.language} guardado (${parsed.data.questions.length} preguntas).` };
}

/** Admin: asigna el nivel y, opcionalmente, envía el resultado al alumno. */
export async function evaluateLevelTest(input: {
  testId: string;
  level: string;
  notes: string;
  notify: boolean;
}): Promise<ActionResult> {
  const parsed = evaluateLevelTestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos." };

  const ctx = await getActionContext({ admin: true });
  if (!ctx) return { ok: false, error: "No autorizado." };
  const { supabase } = ctx;
  const { testId, level, notes, notify } = parsed.data;

  // El email del alumno se lee de la BD, nunca del cliente
  const { data: test } = await supabase
    .from("level_tests")
    .select("id, language, profiles(full_name, email)")
    .eq("id", testId)
    .maybeSingle();

  if (!test) return { ok: false, error: "Test no encontrado." };

  const { error } = await supabase
    .from("level_tests")
    .update({ status: "evaluated", assigned_level: level })
    .eq("id", testId);

  if (error) {
    console.error("[evaluateLevelTest]", error.message);
    return { ok: false, error: "No se pudo guardar la evaluación." };
  }

  revalidatePath("/admin/tests");
  revalidatePath("/admin");

  if (!notify) return { ok: true, message: "Evaluación guardada." };

  const student = (Array.isArray(test.profiles) ? test.profiles[0] : test.profiles) as
    | { full_name: string | null; email: string }
    | null;
  if (!student?.email) return { ok: true, message: "Evaluación guardada, pero el alumno no tiene email." };

  const greeting = student.full_name ? `Hola, ${escapeHtml(student.full_name)}:` : "Hola:";
  const result = await sendEmail({
    to: student.email,
    subject: "Resultado de tu test de nivel · Academia San Pedro",
    html: emailLayout({
      title: "Ya tenemos tu nivel",
      body: `<p>${greeting}</p>
        <p>Nuestro equipo docente ha revisado tu test de <strong>${escapeHtml(test.language)}</strong>.</p>
        <div style="margin:24px 0;padding:20px;border-radius:12px;background:#eef2fb;">
          <p style="margin:0;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Nivel asignado</p>
          <p style="margin:6px 0 0;font-size:26px;font-weight:bold;color:#243b78;">${escapeHtml(cefrLabel(level))}</p>
        </div>
        ${notes ? `<p><strong>Observaciones del profesor:</strong><br>${textToHtml(notes)}</p>` : ""}
        <p>Te contactaremos para recomendarte el grupo que mejor encaja contigo. Si lo prefieres, puedes llamarnos o responder a este email.</p>
        <p><a href="${SITE_URL}/dashboard" style="color:#243b78;font-weight:bold;">Ir a mi panel →</a></p>`,
    }),
  });

  if (!result.ok) return { ok: true, message: `Evaluación guardada, pero el email falló: ${result.error}` };
  return { ok: true, message: "Evaluación guardada y email enviado al alumno." };
}
