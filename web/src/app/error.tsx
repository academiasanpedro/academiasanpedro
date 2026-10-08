"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import Button, { ButtonLink } from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="contenido" className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-error/10 text-error">
        <RefreshCcw size={28} aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-3xl font-black tracking-tight text-neutral-900">Algo no ha ido bien</h1>
      <p className="mt-3 max-w-md text-neutral-500">
        Ha ocurrido un error inesperado. Vuelve a intentarlo; si persiste, contacta con la academia.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>
          Reintentar
        </Button>
        <ButtonLink href="/" variant="outline" size="lg">
          Ir al inicio
        </ButtonLink>
      </div>
      {error.digest && <p className="mt-6 text-xs text-neutral-400">Código: {error.digest}</p>}
    </main>
  );
}
