// Esquema Zod del perfil del usuario

import { z } from "zod";

export const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  phone: z
    .string()
    .trim()
    .max(20, "Teléfono demasiado largo")
    .refine((value) => value === "" || /^\+?[\d\s-]{9,20}$/.test(value), "Introduce un teléfono válido"),
  marketing_consent: z.boolean(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
