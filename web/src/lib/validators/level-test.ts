// Esquemas Zod del test de nivel (envío del alumno, constructor y evaluación admin)

import { z } from "zod";
import { CEFR_CODES, LANGUAGES } from "@/lib/constants";

export const submitLevelTestSchema = z.object({
  language: z.enum(LANGUAGES),
  // -1 = "No lo sé" / sin responder
  answers: z.array(z.number().int().min(-1).max(5)).min(1).max(200),
});

export const levelTestQuestionSchema = z
  .object({
    q: z.string().trim().min(1, "El enunciado no puede estar vacío").max(500),
    options: z
      .array(z.string().trim().min(1, "Las opciones no pueden estar vacías").max(200))
      .min(2, "Mínimo 2 opciones")
      .max(6, "Máximo 6 opciones"),
    answer: z.number().int().min(0),
  })
  .refine((question) => question.answer < question.options.length, {
    message: "La respuesta correcta no es válida",
    path: ["answer"],
  });

export const saveLevelTestSchema = z.object({
  language: z.enum(LANGUAGES),
  questions: z.array(levelTestQuestionSchema).max(200),
});

export const evaluateLevelTestSchema = z.object({
  testId: z.string().uuid(),
  level: z.enum(CEFR_CODES, { errorMap: () => ({ message: "Selecciona un nivel." }) }),
  notes: z.string().trim().max(1000, "Máximo 1000 caracteres"),
  notify: z.boolean(),
});
