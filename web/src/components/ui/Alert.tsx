import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertTone = "info" | "success" | "warning" | "error";

const tones: Record<AlertTone, { box: string; icon: typeof Info }> = {
  info: { box: "border-primary/15 bg-primary-50 text-primary-dark", icon: Info },
  success: { box: "border-success/20 bg-success/10 text-success", icon: CheckCircle2 },
  warning: { box: "border-warning/25 bg-warning/10 text-warning", icon: AlertTriangle },
  error: { box: "border-error/20 bg-error/10 text-error", icon: XCircle },
};

export default function Alert({
  tone = "info",
  title,
  className,
  children,
}: {
  tone?: AlertTone;
  title?: string;
  className?: string;
  children?: ReactNode;
}) {
  const { box, icon: Icon } = tones[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm animate-fade-in", box, className)}
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 space-y-0.5">
        {title && <p className="font-bold">{title}</p>}
        {children && <div className="font-medium leading-relaxed opacity-90">{children}</div>}
      </div>
    </div>
  );
}
