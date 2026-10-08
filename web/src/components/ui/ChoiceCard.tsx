// Opción seleccionable tipo tarjeta (radio accesible con estilo). Compatible con register() de RHF.

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChoiceCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  compact?: boolean;
}

const ChoiceCard = forwardRef<HTMLInputElement, ChoiceCardProps>(function ChoiceCard(
  { label, description, icon, compact = false, className, ...props },
  ref
) {
  return (
    <label className={cn("group relative block cursor-pointer", className)}>
      <input ref={ref} type="radio" className="peer sr-only" {...props} />
      <span
        className={cn(
          "flex h-full items-center gap-3 rounded-2xl border-2 border-neutral-200 bg-white transition duration-200",
          "group-hover:border-primary/40 group-hover:bg-primary-50/40",
          "peer-checked:border-primary peer-checked:bg-primary-50 peer-checked:shadow-[0_0_0_4px_rgb(36_59_120/0.08)]",
          "peer-focus-visible:ring-4 peer-focus-visible:ring-primary/25",
          compact ? "py-3 pr-11 pl-4" : "py-4 pr-12 pl-4"
        )}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-neutral-900">{label}</span>
          {description && <span className="mt-0.5 block text-xs font-medium text-neutral-500">{description}</span>}
        </span>
      </span>
      <span className="pointer-events-none absolute top-1/2 right-4 grid size-6 -translate-y-1/2 scale-50 place-items-center rounded-full bg-primary text-white opacity-0 transition peer-checked:scale-100 peer-checked:opacity-100">
        <Check size={14} strokeWidth={3} aria-hidden="true" />
      </span>
    </label>
  );
});

export default ChoiceCard;
