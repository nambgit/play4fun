/**
 * Inbox Zero — pure game logic. One email at a time; each has a "patience" timer that
 * shrinks as the round goes on. Seeded RNG so a daily challenge deals the same inbox to everyone.
 */
import { EMAILS, type Answer, type Category, type Email, type PowerUp } from "./content";

export const ROUND_SECONDS = 60;
export const MAX_LIVES = 3;
export const FORWARD_UNLOCK_AT = 15;
const COFFEE_BONUS = 5;
const PHISHING_BONUS = 150;

export type Action = Answer;
export type Mode = "daily" | "free";

export type Card =
  | { kind: "email"; uid: number; email: Email; patience: number; total: number; time: string }
  | { kind: "power"; uid: number; power: PowerUp; patience: number; total: number };

/** fast = correct with >60% patience left */
export type Outcome = "fast" | "ok" | "bad" | "power";

export type Feedback = { text: string; good: boolean; t: number };

export type GameState = {
  mode: Mode;
  elapsed: number;
  timeLeft: number;
  lives: number;
  combo: number;
  bestCombo: number;
  score: number;
  processed: number;
  correct: number;
  phishingCaught: number;
  card: Card | null;
  uid: number;
  outcomes: Outcome[];
  over: boolean;
  overReason: "time" | "lives" | null;
  forwardUnlocked: boolean;
  unlockFlash: number;
  feedback: Feedback | null;
  sinceLastPower: number;
  rng: () => number;
  decks: Record<Category, { cards: Email[]; i: number }>;
};

export type ActResult = { correct: boolean; card: Card } | null;

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

export function multiplier(combo: number) {
  return Math.min(5, 1 + Math.floor(combo / 5));
}

export function createGame(seed: number, mode: Mode): GameState {
  const rng = makeRng(seed);
  const byCat = (c: Category) => ({ cards: shuffle(EMAILS.filter((e) => e.category === c), rng), i: 0 });
  const s: GameState = {
    mode,
    elapsed: 0,
    timeLeft: ROUND_SECONDS,
    lives: MAX_LIVES,
    combo: 0,
    bestCombo: 0,
    score: 0,
    processed: 0,
    correct: 0,
    phishingCaught: 0,
    card: null,
    uid: 0,
    outcomes: [],
    over: false,
    overReason: null,
    forwardUnlocked: false,
    unlockFlash: 0,
    feedback: null,
    sinceLastPower: 0,
    rng,
    decks: { handle: byCat("handle"), delete: byCat("delete"), forward: byCat("forward"), phishing: byCat("phishing") },
  };
  nextCard(s);
  return s;
}

/** Seconds the player has for the current email; 5.2s at start → 2.2s at the end of the round */
const patienceFor = (elapsed: number) => Math.max(2.2, 5.2 - elapsed * 0.05);

function draw(s: GameState, c: Category): Email {
  const deck = s.decks[c];
  if (deck.i >= deck.cards.length) {
    deck.cards = shuffle(deck.cards, s.rng);
    deck.i = 0;
  }
  return deck.cards[deck.i++];
}

