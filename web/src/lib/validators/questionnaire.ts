import * as z from "zod";

export const questionnaireSchema = z.object({
  target_language: z.string().min(1, { message: "Por favor, selecciona un idioma." }),
  current_level: z.string().min(1, { message: "Por favor, selecciona tu nivel actual." }),
  preferred_schedule: z.string().min(1, { message: "Por favor, selecciona tu preferencia horaria." }),
  goals: z.string().max(500, { message: "Máximo 500 caracteres permitidos." }).optional(),
});

export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>;
