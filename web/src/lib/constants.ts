// Constantes de negocio de la Academia de Idiomas San Pedro
// Ref: AcademiaSanPedro/02_Business.md y 03_Flows.md

export const SITE_NAME = "Academia de Idiomas San Pedro";

/** URL pública: NEXT_PUBLIC_SITE_URL → dominio de Vercel (producción o preview) → localhost. */
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const vercelHost =
    process.env.VERCEL_ENV === "production" ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL;
  return vercelHost ? `https://${vercelHost}` : "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const CONTACT = {
  address: "Plaza San Pedro nº 2",
  postalCode: "21004",
  city: "Huelva",
  phone: "610 93 25 78",
  phoneHref: "tel:+34610932578",
  email: "sanpedroidiomas@gmail.com",
  instagram: "https://www.instagram.com/sanpedroidiomas/",
  instagramHandle: "@sanpedroidiomas",
  /** Pendiente: URL de la página de Facebook (ver 06_Backlog). */
  facebook: null as string | null,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Plaza+San+Pedro+2,+21004+Huelva",
} as const;

export const LANGUAGES = ["Inglés", "Francés", "Alemán", "Italiano"] as const;
export type Language = (typeof LANGUAGES)[number];

/** Autoevaluación del alumno en el cuestionario inicial. */
export const SELF_ASSESSED_LEVELS = [
  "No estoy seguro/a",
  "Principiante (A1-A2)",
  "Intermedio (B1-B2)",
  "Avanzado (C1-C2)",
] as const;

export const SCHEDULES = [
  "Mañanas",
  "Tardes",
  "Noches",
  "Fines de semana",
  "Flexible",
] as const;

/** Niveles MCER que asigna el profesor tras evaluar el test. */
export const CEFR_LEVELS = [
  { value: "A1", label: "A1 · Iniciación" },
  { value: "A2", label: "A2 · Básico" },
  { value: "B1", label: "B1 · Intermedio" },
  { value: "B2", label: "B2 · Intermedio alto" },
  { value: "C1", label: "C1 · Avanzado" },
  { value: "C2", label: "C2 · Maestría" },
] as const;
export const CEFR_CODES = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export function cefrLabel(code: string | null | undefined) {
  return CEFR_LEVELS.find((level) => level.value === code)?.label ?? code ?? "";
}

export const LEAD_STATUSES = [
  "Interesado",
  "Contactado",
  "Matriculado",
  "No interesado",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const CAMBRIDGE_EXAMS = [
  { level: "B1", name: "Preliminary", short: "PET" },
  { level: "B2", name: "First", short: "FCE" },
  { level: "C1", name: "Advanced", short: "CAE" },
  { level: "C2", name: "Proficiency", short: "CPE" },
] as const;

export const LEGAL_PAGES = [
  { slug: "aviso-legal", title: "Aviso Legal" },
  { slug: "privacidad", title: "Política de Privacidad" },
  { slug: "cookies", title: "Política de Cookies" },
] as const;
export type LegalSlug = (typeof LEGAL_PAGES)[number]["slug"];
export const LEGAL_SLUGS = LEGAL_PAGES.map((page) => page.slug) as [LegalSlug, ...LegalSlug[]];
