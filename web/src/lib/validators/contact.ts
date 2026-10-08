// Esquema Zod del formulario de contacto público

import { z } from "zod";
import { LANGUAGES } from "@/lib/constants";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indica tu nombre").max(100, "Nombre demasiado largo"),
  email: z.string().trim().min(1, "El email es obligatorio").email("Introduce un email válido"),
  phone: z
    .string()
    .trim()
    .max(20, "Teléfono demasiado largo")
    .refine((value) => value === "" || /^\+?[\d\s-]{9,20}$/.test(value), "Introduce un teléfono válido"),
  language: z.union([z.enum(LANGUAGES), z.literal("")]),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres)")
    .max(1000, "Máximo 1000 caracteres"),
  privacy: z.boolean().refine((value) => value, "Debes aceptar la política de privacidad"),
  /** Honeypot anti-spam: debe llegar vacío. */
  website: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
