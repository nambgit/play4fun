/**
 * Nối từ (online, 2–10 players, and vs computer) — rules of one round, shared by the realtime
 * server and the web's vs-computer mode. Pure logic: no timers, no I/O.
 *
 * A round opens with a random common word. Players take turns in seat order; on your turn you
 * type the second syllable of a word starting with the last syllable of the previous word.
 * Words cannot repeat in a round.
 * - Running out of time or giving up knocks you out of the round; the next player answers the
 *   same syllable.
 * - If the word you played leaves no possible answer, the next player is knocked out ("làm đối
 *   thủ bí") and a fresh word opens for the players still in.
 * The last player standing wins the round. With two players this is a plain duel.
 */
import { continuable, followers, isCore, lastSyllable, lookup, norm, preferCore } from "./dict";

export type EndReason = "stuck" | "timeout" | "skip" | "left";

export type DuelRound = {
  /** by: seat index, null for an opening word */
  chain: { word: string; by: number | null }[];
  used: Set<string>;
  /** Syllable the next word must start with */
  need: string;
  /** Seat whose turn it is */
  turn: number;
  /** Still in this round, per seat */
  alive: boolean[];
  winner: number | null;
  /** How the last player before the winner went out */
  reason: EndReason | null;
  /** Knock-outs this round, in order */
  out: { seat: number; reason: EndReason }[];
};

export type PlayError = "turn" | "empty" | "unknown" | "used";
export type PlayResult = { ok: true; word: string } | { ok: false; error: PlayError; word?: string };

export const PLAY_ERROR_TEXT: Record<Exclude<PlayError, "turn">, (w: string) => string> = {
  empty: () => "Gõ tiếng thứ hai của từ nhé",
  unknown: (w) => `“${w}” chưa có trong từ điển`,
  used: (w) => `“${w}” đã dùng rồi`,
};

/** A few hundred random common words that are easy to continue (opening candidates) */
function openingWord(rng: () => number, used: ReadonlySet<string>) {
  const starts = ["học", "bạn", "nhà", "người", "sinh", "hoa", "mặt", "trời", "đất", "nước", "công", "tình", "cây", "tay", "bàn", "đường", "thành", "văn", "năm", "ngày"];
  const out: string[] = [];
  for (const s of starts) out.push(...followers(s, used));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  const pool = continuable(out.filter(isCore).slice(0, 300), used, 3);
  return pool[Math.floor(rng() * pool.length)] ?? out.find((w) => !used.has(w)) ?? "học sinh";
}

function addOpening(r: DuelRound, rng: () => number) {
  const word = openingWord(rng, r.used);
  r.used.add(word);
  r.chain.push({ word, by: null });
  r.need = lastSyllable(word);
}

/**
 * Start a round for `players` seats; `starter` answers first. Seats listed in `absent` (left the
 * room) sit the round out.
 */
export function openRound(players: number, starter: number, rng: () => number, absent: ReadonlySet<number> = new Set()): DuelRound {
  const alive = Array.from({ length: players }, (_, i) => !absent.has(i));
  const r: DuelRound = { chain: [], used: new Set(), need: "", turn: starter, alive, winner: null, reason: null, out: [] };
  if (!alive[starter]) r.turn = nextAlive(r, starter);
  addOpening(r, rng);
  return r;
}

/** Next seat still in the round after `from` (wrapping around) */
export function nextAlive(r: DuelRound, from: number): number {
  const n = r.alive.length;
  for (let k = 1; k <= n; k++) {
    const s = (from + k) % n;
    if (r.alive[s]) return s;
  }
  return from;
}

export const aliveCount = (r: DuelRound) => r.alive.filter(Boolean).length;

/** Knock a seat out; ends the round when one player is left */
function knockOut(r: DuelRound, seat: number, reason: EndReason) {
  if (!r.alive[seat] || r.winner !== null) return;
  r.alive[seat] = false;
  r.out.push({ seat, reason });
  if (aliveCount(r) === 1) {
    r.winner = r.alive.indexOf(true);
    r.reason = reason;
  }
}

/** The player on `seat` types the second syllable. On success the turn passes (or players go out). */
export function playWord(r: DuelRound, seat: number, typed: string, rng: () => number = Math.random): PlayResult {
  if (r.winner !== null || seat !== r.turn) return { ok: false, error: "turn" };
  const tail = norm(typed).split(" ").filter(Boolean).pop() ?? "";
  if (!tail) return { ok: false, error: "empty" };
  const attempt = `${r.need} ${tail}`;
  const word = lookup(attempt);
  if (!word) return { ok: false, error: "unknown", word: attempt };
  if (r.used.has(word)) return { ok: false, error: "used", word };
  r.used.add(word);
  r.chain.push({ word, by: seat });
  r.need = lastSyllable(word);
  const next = nextAlive(r, seat);
  if (followers(r.need, r.used).length === 0) {
    // Nobody can answer: the next player is out, the others continue with a fresh word
    knockOut(r, next, "stuck");
    if (r.winner === null) {
      addOpening(r, rng);
      r.turn = nextAlive(r, next);
    }
  } else r.turn = next;
  return { ok: true, word };
}

/** The player whose turn it is ran out of time or gave up: out of the round, next player answers */
export function loseTurn(r: DuelRound, reason: "timeout" | "skip") {
  if (r.winner !== null) return;
  const seat = r.turn;
  knockOut(r, seat, reason);
  if (r.winner === null) r.turn = nextAlive(r, seat);
}

/** A player left the room for good */
export function leaveRound(r: DuelRound, seat: number) {
  if (r.winner !== null || !r.alive[seat]) return;
  const wasTurn = r.turn === seat;
  knockOut(r, seat, "left");
  if (r.winner === null && wasTurn) r.turn = nextAlive(r, seat);
}

/** Words that could have been played now (shown after a knock-out) */
export const hints = (r: DuelRound, n = 3) => preferCore(followers(r.need, r.used)).slice(0, n);

export type BotLevel = "easy" | "hard";

/**
 * Computer's answer (full word) or null when it has none.
 * - easy: a common word, usually one the player can continue.
 * - hard: sometimes plays a common word that leaves the player stuck, otherwise picks words
 *   that leave few answers.
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
