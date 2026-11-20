import { DAILY_RECORD_KEY, isDay, shortDay, type DailySlug } from "./daily";
import { getGame, type GameEntry } from "./games";
import { RECORDS } from "./record-keys";

/**
 * Shareable result links: /s/<slug>?v=<score>&k=<vi|en>&r=<quiz type>&d=<YYYY-MM-DD>
 * Only numbers within each game's plausible range and known quiz results are accepted,
 * so nobody can make our domain show arbitrary text in a link preview.
 */
export type ShareParams = { v?: number; k?: "vi" | "en"; r?: string; d?: string };

export function resultPath(slug: string, p: ShareParams) {
  const q = new URLSearchParams();
  if (typeof p.v === "number" && Number.isFinite(p.v)) q.set("v", String(Math.round(p.v)));
  if (p.k) q.set("k", p.k);
  if (p.r) q.set("r", p.r);
  if (p.d) q.set("d", p.d);
  const qs = q.toString();
  return `/s/${slug}${qs ? `?${qs}` : ""}`;
}

/** Absolute link for sharing (browser only) */
export const resultUrl = (slug: string, p: ShareParams) => `${window.location.origin}${resultPath(slug, p)}`;

export type QuizTypeLite = { id: string; name: string; emoji: string; tagline: string };

export type ShareContent = {
  game: GameEntry;
  /** Big line on the card: "3.400" or the quiz type name */
  headline: string;
  /** Small line next to/under it: unit or "Mình là" */
  unit: string;
  subtitle: string;
  daily: string | null;
  quizEmoji: string | null;
  query: string;
};

type Raw = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Validate a shared result; quiz types are passed in so this file stays free of the quiz content bundles */
export function parseShare(slug: string, raw: Raw, quizTypes: (slug: string) => QuizTypeLite[] | undefined): ShareContent | null {
  const game = getGame(slug);
  if (!game || game.status !== "live" || game.type === "party") return null;
  const d = one(raw.d);
  const daily = isDay(d) ? d : null;
  const q = new URLSearchParams();

  if (game.type === "quiz") {
    const r = one(raw.r);
    const t = r ? quizTypes(slug)?.find((x) => x.id === r) : undefined;
    if (!t) return null;
    q.set("r", t.id);
    return { game, headline: t.name, unit: "Mình là", subtitle: t.tagline, daily: null, quizEmoji: t.emoji, query: q.toString() };
  }

  const k = one(raw.k) === "en" ? "en" : one(raw.k) === "vi" ? "vi" : undefined;
  const key = daily && slug in DAILY_RECORD_KEY ? DAILY_RECORD_KEY[slug as DailySlug] : slug === "go-phim-nhanh" ? `go-phim-nhanh:${k ?? "vi"}` : slug;
  const def = RECORDS.find((x) => x.key === key);
  const v = Number(one(raw.v));
  if (!def || !Number.isInteger(v) || v < 0 || v > (def.max ?? 1_000_000)) return null;
  q.set("v", String(v));
  if (slug === "go-phim-nhanh" && k) q.set("k", k);
  if (daily) q.set("d", daily);
  const lang = slug === "go-phim-nhanh" ? (k === "en" ? " · English" : " · Tiếng Việt") : "";
  return {
    game,
    headline: v.toLocaleString("vi-VN"),
    unit: def.unit ?? "điểm",
    subtitle: daily ? `Thử thách ngày ${shortDay(daily)}${lang}. Bạn vượt qua được không?` : `Kỷ lục ${game.title}${lang}. Bạn vượt qua được không?`,
    daily,
    quizEmoji: null,
    query: q.toString(),
  };
}
