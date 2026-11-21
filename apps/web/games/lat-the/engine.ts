/**
 * Nhớ thẻ bài — memory / matching pairs (pure logic, no React / DOM).
 *
 * Four levels with growing boards. Flip two cards: a pair stays face up, otherwise both turn
 * back after a short look. Clear all four levels; the score is the total time (lower is
 * better), moves are shown too. Pictures are Vietnamese-themed emoji.
 */

export const PICTURES = ["🍜", "🥖", "🥭", "🥥", "🍵", "🏮", "🛵", "🐃", "🌾", "🎋", "🐉", "☕", "🍉", "🦐", "🌶️", "🍍", "🐟", "🌸", "🎆", "🧧"] as const;

/** cols × rows per level (cards = cols × rows, always even) */
export const LEVELS: [cols: number, rows: number][] = [
  [4, 3],
  [4, 4],
  [4, 5],
  [4, 6],
];

/** How long a wrong pair stays visible, seconds */
export const PEEK_SECONDS = 0.8;

export type Card = { id: number; pic: string; up: boolean; matched: boolean };

export type GameState = {
  level: number;
  cards: Card[];
  /** indexes of face-up unmatched cards (0–2) */
  open: number[];
  /** while > 0 a wrong pair is shown and input is ignored */
  peek: number;
  moves: number;
  /** seconds spent, all levels so far */
  elapsed: number;
  levelDone: boolean;
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

function shuffle<T>(arr: readonly T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function deal(level: number, rng: () => number): Card[] {
  const [cols, rows] = LEVELS[level];
  const pics = shuffle(PICTURES, rng).slice(0, (cols * rows) / 2);
  return shuffle([...pics, ...pics], rng).map((pic, id) => ({ id, pic, up: false, matched: false }));
}

export function createGame(seed = Date.now()): GameState {
  const rng = makeRng(seed);
  return { level: 0, cards: deal(0, rng), open: [], peek: 0, moves: 0, elapsed: 0, levelDone: false, over: false, rng };
}

/** Flip a card. Returns "match" | "miss" | "flip" | "ignored". */
export function flip(s: GameState, i: number): "match" | "miss" | "flip" | "ignored" {
  const c = s.cards[i];
  if (!c || s.peek > 0 || s.levelDone || s.over || c.up || c.matched) return "ignored";
  c.up = true;
  s.open.push(i);
  if (s.open.length < 2) return "flip";
  s.moves++;
  const [a, b] = s.open.map((k) => s.cards[k]);
  if (a.pic === b.pic) {
    a.matched = b.matched = true;
    s.open = [];
    if (s.cards.every((x) => x.matched)) {
      s.levelDone = true;
      if (s.level === LEVELS.length - 1) s.over = true;
    }
    return "match";
  }
  s.peek = PEEK_SECONDS;
  return "miss";
}

export function tick(s: GameState, dt: number) {
  if (s.over || s.levelDone) return;
  s.elapsed += dt;
  if (s.peek > 0) {
    s.peek -= dt;
    if (s.peek <= 0) {
      s.peek = 0;
      for (const k of s.open) s.cards[k].up = false;
      s.open = [];
    }
  }
}

export function nextLevel(s: GameState) {
  if (!s.levelDone || s.over) return;
  s.level++;
  s.cards = deal(s.level, s.rng);
  s.open = [];
  s.levelDone = false;
}

/** Perfect play needs one move per pair; this is how close the player came */
export function accuracy(s: GameState) {
  const pairs = LEVELS.slice(0, s.level + 1).reduce((n, [c, r]) => n + (c * r) / 2, 0);
  return s.moves ? Math.round((pairs / s.moves) * 100) : 100;
}

const RANKS: [number, string][] = [
  [75, "Trí nhớ siêu phàm"],
  [110, "Trí nhớ tốt"],
  [160, "Khá ổn"],
  [Infinity, "Cần thêm chút tập trung"],
];
export const rankFor = (seconds: number) => RANKS.find(([max]) => seconds < max)![1];
