// Layout del área de alumno (protegida por proxy + comprobación en servidor)

import type { Metadata } from "next";
import StudentShell from "@/components/layout/StudentShell";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Mi panel", template: "%s | Área de alumnos" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const { user, profile, displayName } = await requireUser();

  return (
    <StudentShell name={displayName} email={user.email} isAdmin={profile?.role === "admin"}>
      {children}
    </StudentShell>
  );
}
