// Segmentación de audiencia del mailing (compartida por la página y la Server Action)

import type { MarketingSegment } from "@/lib/validators/admin";

export interface AudienceMember {
  status: string | null;
  language: string | null;
}

export function matchesAudience(member: AudienceMember, segment: MarketingSegment, language: string) {
  if (segment === "enrolled" && member.status !== "Matriculado") return false;
  if (segment === "leads" && member.status === "Matriculado") return false;
  if (language && member.language !== language) return false;
  return true;
}
