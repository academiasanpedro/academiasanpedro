import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Cabecera de página del área privada (dashboard y admin). */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-2 text-xs font-bold tracking-[0.18em] text-secondary uppercase">{eyebrow}</p>}
        <h1 className="text-3xl font-black tracking-tight text-balance text-neutral-900 sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-base font-medium text-pretty text-neutral-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
