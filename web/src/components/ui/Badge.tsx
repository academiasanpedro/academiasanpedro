import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "primary" | "secondary" | "success" | "warning" | "error";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  primary: "bg-primary-50 text-primary ring-primary/15",
  secondary: "bg-secondary/10 text-secondary ring-secondary/20",
  success: "bg-success/10 text-success ring-success/20",
  warning: "bg-warning/10 text-warning ring-warning/20",
  error: "bg-error/10 text-error ring-error/20",
};

export default function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold whitespace-nowrap ring-1 ring-inset",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Color del estado de un lead en el CRM. */
export function leadStatusTone(status: string | null | undefined): BadgeTone {
  switch (status) {
    case "Contactado":
      return "primary";
    case "Matriculado":
      return "success";
    case "No interesado":
      return "neutral";
    default:
      return "secondary";
  }
}
