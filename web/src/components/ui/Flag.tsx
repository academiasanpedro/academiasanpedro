// Banderas SVG (los emojis de bandera no se ven en Windows)

import { useId } from "react";
import { cn } from "@/lib/utils";

export default function Flag({ language, className }: { language: string; className?: string }) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const svgProps = {
    viewBox: "0 0 60 40",
    preserveAspectRatio: "xMidYMid slice",
    className: cn("size-10 rounded-full ring-2 ring-white shadow-sm", className),
    "aria-hidden": true,
  } as const;

  switch (language) {
    case "Francés":
      return (
        <svg {...svgProps}>
          <rect width="20" height="40" fill="#0055A4" />
          <rect x="20" width="20" height="40" fill="#FFFFFF" />
          <rect x="40" width="20" height="40" fill="#EF4135" />
        </svg>
      );
    case "Alemán":
      return (
        <svg {...svgProps}>
          <rect width="60" height="13.34" fill="#000000" />
          <rect y="13.33" width="60" height="13.34" fill="#DD0000" />
          <rect y="26.66" width="60" height="13.34" fill="#FFCE00" />
        </svg>
      );
    case "Italiano":
      return (
        <svg {...svgProps}>
          <rect width="20" height="40" fill="#009246" />
          <rect x="20" width="20" height="40" fill="#FFFFFF" />
          <rect x="40" width="20" height="40" fill="#CE2B37" />
        </svg>
      );
    default:
      // Reino Unido (Inglés)
      return (
        <svg {...svgProps}>
          <clipPath id={`${id}-t`}>
            <path d="M30,20 h30 v20 z v20 h-30 z h-30 v-20 z v-20 h30 z" />
          </clipPath>
          <rect width="60" height="40" fill="#012169" />
          <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth="8" />
          <path d="M0,0 L60,40 M60,0 L0,40" clipPath={`url(#${id}-t)`} stroke="#C8102E" strokeWidth="5" />
          <path d="M30,0 v40 M0,20 h60" stroke="#FFFFFF" strokeWidth="12" />
          <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="7" />
        </svg>
      );
  }
}
