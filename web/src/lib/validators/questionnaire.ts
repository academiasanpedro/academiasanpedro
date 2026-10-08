// Esquema Zod del cuestionario inicial (cliente + Server Action)
// Ref: AcademiaSanPedro/03_Flows.md → Cuestionario

import { z } from "zod";
import { LANGUAGES, SCHEDULES, SELF_ASSESSED_LEVELS } from "@/lib/constants";

export const questionnaireSchema = z.object({
  target_language: z.enum(LANGUAGES, {
    errorMap: () => ({ message: "Selecciona un idioma." }),
  }),
  current_level: z.enum(SELF_ASSESSED_LEVELS, {
    errorMap: () => ({ message: "Selecciona tu nivel actual." }),
  }),
  preferred_schedule: z.enum(SCHEDULES, {
    errorMap: () => ({ message: "Selecciona tu preferencia horaria." }),
  }),
  goals: z.string().trim().max(500, "Máximo 500 caracteres."),
});

export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>;
