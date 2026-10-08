// Componente UI — Input con label, error y accesibilidad
// Ref: AcademiaSanPedro/00_Meta/02_UI_UX_Guidelines.md → Componentes UI Base → Input

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5
            text-neutral-900 placeholder:text-neutral-400 shadow-sm
            focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none
            hover:border-neutral-300
            transition-all duration-300 ease-in-out
            ${error ? "border-error focus:ring-error/15" : ""}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
