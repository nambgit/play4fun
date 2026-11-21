import type { MetadataRoute } from "next";
import { GAMES, GAME_TYPES } from "@/lib/games";
import { CATEGORY_SEO, SITE_URL } from "@/lib/seo";

/** /sitemap.xml — every public page Google should index */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) => ({
    url: SITE_URL + path,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "daily"),
    ...GAME_TYPES.map((t) => page(CATEGORY_SEO[t].path, 0.9, "weekly")),
    ...GAMES.filter((g) => g.status === "live").map((g) => page(`/games/${g.slug}`, 0.8, "weekly")),
    page("/daily", 0.7, "daily"),
    page("/leaderboard", 0.5, "daily"),
    page("/privacy", 0.2, "yearly"),
  ];
}
