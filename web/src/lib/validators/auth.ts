// Esquemas Zod de autenticación
// Ref: AcademiaSanPedro/03_Flows.md → Embudo del alumno

import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(1, "El email es obligatorio")
  .email("Introduce un email válido");

const newPassword = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(72, "La contraseña es demasiado larga");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const registroSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre es demasiado largo"),
    email,
    password: newPassword,
    confirm_password: z.string().min(1, "Confirma tu contraseña"),
    privacy: z.boolean().refine((value) => value, "Debes aceptar la política de privacidad"),
    marketing_consent: z.boolean(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

export const recoverySchema = z.object({ email });

export const newPasswordSchema = z
  .object({
    password: newPassword,
    confirm_password: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistroFormData = z.infer<typeof registroSchema>;
export type RecoveryFormData = z.infer<typeof recoverySchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;
