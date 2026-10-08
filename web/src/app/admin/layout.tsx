// Layout del panel admin — protegido por proxy y verificado aquí en servidor (requireAdmin)

import type { Metadata } from "next";
import AdminShell, { type PendingNotification } from "@/components/layout/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: { default: "Panel admin", template: "%s | Admin San Pedro" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { user, displayName } = await requireAdmin();
  const supabase = await createClient();

  const { data, count } = await supabase
    .from("level_tests")
    .select("id, language, completed_at, profiles(full_name, email)", { count: "exact" })
    .eq("status", "pending_review")
    .order("completed_at", { ascending: false })
    .limit(5);

  const notifications: PendingNotification[] = (data ?? []).map((row) => {
    const profile = (Array.isArray(row.profiles) ? row.profiles[0] : row.profiles) as
      | { full_name: string | null; email: string }
      | null;
    return {
      id: row.id,
      language: row.language,
      completed_at: row.completed_at,
      student: profile?.full_name || profile?.email || "Alumno/a",
    };
  });

  return (
    <AdminShell name={displayName} email={user.email} pendingCount={count ?? 0} notifications={notifications}>
      {children}
    </AdminShell>
  );
}
