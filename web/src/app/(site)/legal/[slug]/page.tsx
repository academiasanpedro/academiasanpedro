// Páginas legales: contenido editable desde /admin/legal (tabla legal_pages)
// con texto por defecto si la fila no existe o está vacía.

import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AvisoLegal from "@/content/legal/AvisoLegal";
import Cookies from "@/content/legal/Cookies";
import Privacidad from "@/content/legal/Privacidad";
import { LEGAL_PAGES, type LegalSlug } from "@/lib/constants";
import { createPublicClient } from "@/lib/supabase/public";
import { formatDate } from "@/lib/utils";

const DEFAULT_CONTENT: Record<LegalSlug, ComponentType> = {
  "aviso-legal": AvisoLegal,
  privacidad: Privacidad,
  cookies: Cookies,
};

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return LEGAL_PAGES.map((page) => ({ slug: page.slug }));
}

async function getLegalPage(slug: LegalSlug) {
  try {
    const { data } = await createPublicClient()
      .from("legal_pages")
      .select("content, updated_at")
      .eq("slug", slug)
      .maybeSingle();
    return data as { content: string | null; updated_at: string | null } | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = LEGAL_PAGES.find((item) => item.slug === slug);
  return { title: page?.title ?? "Legal" };
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const page = LEGAL_PAGES.find((item) => item.slug === slug);
  if (!page) notFound();

  const stored = await getLegalPage(page.slug);
  const html = stored?.content?.trim();
  const Fallback = DEFAULT_CONTENT[page.slug];

  return (
    <div className="bg-neutral-50 px-5 py-16 sm:py-20">
      <article className="mx-auto max-w-3xl rounded-3xl border border-neutral-200/70 bg-white p-8 shadow-soft sm:p-12">
        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-secondary uppercase">Información legal</p>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">{page.title}</h1>
        {html && stored?.updated_at && (
          <p className="mt-2 text-sm text-neutral-400">Última actualización: {formatDate(stored.updated_at)}</p>
        )}
        <div className="legal-content mt-8">
          {/* HTML redactado por administradores autenticados desde /admin/legal */}
          {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <Fallback />}
        </div>
      </article>
    </div>
  );
}
