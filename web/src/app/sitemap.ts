import type { MetadataRoute } from "next";
import { LEGAL_PAGES, SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/auth/registro`, changeFrequency: "yearly", priority: 0.6 },
    ...LEGAL_PAGES.map((page) => ({
      url: `${SITE_URL}/legal/${page.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
