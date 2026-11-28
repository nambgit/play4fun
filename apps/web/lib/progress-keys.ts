/**
 * Progress that follows a signed-in player across devices (shared by the browser and the API).
 * Stored in user_records (key = PROGRESS key, meta.data = the value as a string).
 *
 * Merge rules, applied the same way in the browser and on the server:
 * - streak days: union of the days played on every device
 * - Đường lên CEO: the save with more total earnings wins (more progress)
 */

export const STREAK_KEY = "progress:streak";
export const CEO_KEY = "progress:duong-len-ceo";

export type ProgressDef = { key: string; storage: string; maxBytes: number };

export const PROGRESS: ProgressDef[] = [
  { key: STREAK_KEY, storage: "p4f:streak:days", maxBytes: 8_000 },
  { key: CEO_KEY, storage: "p4f:duong-len-ceo:save", maxBytes: 40_000 },
];
export const PROGRESS_BY_KEY = new Map(PROGRESS.map((p) => [p.key, p]));

export type ProgressItem = { key: string; data: string };

/** Days kept for the streak (about a year is plenty for "best streak") */
const MAX_DAYS = 400;
const isDay = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

export function parseDays(raw: string | null | undefined): string[] {
  try {
    const v = JSON.parse(raw ?? "[]");
    return Array.isArray(v) ? [...new Set(v.filter(isDay))].sort().slice(-MAX_DAYS) : [];
  } catch {
    return [];
  }
}

const ceoEarnings = (raw: string | null | undefined) => {
  try {
    const v = JSON.parse(raw ?? "null") as { v?: unknown; allTime?: unknown } | null;
    return v && v.v === 1 && typeof v.allTime === "number" && Number.isFinite(v.allTime) ? v.allTime : -1;
  } catch {
    return -1;
  }
};

/** Merge two values of the same progress key; null/empty sides lose */
export function mergeProgress(key: string, a: string | null | undefined, b: string | null | undefined): string | null {
  if (key === STREAK_KEY) {
    const days = parseDays(JSON.stringify([...parseDays(a), ...parseDays(b)]));
    return days.length ? JSON.stringify(days) : null;
  }
  if (key === CEO_KEY) {
    const ea = ceoEarnings(a);
    const eb = ceoEarnings(b);
    if (ea < 0 && eb < 0) return null;
    return ea >= eb ? (a as string) : (b as string);
  }
  return null;
}

/** Current streak (consecutive days ending today, or yesterday if today is not played yet) and best streak */
export function streakStats(days: string[], today: string) {
  const set = new Set(days);
  const dayMs = 86_400_000;
  const toMs = (d: string) => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10));
  const fromMs = (ms: number) => new Date(ms).toISOString().slice(0, 10);
  const playedToday = set.has(today);
  let current = 0;
  let cursor = toMs(today) - (playedToday ? 0 : dayMs);
  while (set.has(fromMs(cursor))) {
    current++;
    cursor -= dayMs;
  }
  let best = 0;
  let run = 0;
  let prev = -Infinity;
  for (const d of [...set].sort()) {
    const ms = toMs(d);
    run = ms - prev === dayMs ? run + 1 : 1;
    prev = ms;
    best = Math.max(best, run);
  }
  return { current, best, playedToday };
}
