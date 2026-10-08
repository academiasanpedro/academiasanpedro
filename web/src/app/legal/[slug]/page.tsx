import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import GlobalHeader from "@/components/layout/GlobalHeader";
import Footer from "@/components/landing/Footer";

import { connection } from "next/server";
import { Suspense } from "react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("legal_pages")
    .select("title")
    .eq("slug", slug)
    .single();

  if (!data) {
    return { title: "Aviso Legal | Academia San Pedro" };
  }

  return { title: `${data.title} | Academia San Pedro` };
}

export const dynamic = "force-dynamic";

export default function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <>
      <GlobalHeader />
      <main className="min-h-screen bg-neutral-50/50 pt-24 pb-20">
        <Suspense fallback={<div className="max-w-3xl mx-auto px-6 py-12 text-center text-neutral-500 font-bold">Cargando...</div>}>
          <LegalPageContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

async function LegalPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: page, error } = await supabase
    .from("legal_pages")
    .select("title, content")
    .eq("slug", slug)
    .single();

  if (error || !page) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-neutral-200/40 border border-neutral-100">
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight mb-8">
              {page.title}
            </h1>
            
            {/* The content will be rendered as basic HTML or mapped. For simplicity we assume it's text with some basic formatting or just newline separated paragraphs for now. We can use white-space: pre-wrap */}
            <div className="prose prose-neutral max-w-none">
              <div 
                className="whitespace-pre-wrap text-neutral-700 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: page.content }} 
              />
            </div>
        </div>
      </div>
  );
}
