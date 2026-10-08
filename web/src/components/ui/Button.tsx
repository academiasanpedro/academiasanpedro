// Botón y enlace con aspecto de botón
// Ref: AcademiaSanPedro/01_Design.md → Primitivas

import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "@/lib/utils";
import Spinner from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "google" | "dark" | "light" | "white";
export type ButtonSize = "sm" | "md" | "lg";

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-bold whitespace-nowrap transition-all duration-200 ease-out select-none focus-visible:outline-none focus-visible:ring-4 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-glow-primary hover:-translate-y-0.5 hover:bg-primary-dark focus-visible:ring-primary/30",
  secondary:
    "bg-secondary text-white shadow-glow-secondary hover:-translate-y-0.5 hover:bg-secondary-dark focus-visible:ring-secondary/30",
  outline:
    "border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:border-primary/30 hover:bg-primary-50 hover:text-primary focus-visible:ring-primary/20",
  ghost: "text-neutral-600 hover:bg-primary-50 hover:text-primary focus-visible:ring-primary/20",
  google:
    "border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:-translate-y-0.5 hover:bg-neutral-50 hover:shadow-md focus-visible:ring-neutral-200",
  dark: "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900/30",
  white: "bg-white text-primary-dark shadow-xl hover:-translate-y-0.5 hover:text-secondary focus-visible:ring-white/40",
  light:
    "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/20 focus-visible:ring-white/30",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export function buttonStyles({ variant = "primary", size = "md", fullWidth, className }: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleProps {
  isLoading?: boolean;
  loadingText?: string;
}

export default function Button({
  variant,
  size,
  fullWidth,
  className,
  isLoading = false,
  loadingText,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, fullWidth, className })}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner className="size-4" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleProps;

export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, fullWidth, className })} {...props} />;
}
