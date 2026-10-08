// Perfil del usuario — Ruta: /dashboard/settings (también lo usan los admins)

import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import ProfileForm from "@/components/features/ProfileForm";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Mi perfil" };

export default async function SettingsPage() {
  const { user, profile, displayName } = await requireUser();
  const metadataConsent = (user.user_metadata as { marketing_consent?: boolean }).marketing_consent;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader title="Mi perfil" description="Actualiza tus datos de contacto y tus preferencias de comunicación." />

      <Card className="p-6 sm:p-10">
        <ProfileForm
          email={profile?.email ?? user.email ?? ""}
          defaults={{
            full_name: profile?.full_name ?? displayName,
            phone: profile?.phone ?? "",
            marketing_consent: profile?.marketing_consent ?? metadataConsent ?? false,
          }}
        />
      </Card>

      <Card variant="muted" className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-primary ring-1 ring-neutral-200">
            <KeyRound size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-neutral-900">Contraseña</p>
            <p className="text-sm text-neutral-500">Te enviaremos un enlace por email para cambiarla.</p>
          </div>
        </div>
        <Link href="/auth/recuperar" className="text-sm font-bold text-primary hover:text-primary-dark">
          Cambiar contraseña →
        </Link>
      </Card>
    </div>
  );
}
