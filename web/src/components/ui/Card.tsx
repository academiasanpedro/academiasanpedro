import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "glass" | "dark" | "muted";

const variants: Record<CardVariant, string> = {
  default: "border border-neutral-200/70 bg-white shadow-soft",
  glass: "border border-white/60 bg-white/75 shadow-soft ring-1 ring-neutral-900/5 backdrop-blur-xl",
  dark: "border border-white/10 bg-white/5 text-white backdrop-blur-xl",
  muted: "border border-neutral-200/70 bg-neutral-50",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export default function Card({ variant = "default", className, ...props }: CardProps) {
  return <div className={cn("rounded-3xl", variants[variant], className)} {...props} />;
}
