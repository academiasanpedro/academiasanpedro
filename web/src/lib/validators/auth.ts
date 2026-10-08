// Esquemas de validación Zod para los formularios de auth
// Ref: AcademiaSanPedro/01_Requirements/01_User_Flow_Login.md

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Introduce un email válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria"),
});

export const registroSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre es demasiado largo"),
    email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("Introduce un email válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirm_password: z
      .string()
      .min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistroFormData = z.infer<typeof registroSchema>;
