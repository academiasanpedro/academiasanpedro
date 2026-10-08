// Layout para páginas legales
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-5 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          Volver a inicio
        </Link>
        <main className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-neutral-200">
          <div className="text-neutral-700 leading-relaxed space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
