// Componente UI — Botón con variantes y estados de carga
// Ref: AcademiaSanPedro/00_Meta/02_UI_UX_Guidelines.md → Componentes UI Base → Botones

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "google";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  fullWidth = true,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative rounded-xl px-6 py-3.5 font-semibold text-sm transition-all duration-300 ease-in-out focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]";

  const variants = {
    primary:
      "bg-primary text-white shadow-[0_4px_14px_0_rgba(var(--color-primary),0.39)] hover:bg-primary-dark hover:shadow-[0_6px_20px_rgba(var(--color-primary),0.23)] hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-primary/30 border border-transparent",
    secondary:
      "border border-primary text-primary bg-transparent hover:bg-primary/5 focus-visible:ring-4 focus-visible:ring-primary/20",
    google:
      "border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-neutral-200",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
