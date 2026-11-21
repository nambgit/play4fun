import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { GAMES, GAME_TYPES } from "@/lib/games";
import { CATEGORY_SEO, SITE_URL } from "@/lib/seo";

/**
 * /sitemap.xml — every public page Google should index.
 * lastmod is only given where we know the real date (articles): a build timestamp on every
 * page would be wrong, and Google ignores lastmod values it cannot trust.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) => ({
    url: SITE_URL + path,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "daily"),
    ...GAME_TYPES.map((t) => page(CATEGORY_SEO[t].path, 0.9, "weekly")),
    ...GAMES.filter((g) => g.status === "live").map((g) => page(`/games/${g.slug}`, 0.8, "weekly")),
    page("/cam-nang", 0.7, "weekly"),
    ...ARTICLES.map((a) => ({ url: `${SITE_URL}/cam-nang/${a.slug}`, lastModified: new Date(a.updated), changeFrequency: "monthly" as const, priority: 0.7 })),
    page("/daily", 0.7, "daily"),
    page("/leaderboard", 0.5, "daily"),
    page("/privacy", 0.2, "yearly"),
  ];
}
