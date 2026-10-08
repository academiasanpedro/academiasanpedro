// Panel del alumno — Ruta: /dashboard
// Ref: AcademiaSanPedro/03_Flows.md → Dashboard

import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  ClipboardList,
  Clock3,
  GraduationCap,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  Target,
} from "lucide-react";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Flag from "@/components/ui/Flag";
import { requireUser } from "@/lib/auth";
import { cefrLabel, CONTACT } from "@/lib/constants";
import { parseTestData } from "@/lib/level-test";
import { createClient } from "@/lib/supabase/server";
import type { TestStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Mi panel" };

interface TestRow {
  id: string;
  language: string;
  status: TestStatus;
  assigned_level: string | null;
  completed_at: string;
}

interface QuestionnaireRow {
  target_language: string;
  current_level: string | null;
  preferred_schedule: string | null;
}

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const { user, displayName } = await requireUser();
  const params = await searchParams;
  const supabase = await createClient();

  const [{ data: questionnaires }, { data: tests }, { data: testRow }] = await Promise.all([
    supabase
      .from("leads_questionnaire")
      .select("target_language, current_level, preferred_schedule")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("level_tests")
      .select("id, language, status, assigned_level, completed_at")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false }),
    supabase.from("global_test").select("test_data").eq("id", 1).maybeSingle(),
  ]);

  const questionnaire = (questionnaires?.[0] ?? null) as QuestionnaireRow | null;
  const testList = (tests ?? []) as TestRow[];
  const availableLanguages = Object.entries(parseTestData(testRow?.test_data))
    .filter(([, questions]) => questions.length > 0)
    .map(([language]) => language);
  const pendingLanguages = availableLanguages.filter((language) => !testList.some((test) => test.language === language));

  const hasQuestionnaire = Boolean(questionnaire);
  const hasTest = testList.length > 0;
  const evaluated = testList.find((test) => test.status === "evaluated");
  const firstName = displayName.split(" ")[0];

  const steps = [
    { label: "Cuenta creada", done: true },
    { label: "Cuestionario", done: hasQuestionnaire },
    { label: "Test de nivel", done: hasTest },
    { label: "Evaluación", done: Boolean(evaluated) },
  ];
  const completed = steps.filter((step) => step.done).length;

  return (
    <div className="space-y-8">
      {params.test_enviado && (
        <Alert tone="success" title="¡Test enviado!">
          Hemos recibido tus respuestas. Nuestros profesores evaluarán tu nivel y te contactaremos por email o teléfono con
          los resultados y las recomendaciones de clases.
        </Alert>
      )}
      {params.password_updated && <Alert tone="success">Tu contraseña se ha actualizado correctamente.</Alert>}

      <section className="animate-fade-up">
        <p className="text-sm font-bold text-secondary">Área de alumnos</p>
        <h1 className="mt-1 text-4xl font-black tracking-tight text-balance text-neutral-900 sm:text-5xl">
          ¡Hola, {firstName}! 👋
        </h1>
        <p className="mt-3 text-lg font-medium text-neutral-500">
          {completed === steps.length
            ? "Has completado todo el proceso. Te contactaremos muy pronto."
            : `Llevas ${completed} de ${steps.length} pasos. Te quedan pocos minutos.`}
        </p>
      </section>

      {/* Progreso */}
      <Card className="p-6 sm:p-8">
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-neutral-100" aria-hidden="true">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-700"
            style={{ width: `${(completed / steps.length) * 100}%` }}
          />
        </div>
        <ol className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.label} className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-xl text-sm font-black",
                  step.done ? "bg-success text-white" : "bg-neutral-100 text-neutral-400"
                )}
              >
                {step.done ? <Check size={16} strokeWidth={3} aria-hidden="true" /> : index + 1}
              </span>
              <span className={cn("text-sm font-bold", step.done ? "text-neutral-900" : "text-neutral-400")}>
                {step.label}
                <span className="sr-only">{step.done ? " (completado)" : " (pendiente)"}</span>
              </span>
            </li>
          ))}
        </ol>
      </Card>

      {/* Siguiente paso */}
      <NextStep hasQuestionnaire={hasQuestionnaire} hasTest={hasTest} evaluated={evaluated} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cuestionario */}
        <Card className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="grid size-12 place-items-center rounded-2xl bg-primary-50 text-primary">
              <ClipboardList size={22} aria-hidden="true" />
            </div>
            {hasQuestionnaire ? <Badge tone="success">Completado</Badge> : <Badge tone="secondary">Pendiente</Badge>}
          </div>
          <h2 className="mt-5 text-xl font-black tracking-tight text-neutral-900">Cuestionario inicial</h2>
          {questionnaire ? (
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              {[
                ["Idioma", questionnaire.target_language],
                ["Nivel estimado", questionnaire.current_level],
                ["Horario", questionnaire.preferred_schedule],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-neutral-50 p-3">
                  <dt className="text-xs font-semibold text-neutral-400">{label}</dt>
                  <dd className="mt-1 font-bold text-neutral-800">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                Cuéntanos tu idioma, nivel estimado y disponibilidad para proponerte el grupo ideal.
              </p>
              <ButtonLink href="/dashboard/questionnaire" className="mt-6">
                Completar cuestionario
                <ArrowRight size={16} aria-hidden="true" />
              </ButtonLink>
            </>
          )}
        </Card>

        {/* Tests */}
        <Card className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="grid size-12 place-items-center rounded-2xl bg-secondary/10 text-secondary">
              <Target size={22} aria-hidden="true" />
            </div>
            {hasTest && <Badge tone="primary">{testList.length} enviado{testList.length > 1 ? "s" : ""}</Badge>}
          </div>
          <h2 className="mt-5 text-xl font-black tracking-tight text-neutral-900">Tests de nivel</h2>

          {hasTest ? (
            <ul className="mt-4 space-y-3">
              {testList.map((test) => (
                <li key={test.id} className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-3">
                  <Flag language={test.language} className="size-9" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-neutral-900">{test.language}</p>
                    <p className="text-xs text-neutral-500">Enviado el {formatDate(test.completed_at)}</p>
                  </div>
                  {test.status === "evaluated" ? (
                    <Badge tone="success">{cefrLabel(test.assigned_level)}</Badge>
                  ) : (
                    <Badge tone="warning">
                      <Clock3 size={12} aria-hidden="true" />
                      En revisión
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Preguntas tipo test, sin límite de tiempo. Un profesor revisará tus respuestas y te asignará un nivel oficial
              (A1–C2).
            </p>
          )}

          {pendingLanguages.length > 0 && (
            <ButtonLink href="/dashboard/level-test" variant={hasTest ? "outline" : "primary"} className="mt-6">
              {hasTest ? "Hacer test de otro idioma" : "Empezar test de nivel"}
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          )}
        </Card>
      </div>

      {/* Contacto */}
      <Card variant="muted" className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-lg font-black text-neutral-900">¿Tienes dudas?</h2>
          <p className="mt-1 text-sm text-neutral-500">Estamos en {CONTACT.address}, Huelva. Secretaría: {CONTACT.hours.toLowerCase()}.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-neutral-700 shadow-sm ring-1 ring-neutral-200 transition hover:text-primary">
            <Phone size={16} aria-hidden="true" />
            {CONTACT.phone}
          </a>
          <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-neutral-700 shadow-sm ring-1 ring-neutral-200 transition hover:text-primary">
            <MessageCircle size={16} aria-hidden="true" />
            WhatsApp
          </a>
          <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-neutral-700 shadow-sm ring-1 ring-neutral-200 transition hover:text-primary">
            <Mail size={16} aria-hidden="true" />
            Email
          </a>
        </div>
      </Card>
    </div>
  );
}

function NextStep({
  hasQuestionnaire,
  hasTest,
  evaluated,
}: {
  hasQuestionnaire: boolean;
  hasTest: boolean;
  evaluated?: TestRow;
}) {
  const content = !hasQuestionnaire
    ? {
        icon: ClipboardList,
        eyebrow: "Siguiente paso · 1 minuto",
        title: "Cuéntanos qué idioma quieres aprender",
        text: "Con 4 preguntas sabremos tu objetivo y disponibilidad horaria.",
        cta: { href: "/dashboard/questionnaire", label: "Empezar cuestionario" },
      }
    : !hasTest
      ? {
          icon: Target,
          eyebrow: "Siguiente paso · sin límite de tiempo",
          title: "Haz tu test de nivel online",
          text: "Responde con calma y sin traductores: así podremos ubicarte en el grupo adecuado.",
          cta: { href: "/dashboard/level-test", label: "Empezar test" },
        }
      : evaluated
        ? {
            icon: GraduationCap,
            eyebrow: "Resultado disponible",
            title: `Tu nivel de ${evaluated.language}: ${cefrLabel(evaluated.assigned_level)}`,
            text: "Te contactaremos para recomendarte el grupo y horario que mejor encajan contigo.",
            cta: null,
          }
        : {
            icon: Sparkles,
            eyebrow: "En revisión",
            title: "Nuestros profesores están revisando tu test",
            text: "Te enviaremos el resultado por email y te llamaremos para recomendarte grupo. Normalmente en pocos días.",
            cta: null,
          };

  const Icon = content.icon;
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary-950 p-8 text-white shadow-lift sm:p-10">
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-secondary/30 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-32 left-10 size-72 rounded-full bg-primary/60 blur-[90px]" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-5">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <Icon size={26} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-secondary-light uppercase">{content.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{content.title}</h2>
            <p className="mt-2 max-w-xl text-white/70">{content.text}</p>
          </div>
        </div>
        {content.cta && (
          <ButtonLink href={content.cta.href} variant="secondary" size="lg" className="sm:shrink-0">
            {content.cta.label}
            <ArrowRight size={18} aria-hidden="true" />
          </ButtonLink>
        )}
      </div>
    </section>
  );
}
