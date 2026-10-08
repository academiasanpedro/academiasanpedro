"use client";

// Editor de textos legales (HTML básico) con vista previa. Vacío = texto por defecto.

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Eye, PenLine, Save } from "lucide-react";
import { updateLegalPage } from "@/app/actions/legal";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface EditableLegalPage {
  slug: string;
  title: string;
  content: string;
}

export default function LegalEditor({ pages }: { pages: EditableLegalPage[] }) {
  const [activeSlug, setActiveSlug] = useState(pages[0]?.slug);
  const [saved, setSaved] = useState<Record<string, string>>(() =>
    Object.fromEntries(pages.map((page) => [page.slug, page.content]))
  );
  const [drafts, setDrafts] = useState<Record<string, string>>(saved);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const active = pages.find((page) => page.slug === activeSlug) ?? pages[0];
  const draft = drafts[active.slug] ?? "";
  const dirty = draft !== (saved[active.slug] ?? "");

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    const result = await updateLegalPage(active.slug, draft);
    setSaving(false);
    if (result.ok) {
      setSaved((current) => ({ ...current, [active.slug]: draft }));
      setFeedback({ ok: true, text: result.message ?? "Guardado." });
    } else {
      setFeedback({ ok: false, text: result.error });
    }
  };

  return (
    <Card className="overflow-hidden">
      <div role="tablist" aria-label="Páginas legales" className="flex overflow-x-auto border-b border-neutral-100">
        {pages.map((page) => {
          const pageDirty = (drafts[page.slug] ?? "") !== (saved[page.slug] ?? "");
          return (
            <button
              key={page.slug}
              type="button"
              role="tab"
              aria-selected={page.slug === active.slug}
              onClick={() => {
                setActiveSlug(page.slug);
                setFeedback(null);
              }}
              className={cn(
                "flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition",
                page.slug === active.slug ? "border-primary text-primary" : "border-transparent text-neutral-500 hover:text-neutral-800"
              )}
            >
              {page.title}
              {pageDirty && <span className="size-2 rounded-full bg-warning" aria-label="cambios sin guardar" />}
            </button>
          );
        })}
      </div>

      <div className="space-y-5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {(saved[active.slug] ?? "").trim() ? (
              <Badge tone="primary">Texto personalizado</Badge>
            ) : (
              <Badge tone="neutral">Usando texto por defecto</Badge>
            )}
            {dirty && <Badge tone="warning">Sin guardar</Badge>}
            <Link href={`/legal/${active.slug}`} target="_blank" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
              Ver publicada <ExternalLink size={12} aria-hidden="true" />
            </Link>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPreview((value) => !value)}>
              {preview ? <PenLine size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
              {preview ? "Editar" : "Vista previa"}
            </Button>
            <Button size="sm" onClick={handleSave} isLoading={saving} loadingText="Guardando…" disabled={!dirty}>
              <Save size={14} aria-hidden="true" />
              Guardar
            </Button>
          </div>
        </div>

        {feedback && <Alert tone={feedback.ok ? "success" : "error"}>{feedback.text}</Alert>}

        {preview ? (
          <div className="min-h-[420px] rounded-2xl border border-neutral-200 p-6">
            {draft.trim() ? (
              <div className="legal-content" dangerouslySetInnerHTML={{ __html: draft }} />
            ) : (
              <p className="text-sm text-neutral-500 italic">Vacío: en la web se mostrará el texto por defecto.</p>
            )}
          </div>
        ) : (
          <>
            <label htmlFor="legal-html" className="sr-only">
              Contenido HTML de {active.title}
            </label>
            <textarea
              id="legal-html"
              value={draft}
              onChange={(event) => setDrafts((current) => ({ ...current, [active.slug]: event.target.value }))}
              spellCheck
              className="h-[480px] w-full resize-y rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 font-mono text-sm leading-relaxed text-neutral-700 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
              placeholder={"<h2>1. Datos identificativos</h2>\n<p>Texto…</p>\n<ul><li>Elemento</li></ul>"}
            />
            <p className="text-xs text-neutral-500">
              Admite HTML básico: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;/&lt;li&gt;, &lt;a href&gt;. Déjalo vacío
              para usar el texto por defecto (incluye los datos de contacto de la academia).
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
