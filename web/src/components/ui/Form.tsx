// Campos de formulario accesibles (label, ayuda y error enlazados)
// Compatibles con React Hook Form: <InputField {...register("email")} error={errors.email?.message} />

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

function FieldShell({ id, label, error, hint, optional, className, children }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-neutral-800">
          {label}
        </label>
        {optional && <span className="text-xs font-medium text-neutral-400">Opcional</span>}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-neutral-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

const control =
  "w-full rounded-xl border bg-white text-neutral-900 shadow-sm transition duration-200 placeholder:text-neutral-400 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500";

function controlState(invalid: boolean) {
  return invalid
    ? "border-error focus:border-error focus:ring-error/15"
    : "border-neutral-200 hover:border-neutral-300 focus:border-primary focus:ring-primary/15";
}

function describedBy(id: string, error?: string, hint?: ReactNode) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

interface CommonProps {
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  wrapperClassName?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & CommonProps>(
  function InputField({ label, error, hint, optional, wrapperClassName, id, className, ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <FieldShell id={inputId} label={label} error={error} hint={hint} optional={optional} className={wrapperClassName}>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn(control, controlState(Boolean(error)), "h-12 px-4", className)}
          {...props}
        />
      </FieldShell>
    );
  }
);

export const SelectField = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & CommonProps>(
  function SelectField({ label, error, hint, optional, wrapperClassName, id, className, children, ...props }, ref) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    return (
      <FieldShell id={selectId} label={label} error={error} hint={hint} optional={optional} className={wrapperClassName}>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(selectId, error, hint)}
            className={cn(control, controlState(Boolean(error)), "h-12 appearance-none pr-11 pl-4", className)}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-neutral-400"
          />
        </div>
      </FieldShell>
    );
  }
);

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & CommonProps>(
  function TextareaField({ label, error, hint, optional, wrapperClassName, id, className, ...props }, ref) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    return (
      <FieldShell id={textareaId} label={label} error={error} hint={hint} optional={optional} className={wrapperClassName}>
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(textareaId, error, hint)}
          className={cn(control, controlState(Boolean(error)), "min-h-28 resize-y px-4 py-3 leading-relaxed", className)}
          {...props}
        />
      </FieldShell>
    );
  }
);

interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  error?: string;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(function CheckboxField(
  { label, error, id, className, ...props },
  ref
) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={checkboxId} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-neutral-600">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-md border-neutral-300 accent-primary"
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${checkboxId}-error`} role="alert" className="pl-8 text-sm font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
});
