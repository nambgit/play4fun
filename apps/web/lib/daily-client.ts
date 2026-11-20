"use client";

import { dailyGame, dayOf, type DailyInfo } from "./daily";

/** First finished round of `day` on this device (also used by guests, who are not on the board) */
export type LocalDaily = { score: number; at: number };
const key = (day: string) => `p4f:daily:${day}`;

export function readLocalDaily(day = dayOf()): LocalDaily | null {
  try {
    const v = JSON.parse(localStorage.getItem(key(day)) ?? "null");
    return v && typeof v.score === "number" ? v : null;
  } catch {
    return null;
  }
}

export const DAILY_EVENT = "p4f:daily";

/**
 * A daily round finished. The first one of the day is the official result: kept locally
 * and sent to the account (the server also keeps only the first). Returns true if this
 * round was the official one.
 */
export async function finishDaily(info: DailyInfo, game: string, score: number): Promise<boolean> {
  if (info.game !== game || dailyGame(info.day) !== game) return false;
  const first = !readLocalDaily(info.day);
  if (first) {
    try {
      localStorage.setItem(key(info.day), JSON.stringify({ score: Math.round(score), at: Date.now() }));
    } catch {
      /* storage blocked */
    }
  }
  try {
    await fetch("/api/daily", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ day: info.day, game, score: Math.round(score) }),
    });
  } catch {
    /* guest (401) or offline: the local result stays */
  }
  window.dispatchEvent(new Event(DAILY_EVENT));
  return first;
}
