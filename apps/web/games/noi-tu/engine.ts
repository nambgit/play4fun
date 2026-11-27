/**
 * Nối từ — Vietnamese word chain against the computer (pure logic, no React / DOM).
 *
 * Every word has two syllables; the next word must start with the last syllable of the
 * previous one ("con mèo" → "mèo mướp"). The player only types the second syllable. The
 * computer answers from the dictionary and prefers words the player can continue. A word
 * may be used once per game. Running out of time costs a heart; when the computer cannot
 * continue, the player earns a bonus and the computer starts a new chain.
 */
import { continuable, coreWords, dictionarySize as DICT_SIZE, followers, lastSyllable, lookup, norm, preferCore } from "@play4fun/party/noi-tu";

export { norm, sylKey } from "@play4fun/party/noi-tu";
export { lastSyllable };

export const MAX_LIVES = 3;
const FIRST_TURN_S = 15;
const MIN_TURN_S = 8;
const BOT_BONUS = 3;

export type Entry = { word: string; by: "bot" | "me" };
export type Feedback = { text: string; good: boolean; t: number };

export type GameState = {
  chain: Entry[];
  used: Set<string>;
  /** Syllable the player's word must start with */
  need: string;
  timeLeft: number;
  turnTotal: number;
  lives: number;
  score: number;
  myWords: number;
  botStuck: number;
  feedback: Feedback | null;
  /** After a timeout / skip: what could have been said */
  missed: { syl: string; ex: string[] } | null;
  over: boolean;
  rng: () => number;
};

function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const unusedFollowers = (s: GameState, syl: string) => followers(syl, s.used);

/** Words the player can continue after (at least two unused followers): a fair turn */
const playable = (s: GameState, words: string[]) => continuable(words, s.used, 2);

function botSay(s: GameState, word: string) {
  s.used.add(word);
  s.chain.push({ word, by: "bot" });
  s.need = lastSyllable(word);
  s.turnTotal = Math.max(MIN_TURN_S, FIRST_TURN_S - s.myWords * 0.35);
  s.timeLeft = s.turnTotal;
}

/** Computer opens a fresh chain with an easy-to-continue word */
function botOpen(s: GameState) {
  const all = coreWords();
  const starts = playable(s, all);
  const pool = starts.length ? starts : all.filter((w) => !s.used.has(w));
  botSay(s, pool[Math.floor(s.rng() * pool.length)]);
}

export function createGame(seed = Date.now()): GameState {
  const s: GameState = {
    chain: [],
    used: new Set(),
    need: "",
    timeLeft: FIRST_TURN_S,
    turnTotal: FIRST_TURN_S,
    lives: MAX_LIVES,
    score: 0,
    myWords: 0,
    botStuck: 0,
    feedback: null,
    missed: null,
    over: false,
    rng: makeRng(seed),
  };
  botOpen(s);
  return s;
}

/** Can the player still find a word? (shown as a hint when it is a dead end) */
export const answersLeft = (s: GameState) => unusedFollowers(s, s.need).length;

/**
 * The player types the second syllable. Returns "ok" | "unknown" | "used" | "empty".
 * Unknown words cost nothing: the player can try again while the clock runs.
 */
export function play(s: GameState, second: string): "ok" | "unknown" | "used" | "empty" {
  if (s.over) return "empty";
  const tail = norm(second).split(" ")[0] ?? "";
  if (!tail) return "empty";
  const typedWord = `${s.need} ${tail}`;
  const word = lookup(typedWord);
  if (!word) {
    s.feedback = { text: `“${typedWord}” chưa có trong từ điển`, good: false, t: 0 };
    return "unknown";
  }
  if (s.used.has(word)) {
    s.feedback = { text: `“${word}” đã dùng rồi`, good: false, t: 0 };
    return "used";
  }
  s.used.add(word);
  s.chain.push({ word, by: "me" });
  s.myWords++;
  s.missed = null;
  s.score += 1 + Math.floor(s.timeLeft / 5);
  const options = unusedFollowers(s, lastSyllable(word));
  // Only words the player can still continue count: trapping the player in a dead end
  // ("dở dang" — nothing starts with "dang") would just cost them a heart for nothing
  const possible = options.filter((w) => unusedFollowers(s, lastSyllable(w)).some((f) => f !== w));
  if (!possible.length) {
    s.botStuck++;
    s.score += BOT_BONUS;
    s.feedback = { text: `Máy bí rồi! +${BOT_BONUS} điểm`, good: true, t: 0 };
    botOpen(s);
    return "ok";
  }
  // The computer usually keeps the game easy to continue, sometimes it plays a harder word
  const fair = preferCore(playable(s, possible));
  const pool = fair.length && s.rng() < 0.85 ? fair : preferCore(possible);
  s.feedback = null;
  botSay(s, pool[Math.floor(s.rng() * pool.length)]);
  return "ok";
}

/** Give up on this word: lose a heart, the computer starts again */
export function skip(s: GameState) {
  if (s.over) return;
  loseLife(s, "Bỏ qua: mất 1 tim");
}

function loseLife(s: GameState, text: string) {
  s.missed = { syl: s.need, ex: preferCore(unusedFollowers(s, s.need)).slice(0, 3) };
  s.lives--;
  s.feedback = { text, good: false, t: 0 };
  if (s.lives <= 0) {
    s.lives = 0;
    s.over = true;
    return;
  }
  botOpen(s);
}

export function tick(s: GameState, dt: number) {
  if (s.over) return;
  if (s.feedback) {
    s.feedback.t += dt;
    if (s.feedback.t > 1.8) s.feedback = null;
  }
  s.timeLeft -= dt;
  if (s.timeLeft <= 0) loseLife(s, "Hết giờ: mất 1 tim");
}

/** A few words the player could have used (shown after a timeout or at the end) */
export const examples = (s: GameState, syl: string, n = 3) => preferCore(unusedFollowers(s, syl)).slice(0, n);

export const dictionarySize = DICT_SIZE;

const RANKS: [number, string][] = [
  [10, "Mới khởi động"],
  [25, "Vốn từ khá"],
  [45, "Từ điển sống"],
  [Infinity, "Vua nối từ"],
];
export const rankFor = (score: number) => RANKS.find(([max]) => score < max)![1];