function clockLabel(processed: number) {
  const minutes = 8 * 60 + 30 + processed * 7; // inbox opens at 08:30, ~7 min per email
  const h = Math.floor(minutes / 60) % 24;
  return `${String(h).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function nextCard(s: GameState) {
  const r = s.rng();
  s.uid++;
  s.sinceLastPower++;

  if (s.elapsed > 8 && s.sinceLastPower > 8 && r < 0.08) {
    s.sinceLastPower = 0;
    const power: PowerUp = s.lives < MAX_LIVES && s.rng() < 0.5 ? "leave" : "coffee";
    s.card = { kind: "power", uid: s.uid, power, patience: 2.5, total: 2.5 };
    return;
  }

  const pPhishing = Math.min(0.24, 0.06 + s.elapsed * 0.003);
  const pForward = s.forwardUnlocked ? 0.2 : 0;
  const roll = s.rng();
  let category: Category;
  if (roll < pPhishing) category = "phishing";
  else if (roll < pPhishing + pForward) category = "forward";
  else category = s.rng() < 0.55 ? "handle" : "delete";

  const total = patienceFor(s.elapsed);
  s.card = { kind: "email", uid: s.uid, email: draw(s, category), patience: total, total, time: clockLabel(s.processed) };
}

function mistake(s: GameState, text: string) {
  s.lives--;
  s.combo = 0;
  s.outcomes.push("bad");
  s.feedback = { text, good: false, t: 2.2 };
  if (s.lives <= 0) {
    s.over = true;
    s.overReason = "lives";
  }
}

export function tick(s: GameState, dt: number) {
  if (s.over) return;
  s.elapsed += dt;
  s.timeLeft -= dt;
  s.unlockFlash = Math.max(0, s.unlockFlash - dt);
  if (s.feedback) {
    s.feedback.t -= dt;
    if (s.feedback.t <= 0) s.feedback = null;
  }

  if (!s.forwardUnlocked && s.elapsed >= FORWARD_UNLOCK_AT) {
    s.forwardUnlocked = true;
    s.unlockFlash = 3;
  }

  if (s.timeLeft <= 0) {
    s.timeLeft = 0;
    s.over = true;
    s.overReason = "time";
    return;
  }

  const card = s.card;
  if (!card) return;
  card.patience -= dt;
  if (card.patience <= 0) {
    if (card.kind === "email") {
      s.processed++;
      mistake(s, "Hết giờ! Email bị bỏ lỡ — sếp đang hỏi đấy.");
    }
    if (!s.over) nextCard(s);
  }
}

export function act(s: GameState, action: Action): ActResult {
  const card = s.card;
  if (!card || s.over) return null;
  if (action === "forward" && !s.forwardUnlocked) return null;

  if (card.kind === "power") {
    if (card.power === "coffee") {
      s.timeLeft += COFFEE_BONUS;
      s.feedback = { text: "☕ +5 giây! Tỉnh cả người.", good: true, t: 1.4 };
    } else {
      s.lives = Math.min(MAX_LIVES, s.lives + 1);
      s.feedback = { text: "🏖️ Nghỉ phép xong, hồi 1 tim!", good: true, t: 1.4 };
    }
    s.outcomes.push("power");
    nextCard(s);
    return { correct: true, card };
  }

  s.processed++;
  const correct = action === card.email.answer;
  if (correct) {
    const fast = card.patience / card.total > 0.6;
    s.correct++;
    s.combo++;
    s.bestCombo = Math.max(s.bestCombo, s.combo);
    s.score += 100 * multiplier(s.combo) + Math.round((card.patience / card.total) * 50);
    s.outcomes.push(fast ? "fast" : "ok");
    if (card.email.category === "phishing") {
      s.phishingCaught++;
      s.score += PHISHING_BONUS;
      s.feedback = { text: `🎣 Bắt được email lừa đảo! +${PHISHING_BONUS}`, good: true, t: 1.6 };
    }
  } else {
    mistake(s, card.email.reason);
  }

  if (!s.over) nextCard(s);
  return { correct, card };
}

export function accuracy(s: GameState) {
  return s.processed === 0 ? 0 : Math.round((s.correct / s.processed) * 100);
}

/** Title by correctly handled emails (score inflates fast with the combo multiplier) */
const TITLES: [number, string][] = [
  [55, "Huyền thoại Inbox Zero"],
  [40, "Trợ lý ảo đời thật"],
  [28, "Trưởng nhóm gánh team"],
  [14, "Nhân viên chăm chỉ"],
  [0, "Thực tập sinh lơ ngơ"],
];

export function titleFor(correctEmails: number) {
  return TITLES.find(([min]) => correctEmails >= min)![1];
}

const EMOJI: Record<Outcome, string> = { fast: "⚡", ok: "✅", bad: "❌", power: "☕" };

/** Wordle-style result grid, rows of 10, capped at 40 cells */
export function emojiGrid(outcomes: Outcome[]) {
  const cells = outcomes.slice(0, 40).map((o) => EMOJI[o]);
  const rows: string[] = [];
  for (let i = 0; i < cells.length; i += 10) rows.push(cells.slice(i, i + 10).join(""));
  return rows.join("\n");
}

// ------------------------------------------------------------ daily challenge

const LAUNCH_UTC = Date.UTC(2026, 10, 19); // 19/11/2026 = thử thách #1

/** Local calendar date → { key: "2026-11-19", number: 1, seed } */
export function dailyInfo(now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const number = Math.max(1, Math.floor((Date.UTC(y, m, d) - LAUNCH_UTC) / 86_400_000) + 1);
  const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  return { key, number, seed: y * 10_000 + (m + 1) * 100 + d };
}
