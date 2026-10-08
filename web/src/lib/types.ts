// Tipos compartidos de la aplicación

/** Resultado estándar de una Server Action. */
export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

export type UserRole = "student" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  marketing_consent?: boolean;
  created_at: string;
}

export type TestStatus = "pending_review" | "evaluated";
