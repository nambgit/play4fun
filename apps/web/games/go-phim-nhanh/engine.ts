/**
 * Gõ phím thần tốc — pure game logic (no React / DOM).
 *
 * Flow: a round deals shuffled passages one after another. The player types the
 * current word and presses Space to submit it; a word is correct only if it matches
 * exactly (diacritics included). The clock starts on the first keystroke.
 *
 * Vietnamese IMEs (Telex / VNI, Unikey, EVKey, OS keyboards) build a letter in steps
 * ("e" → "ê" → "ệ"), so while a word is in progress a letter that matches the target
 * once accents are stripped is shown as "pending", not as an error.
 */
import { PASSAGES, type Lang, type Passage } from "./content";

export const ROUND_SECONDS = 60;

export type WordResult = { typed: string; correct: boolean };

export type GameState = {
  lang: Lang;
  deck: Passage[];
  deckIdx: number;
  /** Passage ids the player actually saw this round (for the "recently seen" memory) */
  dealt: string[];

  words: string[];
  done: WordResult[];
  typed: string;

  started: boolean;
  elapsed: number;
  timeLeft: number;
  over: boolean;

  /** Characters of correctly typed words (+1 for each following space) — the WPM basis */
  correctChars: number;
  /** Per-character accuracy over submitted words */
  matchedChars: number;
  judgedChars: number;
  correctWords: number;
  wrongWords: number;
  passagesDone: number;
  /** Every submitted word, in order — the server re-grades the round from this + `dealt` */
  log: string[];
};

// ------------------------------------------------------------ helpers

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

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const nfc = (s: string) => s.normalize("NFC");

/** Strip Vietnamese diacritics: "Việt" → "Viet", "đ" → "d" */
export function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

const splitWords = (text: string) => nfc(text).trim().split(/\s+/);

// ------------------------------------------------------------ setup

/**
 * @param recentlySeen passage ids from the player's last rounds — dealt only after every unseen passage
 */
export function createGame(lang: Lang, seed = Date.now(), recentlySeen: ReadonlySet<string> = new Set()): GameState {
  const shuffled = shuffle(PASSAGES[lang], makeRng(seed));
  const deck = [...shuffled.filter((p) => !recentlySeen.has(p.id)), ...shuffled.filter((p) => recentlySeen.has(p.id))];
  return {
    lang,
    deck,
    deckIdx: 0,
    dealt: [deck[0].id],
    words: splitWords(deck[0].text),
    done: [],
    typed: "",
    started: false,
    elapsed: 0,
    timeLeft: ROUND_SECONDS,
    over: false,
    correctChars: 0,
    matchedChars: 0,
    judgedChars: 0,
    correctWords: 0,
    wrongWords: 0,
    passagesDone: 0,
    log: [],
  };
}

function nextPassage(s: GameState) {
  s.passagesDone++;
  s.deckIdx = (s.deckIdx + 1) % s.deck.length;
  const p = s.deck[s.deckIdx];
  s.dealt.push(p.id);
  s.words = splitWords(p.text);
  s.done = [];
}

// ------------------------------------------------------------ actions

export function tick(s: GameState, dt: number) {
  if (!s.started || s.over) return;
  s.elapsed += dt;
  s.timeLeft = Math.max(0, ROUND_SECONDS - s.elapsed);
  if (s.timeLeft === 0) s.over = true;
}

export const currentWord = (s: GameState) => s.words[s.done.length] ?? "";

function submit(s: GameState, raw: string) {
  const typed = nfc(raw);
  const target = currentWord(s);
  const correct = typed === target;
  let matched = 0;
  for (let i = 0; i < Math.min(typed.length, target.length); i++) if (typed[i] === target[i]) matched++;
  s.matchedChars += matched;
  s.judgedChars += Math.max(typed.length, target.length);
  if (correct) {
    s.correctWords++;
    s.correctChars += target.length + 1;
  } else {
    s.wrongWords++;
  }
  s.done.push({ typed, correct });
  s.log.push(typed);
  if (s.done.length >= s.words.length) nextPassage(s);
}

