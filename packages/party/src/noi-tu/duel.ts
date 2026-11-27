/**
 * Nối từ đối kháng — rules of one round, shared by the realtime server (online duels) and the
 * web's vs-computer mode. Pure logic: no timers, no I/O.
 *
 * A round opens with a random common word. Players alternate; on your turn you type the second
 * syllable of a word starting with the last syllable of the previous word. Words cannot repeat
 * in a round. You lose the round if your time runs out or you give up — and you WIN it if the
 * word you played leaves the opponent no possible answer ("làm đối thủ bí").
 */
import { continuable, followers, isCore, lastSyllable, lookup, norm, preferCore } from "./dict";

export type Side = 0 | 1;
export const other = (s: Side): Side => (s === 0 ? 1 : 0);

export type EndReason = "stuck" | "timeout" | "skip";

export type DuelRound = {
  /** by: null for the opening word */
  chain: { word: string; by: Side | null }[];
  used: Set<string>;
  /** Syllable the next word must start with */
  need: string;
  turn: Side;
  winner: Side | null;
  reason: EndReason | null;
};

export type PlayError = "turn" | "empty" | "unknown" | "used";
export type PlayResult = { ok: true; word: string } | { ok: false; error: PlayError; word?: string };

export const PLAY_ERROR_TEXT: Record<Exclude<PlayError, "turn">, (w: string) => string> = {
  empty: () => "Gõ tiếng thứ hai của từ nhé",
  unknown: (w) => `“${w}” chưa có trong từ điển`,
  used: (w) => `“${w}” đã dùng rồi`,
};

/** Start a round with a common word that is easy to continue; `starter` answers first */
export function openRound(starter: Side, rng: () => number): DuelRound {
  const used = new Set<string>();
  const pool = continuable(
    preferCore(
      // Any common word works as an opening; sample a slice to keep this cheap
      sample(rng),
    ),
    used,
    3,
  );
  const word = pool[Math.floor(rng() * pool.length)] ?? "học sinh";
  used.add(word);
  return { chain: [{ word, by: null }], used, need: lastSyllable(word), turn: starter, winner: null, reason: null };
}

/** A few hundred random common words (opening candidates) */
function sample(rng: () => number) {
  const starts = ["học", "bạn", "nhà", "người", "sinh", "hoa", "mặt", "trời", "đất", "nước", "công", "tình", "cây", "tay", "bàn", "đường", "thành", "văn", "năm", "ngày"];
  const out: string[] = [];
  for (const s of starts) out.push(...followers(s, new Set()));
  // Shuffle lightly so the opening differs each round
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.filter(isCore).slice(0, 300);
}

/** The player on `side` types the second syllable. On success the turn passes (or the round ends). */
export function playWord(r: DuelRound, side: Side, typed: string): PlayResult {
  if (r.winner !== null || side !== r.turn) return { ok: false, error: "turn" };
  const tail = norm(typed).split(" ").filter(Boolean).pop() ?? "";
  if (!tail) return { ok: false, error: "empty" };
  const attempt = `${r.need} ${tail}`;
  const word = lookup(attempt);
  if (!word) return { ok: false, error: "unknown", word: attempt };
  if (r.used.has(word)) return { ok: false, error: "used", word };
  r.used.add(word);
  r.chain.push({ word, by: side });
  r.need = lastSyllable(word);
  if (followers(r.need, r.used).length === 0) {
    r.winner = side;
    r.reason = "stuck";
  } else r.turn = other(side);
  return { ok: true, word };
}

/** The player whose turn it is ran out of time or gave up */
export function loseTurn(r: DuelRound, reason: "timeout" | "skip") {
  if (r.winner !== null) return;
  r.winner = other(r.turn);
  r.reason = reason;
}

/** Words that could have been played now (shown after a timeout / give-up) */
export const hints = (r: DuelRound, n = 3) => preferCore(followers(r.need, r.used)).slice(0, n);

export type BotLevel = "easy" | "hard";

/**
 * Computer's answer (full word) or null when it has none.
 * - easy: a common word, usually one the player can continue.
 * - hard: wins on the spot if a word leaves the player stuck, otherwise picks the word that
 *   leaves the fewest answers.
 */
export function botPick(r: DuelRound, level: BotLevel, rng: () => number): string | null {
  const options = followers(r.need, r.used);
  if (!options.length) return null;
  const pick = (ws: string[]) => ws[Math.floor(rng() * ws.length)];
  const answersAfter = (w: string) => followers(lastSyllable(w), r.used).filter((f) => f !== w).length;
  if (level === "easy") {
    const fair = preferCore(options.filter((w) => answersAfter(w) >= 2));
    return pick(fair.length ? fair : preferCore(options));
  }
  // Only common words, so the computer does not win with obscure dead ends the player never heard of,
  // and not every time it could: a hard opponent that is still beatable
  const core = options.filter(isCore);
  const killers = core.filter((w) => answersAfter(w) === 0);
  if (killers.length && rng() < 0.35) return pick(killers);
  const open = core.filter((w) => answersAfter(w) > 0);
  if (!open.length) return pick(core.length ? core : options);
  const scored = open.map((w) => [w, answersAfter(w)] as const).sort((a, b) => a[1] - b[1]);
  const best = scored.slice(0, Math.max(1, Math.ceil(scored.length / 3))).map(([w]) => w);
  return pick(best);
}
