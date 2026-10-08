"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import DividerWithText from "@/components/ui/DividerWithText";
import GoogleIcon from "@/components/ui/GoogleIcon";
import { createClient } from "@/lib/supabase/client";

/** Separador + botón "Continuar con Google" (OAuth vía /auth/callback). */
export default function GoogleButton({ next = "/dashboard" }: { next?: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (error) setLoading(false);
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