/**
 * Feed the raw input box value. Returns what should remain in the box
 * (everything after the last submitted word).
 * @param composing true while an IME composition is open — never submit mid-composition
 */
export function input(s: GameState, value: string, composing = false): string {
  if (s.over) return "";
  if (!s.started && value.trim() !== "") s.started = true;

  if (composing) {
    s.typed = value;
    return value;
  }

  // Every whitespace-terminated chunk is a submitted word (handles fast typing and mobile keyboards)
  const parts = value.split(/\s/);
  const rest = parts.pop() ?? "";
  for (const part of parts) {
    if (part === "") continue; // leading/double spaces do nothing
    submit(s, part);
    if (s.over) return "";
  }

  // The last word of a passage auto-submits once it is exactly right (no trailing space needed)
  const isLastWord = s.done.length === s.words.length - 1;
  if (isLastWord && rest !== "" && nfc(rest) === currentWord(s)) {
    submit(s, rest);
    s.typed = "";
    return "";
  }

  s.typed = rest;
  return rest;
}

// ------------------------------------------------------------ scoring

export function wpm(s: Pick<GameState, "correctChars" | "elapsed">) {
  if (s.elapsed < 0.5) return 0;
  return Math.round(s.correctChars / 5 / (Math.max(s.elapsed, 1) / 60));
}

export function accuracy(s: Pick<GameState, "matchedChars" | "judgedChars">) {
  return s.judgedChars ? Math.round((s.matchedChars / s.judgedChars) * 100) : 100;
}

export type CharState = "correct" | "pending" | "wrong" | "untyped";

/** Per-letter state of the word being typed, plus any extra letters typed past its end */
export function charStates(target: string, typedRaw: string): { states: CharState[]; extra: string } {
  const typed = nfc(typedRaw);
  const states: CharState[] = [];
  for (let i = 0; i < target.length; i++) {
    if (i >= typed.length) states.push("untyped");
    else if (typed[i] === target[i]) states.push("correct");
    else if (fold(typed[i]) === fold(target[i])) states.push("pending");
    else states.push("wrong");
  }
  return { states, extra: typed.slice(target.length) };
}

// ------------------------------------------------------------ server-side check

/**
 * Re-grade a finished round (the server never trusts the WPM a browser reports).
 * @param dealt passage ids in the order they were dealt
 * @param log every submitted word, in order
 * @returns WPM for a full ROUND_SECONDS round, or null if the round is impossible
 */
export function regrade(lang: Lang, dealt: readonly string[], log: readonly string[]): number | null {
  const byId = new Map(PASSAGES[lang].map((p) => [p.id, p]));
  let w = 0;
  let correctChars = 0;
  for (let i = 0; i < dealt.length; i++) {
    const p = byId.get(dealt[i]);
    if (!p) return null;
    const words = splitWords(p.text);
    const n = Math.min(words.length, log.length - w);
    // every passage but the last must have been finished before the next was dealt
    if (i < dealt.length - 1 && n < words.length) return null;
    for (let j = 0; j < n; j++, w++) if (nfc(log[w]) === words[j]) correctChars += words[j].length + 1;
  }
  if (w !== log.length) return null;
  return Math.round(correctChars / 5 / (ROUND_SECONDS / 60));
}

/** Passage order of a seeded round with no "recently seen" reordering (daily challenge) */
export const seededOrder = (lang: Lang, seed: number) => createGame(lang, seed).deck.map((p) => p.id);

const TITLES: [number, string][] = [
  [20, "Gõ mổ cò"],
  [30, "Tập sự bàn phím"],
  [40, "Dân văn phòng chuẩn"],
  [55, "Thư ký thần tốc"],
  [70, "Bàn phím bốc khói"],
  [Infinity, "Huyền thoại mười ngón"],
];

export function titleFor(speed: number) {
  return TITLES.find(([max]) => speed < max)![1];
}
