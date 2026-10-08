"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import DividerWithText from "@/components/ui/DividerWithText";
import GoogleIcon from "@/components/ui/GoogleIcon";
import { authCallbackUrl, rememberNextPath } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase/client";

/** Separador + botón "Continuar con Google" (OAuth vía /auth/callback). */
export default function GoogleButton({ next = "/dashboard" }: { next?: string }) {
  const [loading, setLoading] = useState(false);
  // Evita dos flujos OAuth simultáneos por doble clic (el estado de React aún no se ha pintado)
  const started = useRef(false);

  const handleClick = async () => {
    if (started.current) return;
    started.current = true;
    setLoading(true);
    rememberNextPath(next);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: authCallbackUrl() },
    });
    if (error) {
      started.current = false;
      setLoading(false);
    }
  };

  return (
    <>
      <DividerWithText text="o continúa con" />
      <Button variant="google" size="lg" fullWidth onClick={handleClick} isLoading={loading} loadingText="Redirigiendo…">
        <GoogleIcon />
        Continuar con Google
      </Button>
    </>
  );
}
