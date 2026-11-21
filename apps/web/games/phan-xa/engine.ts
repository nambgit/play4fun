/**
 * Phản xạ 0,2 giây — reaction-time test (pure logic, no React / DOM).
 *
 * Each attempt: the screen turns red and waits a random 1.5–4 s, then turns green; the player
 * taps as fast as possible. Tapping while red is a false start: that attempt restarts (no
 * penalty to the score, but it is counted). The result is the average of ATTEMPTS taps.
 * Times are measured by the component with performance.now() on pointerdown / keydown.
 */

export const ATTEMPTS = 5;
export const MIN_WAIT_MS = 1500;
export const MAX_WAIT_MS = 4000;
/** Faster than this is not humanly possible: treated as a lucky guess (false start) */
export const MIN_HUMAN_MS = 90;

export type Stage = "wait" | "go" | "early" | "shown" | "done";

export type GameState = {
  stage: Stage;
  times: number[];
  falseStarts: number;
  /** performance.now() when the screen turned green */
  goAt: number;
  /** delay before the next green, ms */
  wait: number;
  last: number | null;
};

export const randomWait = (rnd = Math.random) => MIN_WAIT_MS + rnd() * (MAX_WAIT_MS - MIN_WAIT_MS);

export function createGame(): GameState {
  return { stage: "wait", times: [], falseStarts: 0, goAt: 0, wait: randomWait(), last: null };
}

/** The random delay is over: show green */
export function go(s: GameState, now: number) {
  if (s.stage !== "wait") return;
  s.stage = "go";
  s.goAt = now;
}

/** A tap. Returns what happened so the component can react. */
export function tap(s: GameState, now: number): "early" | "hit" | "ignored" {
  if (s.stage === "wait") {
    s.stage = "early";
    s.falseStarts++;
    return "early";
  }
  if (s.stage !== "go") return "ignored";
  const ms = Math.round(now - s.goAt);
  if (ms < MIN_HUMAN_MS) {
    s.stage = "early";
    s.falseStarts++;
    return "early";
  }
  s.times.push(ms);
  s.last = ms;
  s.stage = s.times.length >= ATTEMPTS ? "done" : "shown";
  return "hit";
}

/** Start the next attempt (after a result or a false start) */
export function next(s: GameState) {
  if (s.stage === "done") return;
  s.stage = "wait";
  s.wait = randomWait();
}

export const average = (times: readonly number[]) => (times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0);

const RANKS: [number, string, string][] = [
  [200, "Phản xạ siêu nhân", "⚡"],
  [240, "Nhanh như chớp", "🐆"],
  [280, "Rất nhanh", "🚀"],
  [330, "Nhanh hơn số đông", "👍"],
  [400, "Trung bình", "🙂"],
  [Infinity, "Hơi chậm, uống ly cà phê đã", "☕"],
];

export function rankFor(avgMs: number) {
  const [, title, emoji] = RANKS.find(([max]) => avgMs < max)!;
  return { title, emoji };
}
