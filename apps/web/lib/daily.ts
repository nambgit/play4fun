/**
 * Daily challenge: one game per day, the same round (seed) for everyone in Vietnam.
 * Pure functions shared by the server (API, /daily) and the browser (games, banner),
 * so guests can play today's challenge without a server round-trip.
 */

export const DAILY_TZ = "Asia/Ho_Chi_Minh";

/** Games whose rounds are fully determined by a seed */
export const DAILY_GAMES = ["inbox-zero", "bai-kiem-tra-15-phut", "go-phim-nhanh", "deadline-dash", "pixel-dodge"] as const;
export type DailySlug = (typeof DAILY_GAMES)[number];

/** Record key used for the daily score (typing is played in Vietnamese) */
export const DAILY_RECORD_KEY: Record<DailySlug, string> = {
  "inbox-zero": "inbox-zero",
  "bai-kiem-tra-15-phut": "bai-kiem-tra-15-phut",
  "go-phim-nhanh": "go-phim-nhanh:vi",
  "deadline-dash": "deadline-dash",
  "pixel-dodge": "pixel-dodge",
};

/** "YYYY-MM-DD" in Vietnam time */
export function dayOf(date = new Date()) {
  return date.toLocaleDateString("en-CA", { timeZone: DAILY_TZ });
}

export const isDay = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

function daysSinceEpoch(day: string) {
  return Math.floor(Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10)) / 86_400_000);
}

/** FNV-1a 32-bit */
function hash(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Rotates through the games so the same game never comes twice in a row */
export function dailyGame(day = dayOf()): DailySlug {
  return DAILY_GAMES[daysSinceEpoch(day) % DAILY_GAMES.length];
}

export function dailySeed(day = dayOf()) {
  return hash(`play4fun:${day}:${dailyGame(day)}`) || 1;
}

/** "20/11" */
export const shortDay = (day: string) => `${day.slice(8, 10)}/${day.slice(5, 7)}`;

/** Milliseconds until the next challenge (midnight in Vietnam) */
export function msUntilNextDay(now = new Date()) {
  const local = new Date(now.toLocaleString("en-US", { timeZone: DAILY_TZ }));
  const next = new Date(local);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - local.getTime();
}

export type DailyInfo = { day: string; game: DailySlug; seed: number };
export const dailyInfo = (day = dayOf()): DailyInfo => ({ day, game: dailyGame(day), seed: dailySeed(day) });
