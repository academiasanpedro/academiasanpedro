// Test de nivel — Ruta: /dashboard/level-test (?lang=Idioma)
// Las respuestas correctas nunca salen del servidor: solo se envían enunciados y opciones.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, ListChecks, ShieldCheck } from "lucide-react";
import LevelTestRunner from "@/components/dashboard/LevelTestRunner";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Flag from "@/components/ui/Flag";
import PageHeader from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth";
import { LANGUAGES } from "@/lib/constants";
import { parseTestData, toPublicQuestions } from "@/lib/level-test";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Test de nivel" };

export default async function LevelTestPage({ searchParams }: PageProps<"/dashboard/level-test">) {
  const { user } = await requireUser();
  const { lang } = await searchParams;
  const supabase = await createClient();

  const [{ data: testRow }, { data: done }] = await Promise.all([
    supabase.from("global_test").select("test_data").eq("id", 1).maybeSingle(),
    supabase.from("level_tests").select("language").eq("user_id", user.id),
  ]);

  const testData = parseTestData(testRow?.test_data);
  const doneLanguages = new Set((done ?? []).map((row) => row.language as string));
  const languages = LANGUAGES.map((language) => ({
    language,
    count: testData[language]?.length ?? 0,
    done: doneLanguages.has(language),
  }));

  const selected = typeof lang === "string" ? languages.find((item) => item.language === lang) : undefined;

  if (selected && selected.count > 0 && !selected.done) {
    return (
      <LevelTestRunner
        key={selected.language}
        language={selected.language}
        questions={toPublicQuestions(testData[selected.language])}
      />
    );
  }

  const available = languages.filter((item) => item.count > 0);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        eyebrow="Paso 3 de 4"
        title="Test de nivel online"
        description="Elige el idioma que quieres evaluar. Un profesor revisará tus respuestas y te asignará un nivel."
      />

      {selected?.done && <Alert tone="info">Ya enviaste el test de {selected.language}. Puedes ver su estado en tu panel.</Alert>}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Clock3, title: "Sin límite de tiempo", text: "Hazlo con calma; tu progreso se guarda." },
          { icon: ListChecks, title: "Tipo test", text: "Si no sabes una respuesta, marca “No lo sé”." },
          { icon: ShieldCheck, title: "Sin traductores", text: "Así podremos ubicarte en el grupo correcto." },
        ].map(({ icon: Icon, title, text }) => (
          <Card key={title} variant="muted" className="p-5">
            <Icon size={20} className="text-primary" aria-hidden="true" />
            <p className="mt-3 font-bold text-neutral-900">{title}</p>
            <p className="mt-1 text-sm text-neutral-500">{text}</p>
          </Card>
        ))}
      </div>

      {available.length === 0 ? (
        <Card>
          <EmptyState
            icon={ListChecks}
            title="El test todavía no está disponible"
            description="Estamos preparando las preguntas. Mientras tanto, puedes llamarnos y te hacemos la prueba en la academia."
            action={<ButtonLink href="/dashboard" variant="outline">Volver al panel</ButtonLink>}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {available.map(({ language, count, done: isDone }) =>
            isDone ? (
              <div
                key={language}
                className="flex items-center gap-4 rounded-3xl border border-neutral-200/70 bg-white/60 p-5 opacity-70"
              >
                <Flag language={language} className="size-12" />
                <div className="flex-1">
                  <p className="text-lg font-black text-neutral-900">{language}</p>
                  <p className="text-sm text-neutral-500">Ya enviado</p>
                </div>
                <CheckCircle2 className="text-success" aria-hidden="true" />
              </div>
            ) : (
              <Link
                key={language}
                href={`/dashboard/level-test?lang=${encodeURIComponent(language)}`}
                className="group flex items-center gap-4 rounded-3xl border border-neutral-200/70 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"
              >
                <Flag language={language} className="size-12 transition group-hover:scale-110" />
                <div className="flex-1">
                  <p className="text-lg font-black text-neutral-900">{language}</p>
                  <Badge tone="primary" className="mt-1">
                    {count} preguntas
                  </Badge>
                </div>
                <ArrowRight className="text-neutral-300 transition group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
