"use client";

import { markPlayedToday } from "./streak";

/**
 * Game analytics on top of Umami (loaded from /stats/script.js in the root layout).
 *
 * Events (shown on /admin):
 *   game-start  { game }
 *   game-end    { game, seconds, score? }   finished a round
 *   game-quit   { game, seconds }           left mid-round (tab closed / navigated away)
 *   party-start { game, players }           host started a party game
 *
 * Everything is fire-and-forget: if Umami is not loaded (not configured, blocked, offline)
 * calls do nothing, and they never throw into game code.
 */

type Umami = { track: (event: string, data?: Record<string, string | number>) => void };
declare global {
  interface Window {
    umami?: Umami;
  }
}

/** Fired on window when a round finishes (detail = game slug) */
export const GAME_END_EVENT = "p4f:game-end";

/** Events fired before the tracker script finished loading */
const queue: [string, Record<string, string | number>][] = [];
let flushTimer: ReturnType<typeof setInterval> | undefined;

export function track(event: string, data: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  try {
    if (window.umami) {
      window.umami.track(event, data);
      return;
    }
    if (queue.length < 20) queue.push([event, data]);
    flushTimer ??= setInterval(() => {
      if (!window.umami) return;
      clearInterval(flushTimer);
      flushTimer = undefined;
      for (const [e, d] of queue.splice(0)) window.umami.track(e, d);
    }, 1000);
  } catch {
    /* analytics must never break a game */
  }
}

// ------------------------------------------------------------ rounds & play time

/** Rounds in progress: slug → start time (ms) */
const running = new Map<string, number>();
let unloadHooked = false;

const secondsSince = (t: number) => Math.max(0, Math.round((performance.now() - t) / 1000));

function hookUnload() {
  if (unloadHooked || typeof window === "undefined") return;
  unloadHooked = true;
  // pagehide fires on tab close, reload and navigation (also on mobile, unlike beforeunload)
  window.addEventListener("pagehide", () => {
    for (const [game, t] of running) track("game-quit", { game, seconds: secondsSince(t) });
    running.clear();
  });
}

/** A round of `game` (slug) started. Starting again without ending counts the previous one as quit. */
export function gameStart(game: string) {
  hookUnload();
  markPlayedToday();
  const prev = running.get(game);
  if (prev !== undefined) track("game-quit", { game, seconds: secondsSince(prev) });
  running.set(game, performance.now());
  track("game-start", { game });
}

/** The round finished normally (game over / result screen) */
export function gameEnd(game: string, extra: { score?: number } = {}) {
  const t = running.get(game);
  if (t === undefined) return;
  running.delete(game);
  const data: Record<string, string | number> = { game, seconds: secondsSince(t) };
  if (typeof extra.score === "number" && Number.isFinite(extra.score)) data.score = Math.round(extra.score);
  track("game-end", data);
  // The page shows a "come back tomorrow" nudge after a finished round (components/after-game-nudge)
  window.dispatchEvent(new CustomEvent(GAME_END_EVENT, { detail: game }));
}

/** Leaving a game page (component unmount) while a round is running */
export function gameLeave(game: string) {
  const t = running.get(game);
  if (t === undefined) return;
  running.delete(game);
  track("game-quit", { game, seconds: secondsSince(t) });
}
