import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** /robots.txt — keep crawlers on public pages, off APIs, personal pages and generated share pages */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/accounts", "/studio", "/login", "/s/", "/og/", "/stats/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
