"use client";

// Diálogo modal accesible: Escape cierra, foco inicial dentro y retorno al cerrar, scroll bloqueado.

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg" | "xl";
  children: ReactNode;
}

const sizes = { md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-5xl" };

export default function Modal({ open, onClose, title, description, footer, size = "lg", children }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = panelRef.current?.querySelector<HTMLElement>(
      "input, select, textarea, button:not([data-close]), [href]"
    );
    (focusable ?? panelRef.current)?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift animate-scale-in focus:outline-none sm:rounded-3xl",
          sizes[size]
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-5">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl font-black tracking-tight text-neutral-900">
              {title}
            </h2>
            {description && <div className="mt-1 text-sm font-medium text-neutral-500">{description}</div>}
          </div>
          <button
            type="button"
            data-close
            onClick={onClose}
            aria-label="Cerrar"
            className="grid size-9 shrink-0 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 bg-neutral-50/70 px-6 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
