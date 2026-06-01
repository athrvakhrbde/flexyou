import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/utils/app-url";

export default function robots(): MetadataRoute.Robots {
  const base = getAppUrl();
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/feed", "/u/", "/item/"],
      disallow: ["/settings", "/onboarding", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
