import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Logotipo + nombre. En fondos oscuros el icono va sobre una pastilla blanca para conservar sus colores. */
export default function Logo({
  tone = "light",
  href = "/",
  showText = true,
  subtitle = "Idiomas",
  className,
  priority,
}: {
  tone?: "light" | "dark";
  href?: string | null;
  showText?: boolean;
  subtitle?: string;
  className?: string;
  priority?: boolean;
}) {
  const dark = tone === "dark";
  const content = (
    <>
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-2xl",
          dark ? "bg-white shadow-lg shadow-black/20" : "bg-white ring-1 ring-neutral-200/80 shadow-sm"
        )}
      >
        <Image src="/assets/logo.png" alt="" width={32} height={32} priority={priority} className="size-8 object-contain" />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className={cn("text-[17px] font-black tracking-tight", dark ? "text-white" : "text-primary-dark")}>
            San Pedro
          </span>
          <span className={cn("mt-1 text-[11px] font-bold tracking-[0.2em] uppercase", dark ? "text-white/60" : "text-secondary")}>
            {subtitle}
          </span>
        </span>
      )}
    </>
  );

  if (!href) return <span className={cn("flex items-center gap-3", className)}>{content}</span>;

  return (
    <Link href={href} className={cn("flex items-center gap-3 rounded-xl", className)} aria-label="Academia de Idiomas San Pedro — Inicio">
      {content}
    </Link>
  );
}
