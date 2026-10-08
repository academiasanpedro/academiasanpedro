import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-14 text-center", className)}>
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-neutral-100 text-neutral-400">
        <Icon size={26} aria-hidden="true" />
      </div>
      <p className="text-base font-bold text-neutral-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm font-medium text-neutral-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
