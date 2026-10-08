import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main id="contenido" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-50 px-6 text-center">
      <div className="pointer-events-none absolute top-1/4 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="relative animate-fade-up">
        <Logo className="mx-auto w-fit" />
        <p className="mt-12 text-8xl font-black tracking-tighter text-primary/15 sm:text-9xl">404</p>
        <h1 className="-mt-6 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">Esta página no existe</h1>
        <p className="mx-auto mt-4 max-w-md text-neutral-500">
          Puede que el enlace esté mal escrito o que la página se haya movido.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            <ArrowLeft size={18} aria-hidden="true" />
            Volver al inicio
          </ButtonLink>
          <ButtonLink href="/dashboard" variant="outline" size="lg">
            <Compass size={18} aria-hidden="true" />
            Ir a mi panel
          </ButtonLink>
        </div>
        <p className="mt-10 text-sm text-neutral-400">
          ¿Necesitas ayuda?{" "}
          <Link href="/#contacto" className="font-semibold text-primary hover:underline">
            Contacta con nosotros
          </Link>
        </p>
      </div>
    </main>
  );
}
