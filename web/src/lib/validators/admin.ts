// Esquemas Zod de las acciones del panel de administración

import { z } from "zod";
import { LANGUAGES, LEAD_STATUSES, LEGAL_SLUGS } from "@/lib/constants";

export const updateLeadSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(LEAD_STATUSES),
  note: z.string().trim().max(2000, "Máximo 2000 caracteres"),
});

export const MARKETING_SEGMENTS = ["all", "leads", "enrolled"] as const;
export type MarketingSegment = (typeof MARKETING_SEGMENTS)[number];

export const marketingSchema = z.object({
  subject: z.string().trim().min(3, "Escribe un asunto").max(150, "Asunto demasiado largo"),
  content: z.string().trim().min(10, "Escribe el contenido del email").max(10000, "Contenido demasiado largo"),
  segment: z.enum(MARKETING_SEGMENTS),
  language: z.union([z.enum(LANGUAGES), z.literal("")]),
});

export type MarketingFormData = z.infer<typeof marketingSchema>;

export const legalPageSchema = z.object({
  slug: z.enum(LEGAL_SLUGS),
  content: z.string().max(100_000, "Contenido demasiado largo"),
});
