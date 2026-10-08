import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("mb-4 text-xs font-bold tracking-[0.2em] uppercase", dark ? "text-secondary-light" : "text-secondary")}>
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-4xl font-black tracking-tight text-balance md:text-5xl",
          dark ? "text-white" : "text-neutral-900"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 text-lg leading-relaxed text-pretty md:text-xl", dark ? "text-white/70" : "text-neutral-500")}>
          {description}
        </p>
      )}
    </div>
  );
}
