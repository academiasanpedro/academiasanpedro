// Página tras el registro cuando Supabase exige confirmar el email — Ruta: /auth/verify-email?email=

import type { Metadata } from "next";
import { ArrowRight, MailCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Verifica tu email",
  robots: { index: false },
};

export default async function VerifyEmailPage({ searchParams }: PageProps<"/auth/verify-email">) {
  const { email } = await searchParams;
  const address = typeof email === "string" && email ? email : null;

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 grid size-20 place-items-center rounded-3xl bg-primary-50 text-primary animate-scale-in">
        <MailCheck size={38} aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-black tracking-tight text-neutral-900">Revisa tu correo</h1>
      <p className="mx-auto mt-4 max-w-sm text-base font-medium text-neutral-500">
        Hemos enviado un enlace de confirmación a{" "}
        {address ? <strong className="break-all text-neutral-900">{address}</strong> : "tu email"}. Ábrelo para activar tu
        cuenta y continuar con el cuestionario.
      </p>

      <ol className="mx-auto mt-8 max-w-sm space-y-3 rounded-3xl bg-neutral-50 p-6 text-left text-sm text-neutral-600">
        <li>
          <strong className="text-neutral-900">1.</strong> Abre el email de “Academia San Pedro”.
        </li>
        <li>
          <strong className="text-neutral-900">2.</strong> Pulsa el enlace desde este mismo navegador.
        </li>
        <li>
          <strong className="text-neutral-900">3.</strong> ¿No llega? Revisa spam o promociones.
        </li>
      </ol>

      <ButtonLink href="/auth/login" variant="outline" className="mt-8">
        Ya lo he confirmado, iniciar sesión
        <ArrowRight size={16} aria-hidden="true" />
      </ButtonLink>
    </div>
  );
}
