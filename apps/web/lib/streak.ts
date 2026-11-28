"use client";

/**
 * Site-wide daily streak: a day counts when the player starts any game (solo or party).
 * Days are kept in localStorage (Vietnam calendar days, like the daily challenge) and, for signed-in
 * players, merged with the account by lib/progress-sync.
 */
import { dayOf } from "./daily";
import { PROGRESS_BY_KEY, STREAK_KEY, parseDays, streakStats } from "./progress-keys";

const STORAGE = PROGRESS_BY_KEY.get(STREAK_KEY)!.storage;
export const STREAK_EVENT = "p4f:streak";

export function readDays(): string[] {
  try {
    return parseDays(localStorage.getItem(STORAGE));
  } catch {
    return [];
  }
}

export function writeDays(days: string[]) {
  try {
    localStorage.setItem(STORAGE, JSON.stringify(days));
  } catch {
    /* storage blocked: the streak lasts for this tab only */
  }
  window.dispatchEvent(new Event(STREAK_EVENT));
}

/** Record that the player played today (no-op if already recorded) */
export function markPlayedToday() {
  if (typeof window === "undefined") return;
  const today = dayOf();
  const days = readDays();
  if (days.includes(today)) return;
  writeDays([...days, today]);
}

export function currentStreak() {
  return streakStats(readDays(), dayOf());
}

/** Time left until the next Vietnam calendar day (when the daily challenge changes) */
export function untilTomorrow(now = new Date()) {
  const vn = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  const next = new Date(vn);
  next.setHours(24, 0, 0, 0);
  const min = Math.max(0, Math.round((next.getTime() - vn.getTime()) / 60000));
  return { hours: Math.floor(min / 60), minutes: min % 60 };
}
