// Destino tras OAuth / enlaces de email.
// Supabase solo respeta `redirectTo` si coincide con su lista de Redirect URLs; con query (?next=)
// deja de coincidir con la URL exacta y cae en la Site URL. Por eso la URL de retorno es siempre
// `/auth/callback` sin parámetros y el destino viaja en una cookie de vida corta.

export const NEXT_PATH_COOKIE = "auth_next";

/** 1 h: lo que dura por defecto un enlace de confirmación o recuperación de Supabase. */
const MAX_AGE_SECONDS = 60 * 60;

export function authCallbackUrl() {
  return `${window.location.origin}/auth/callback`;
}

export function rememberNextPath(path: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${NEXT_PATH_COOKIE}=${encodeURIComponent(path)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}
