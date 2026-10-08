// Utilidades genéricas sin dependencias

/** Une clases condicionales ignorando valores vacíos. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Madrid",
});

const dateTimeFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Madrid",
});

export function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: string | Date) {
  return dateTimeFormatter.format(new Date(value));
}

/** Iniciales para avatares ("María García" → "MG"). */
export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] ?? "";
  return (first + last).toUpperCase();
}

/** Solo permite redirecciones internas (evita open redirects). */
export function safeRedirectPath(path: string | null | undefined, fallback = "/dashboard") {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
    return fallback;
  }
  return path;
}
