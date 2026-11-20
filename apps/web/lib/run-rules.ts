/**
 * Server-side checks for a finished round ("run"). Scores are reported by the browser, so each
 * game sends a small proof with its score and the server checks it against the run ticket
 * (issued when the round started, so the server knows the real wall-clock time and the seed).
 *
 * - Gõ phím thần tốc, Kiểm tra 15 phút: the server re-grades the round from what was typed /
 *   answered — the reported score is only accepted if it matches.
 * - Arcade games (Inbox Zero, Deadline Dash, Pixel Dodge): the stats behind the score must add
 *   up and fit in the time that really passed. This stops made-up scores; a full replay of
 *   every input would be needed to stop a modified game client.
 */
import { regrade, seededOrder } from "@/games/go-phim-nhanh/engine";
import { replay, REVEAL_SECONDS, type AnswerLog } from "@/games/kiem-tra-15-phut/engine";

export type RunCheck = { ok: true; score: number } | { ok: false; reason: string };

export type RunContext = {
  score: number;
  proof: unknown;
  /** Seconds between the ticket and the finish (includes pauses, so it is an upper bound on play time) */
  wall: number;
  seed: number;
  daily: boolean;
};

/** Network slack: the ticket is requested when the round starts, it may arrive a little later */
const SLACK = 3;

const num = (v: unknown, max: number): number | null => (typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= max ? v : null);
const bad = (reason: string): RunCheck => ({ ok: false, reason });

function typing(lang: "vi" | "en") {
  return ({ score, proof, wall, seed, daily }: RunContext): RunCheck => {
    const p = proof as { dealt?: unknown; log?: unknown } | null;
    const dealt = p?.dealt;
    const log = p?.log;
    if (!Array.isArray(dealt) || !Array.isArray(log) || dealt.length > 60 || log.length > 800) return bad("proof");
    if (!dealt.every((x) => typeof x === "string") || !log.every((x) => typeof x === "string" && x.length <= 60)) return bad("proof");
    if (wall < 60 - SLACK) return bad("too_fast");
    if (daily) {
      const order = seededOrder(lang, seed);
      if (dealt.some((id, i) => order[i] !== id)) return bad("wrong_round");
    }
    const wpm = regrade(lang, dealt as string[], log as string[]);
    if (wpm === null) return bad("proof");
    // the browser divides by the exact elapsed time (a hair over 60s), so it may be 1 lower
    if (score > wpm || score < wpm - 1) return bad("mismatch");
    return { ok: true, score };
  };
}

export const RUN_RULES: Record<string, (c: RunContext) => RunCheck> = {
  "go-phim-nhanh:vi": typing("vi"),
  "go-phim-nhanh:en": typing("en"),

  "bai-kiem-tra-15-phut": ({ score, proof, wall, seed }) => {
    const log = (proof as { log?: unknown } | null)?.log;
    if (!Array.isArray(log) || log.length > 400) return bad("proof");
    if (!log.every((a) => Array.isArray(a) && a.length === 2 && typeof a[0] === "number" && typeof a[1] === "number")) return bad("proof");
    const r = replay(seed, log as AnswerLog);
    if (!r) return bad("proof");
    if (r.elapsed + r.wrong * REVEAL_SECONDS > wall + SLACK) return bad("too_fast");
    if (score !== r.correct) return bad("mismatch");
    return { ok: true, score };
  },

  "inbox-zero": ({ score, proof, wall }) => {
    const p = proof as Record<string, unknown> | null;
    const elapsed = num(p?.elapsed, 900);
    const processed = num(p?.processed, 5000);
    const correct = num(p?.correct, 5000);
    const phishing = num(p?.phishing, 5000);
    if (elapsed === null || processed === null || correct === null || phishing === null) return bad("proof");
    if (elapsed > wall + SLACK) return bad("too_fast");
    if (correct > processed || phishing > correct) return bad("proof");
    // a card takes at least ~0.3s to swipe
    if (processed > elapsed * 3.5 + 3) return bad("too_fast");
    // best case per email: 100 × 5 (combo) + 50 (instant) + 150 (phishing bonus)
    if (score > correct * 550 + phishing * 150) return bad("mismatch");
    return { ok: true, score };
  },

  "deadline-dash": ({ score, proof, wall }) => {
    const p = proof as Record<string, unknown> | null;
    const t = num(p?.t, 3600);
    const dist = num(p?.dist, 5_000_000);
    const coffees = num(p?.coffees, 10_000);
    const smashed = num(p?.smashed, 10_000);
    if (t === null || dist === null || coffees === null || smashed === null) return bad("proof");
    if (t > wall + SLACK) return bad("too_fast");
    // top speed 620 px/s × 1.35 turbo
    if (dist > t * 620 * 1.35 + 50) return bad("too_far");
    // at most about one pattern (one coffee, two boxes) per second
    if (coffees > t * 1.5 + 2 || smashed > t * 2 + 2) return bad("proof");
    if (score !== Math.floor(dist / 40) + coffees * 25 + smashed * 10) return bad("mismatch");
    return { ok: true, score };
  },

  "pixel-dodge": ({ score, proof, wall }) => {
    const p = proof as Record<string, unknown> | null;
    const t = num(p?.t, 3600);
    const grazes = num(p?.grazes, 100_000);
    if (t === null || grazes === null || !Number.isInteger(grazes)) return bad("proof");
    if (t > wall + SLACK) return bad("too_fast");
    if (grazes > t * 8 + 5) return bad("proof");
    if (score !== Math.round(t * 100) + grazes * 25) return bad("mismatch");
    return { ok: true, score };
  },
};
