/**
 * Kiểm tra 15 phút — mental-math sprint (pure logic, no React / DOM).
 *
 * The clock drains in real time; every correct answer buys a few seconds (less as the
 * level rises), every wrong answer costs a heart. Questions are generated, never drawn
 * from a fixed list, and a question already asked this round is never asked again.
 * Answers are always whole numbers ≥ 0.
 */

export const START_SECONDS = 12;
export const MAX_SECONDS = 15;
export const MAX_LIVES = 3;
/** Wrong answers show the right one for this long; the clock is paused meanwhile */
export const REVEAL_SECONDS = 1.1;
/** Correct answers needed for a 10 */
export const PERFECT_AT = 30;

export type Question = { text: string; answer: number; level: number };
export type Mark = "ok" | "bad";

export type GameState = {
  rng: () => number;
  q: Question;
  typed: string;
  timeLeft: number;
  elapsed: number;
  lives: number;
  correct: number;
  wrong: number;
  streak: number;
  bestStreak: number;
  marks: Mark[];
  asked: Set<string>;
  /** Shown after an answer; while `reveal` > 0 input is ignored and the clock is paused */
  feedback: { good: boolean; text: string; t: number } | null;
  reveal: number;
  /** Seconds added by the last correct answer (for the "+2s" pop) */
  bonus: { amount: number; t: number } | null;
  over: boolean;
  overReason: "time" | "lives" | null;
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

const int = (rng: () => number, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));
const pick = <T>(rng: () => number, arr: readonly T[]) => arr[Math.floor(rng() * arr.length)];

/** Level from the number of correct answers so far */
export function levelFor(correct: number) {
  if (correct < 5) return 1;
  if (correct < 10) return 2;
  if (correct < 15) return 3;
  if (correct < 20) return 4;
  if (correct < 30) return 5;
  return 6;
}

/** Seconds won by a correct answer: generous early, tight later */
export const bonusFor = (level: number) => Math.max(1.3, 3.2 - level * 0.35);

// ------------------------------------------------------------ question generators

type Gen = (rng: () => number) => Omit<Question, "level">;

const add = (a: number, b: number) => ({ text: `${a} + ${b}`, answer: a + b });
const sub = (a: number, b: number) => ({ text: `${a} − ${b}`, answer: a - b });
const mul = (a: number, b: number) => ({ text: `${a} × ${b}`, answer: a * b });
const div = (a: number, b: number) => ({ text: `${a * b} : ${b}`, answer: a });

const L1: Gen[] = [
  (r) => add(int(r, 1, 9), int(r, 1, 9)),
  (r) => {
    const a = int(r, 5, 18);
    return sub(a, int(r, 1, Math.min(9, a)));
  },
];

const L2: Gen[] = [
  (r) => add(int(r, 11, 49), int(r, 2, 9)),
  (r) => {
    const a = int(r, 20, 60);
    return sub(a, int(r, 2, 9));
  },
  (r) => mul(int(r, 2, 5), int(r, 2, 9)),
];

const L3: Gen[] = [
  (r) => add(int(r, 12, 69), int(r, 12, 39)),
  (r) => {
    const a = int(r, 40, 99);
    return sub(a, int(r, 11, a - 5));
  },
  (r) => mul(int(r, 3, 9), int(r, 3, 9)),
];

const L4: Gen[] = [
  (r) => div(int(r, 2, 9), int(r, 2, 9)),
  (r) => mul(int(r, 11, 19), int(r, 2, 5)),
  // Missing operand: ? + b = c
  (r) => {
    const x = int(r, 3, 30);
    const b = int(r, 4, 25);
    return { text: `? + ${b} = ${x + b}`, answer: x };
  },
  (r) => {
    const x = int(r, 2, 9);
    const b = int(r, 2, 9);
    return { text: `? × ${b} = ${x * b}`, answer: x };
  },
];

const L5: Gen[] = [
  // Order of operations: multiply first
  (r) => {
    const a = int(r, 2, 20);
    const b = int(r, 2, 9);
    const c = int(r, 2, 9);
    return { text: `${a} + ${b} × ${c}`, answer: a + b * c };
  },
  (r) => {
    const b = int(r, 3, 9);
    const c = int(r, 3, 9);
    const a = int(r, 1, b * c - 1);
    return { text: `${b} × ${c} − ${a}`, answer: b * c - a };
  },
  (r) => {
    const n = int(r, 11, 15);
    return { text: `${n}²`, answer: n * n };
  },
  (r) => {
    const base = pick(r, [20, 40, 60, 80, 120, 150, 200, 300, 500]);
    const pct = pick(r, [10, 25, 50]);
    return (base * pct) % 100 === 0 ? { text: `${pct}% của ${base}`, answer: (base * pct) / 100 } : { text: `10% của ${base}`, answer: base / 10 };
  },
  (r) => add(int(r, 45, 199), int(r, 45, 199)),
];

const L6: Gen[] = [
  (r) => mul(int(r, 21, 99), int(r, 3, 9)),
  (r) => div(int(r, 12, 49), int(r, 3, 9)),
  (r) => {
    const a = int(r, 2, 9);
    const b = int(r, 2, 9);
    const c = int(r, 2, 9);
    const d = int(r, 2, 9);
    return { text: `${a} × ${b} + ${c} × ${d}`, answer: a * b + c * d };
  },
  (r) => {
    const a = int(r, 120, 500);
    return sub(a, int(r, 35, a - 20));
  },
  (r) => {
    const x = int(r, 4, 12);
    const b = int(r, 3, 9);
    const c = int(r, 2, 30);
    return { text: `? × ${b} − ${c} = ${x * b - c}`, answer: x };
  },
];

const BY_LEVEL: Record<number, Gen[]> = { 1: L1, 2: L2, 3: L3, 4: L4, 5: L5, 6: L6 };

/** New question for the level, mixing in easier kinds now and then, never one asked this round */
export function makeQuestion(rng: () => number, level: number, asked: Set<string>): Question {
  for (let tries = 0; tries < 60; tries++) {
    // 25% of the time, draw from the previous level to keep a rhythm
    const lv = level > 1 && rng() < 0.25 ? level - 1 : level;
    const q = pick(rng, BY_LEVEL[lv])(rng);
    if (q.answer < 0 || !Number.isInteger(q.answer) || asked.has(q.text)) continue;
    asked.add(q.text);
    return { ...q, level };
  }
  // Practically unreachable: the generators have thousands of combinations
  const q = add(int(rng, 100, 999), int(rng, 100, 999));
  return { ...q, level };
}

// ------------------------------------------------------------ game

export function createGame(seed = Date.now()): GameState {
  const rng = makeRng(seed);
  const asked = new Set<string>();
  return {
    rng,
    q: makeQuestion(rng, 1, asked),
    typed: "",
    timeLeft: START_SECONDS,
    elapsed: 0,
    lives: MAX_LIVES,
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
    marks: [],
    asked,
    feedback: null,
    reveal: 0,
    bonus: null,
    over: false,
    overReason: null,
  };
}

function next(s: GameState) {
  s.q = makeQuestion(s.rng, levelFor(s.correct), s.asked);
  s.typed = "";
}

function finish(s: GameState, reason: "time" | "lives") {
  s.over = true;
  s.overReason = reason;
  s.timeLeft = Math.max(0, s.timeLeft);
}

export function tick(s: GameState, dt: number) {
  if (s.over) return;
  if (s.feedback) {
    s.feedback.t += dt;
    // "Đúng!" fades by itself; "Sai rồi!" stays until the reveal pause ends
    if (s.feedback.good && s.feedback.t > 0.6) s.feedback = null;
  }
  if (s.bonus) {
    s.bonus.t += dt;
    if (s.bonus.t > 0.8) s.bonus = null;
  }
  if (s.reveal > 0) {
    s.reveal -= dt;
    if (s.reveal <= 0) {
      s.reveal = 0;
      s.feedback = null;
      if (s.lives <= 0) return finish(s, "lives");
      next(s);
    }
    return; // clock paused while the right answer is shown
  }
  s.elapsed += dt;
  s.timeLeft -= dt;
  if (s.timeLeft <= 0) finish(s, "time");
}

function judge(s: GameState) {
  const value = Number(s.typed);
  if (value === s.q.answer) {
    const gain = bonusFor(s.q.level);
    s.correct++;
    s.streak++;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
    s.marks.push("ok");
    s.timeLeft = Math.min(MAX_SECONDS, s.timeLeft + gain);
    s.bonus = { amount: gain, t: 0 };
    s.feedback = { good: true, text: s.streak >= 5 && s.streak % 5 === 0 ? `Chuỗi ${s.streak} câu đúng! 🔥` : "Đúng!", t: 0 };
    next(s);
  } else {
    s.wrong++;
    s.streak = 0;
    s.lives--;
    s.bonus = null; // don't leave the previous "+2s" on screen next to a mistake
    s.marks.push("bad");
    s.feedback = { good: false, text: `Sai rồi! ${s.q.text.includes("?") ? "? =" : "Đáp án:"} ${s.q.answer}`, t: 0 };
    s.reveal = REVEAL_SECONDS;
  }
}

/** Type a digit. Auto-checks once as many digits as the answer has are typed. */
export function typeDigit(s: GameState, d: string) {
  if (s.over || s.reveal > 0 || !/^\d$/.test(d)) return;
  if (s.typed.length >= 6) return;
  s.typed = s.typed === "0" ? d : s.typed + d;
  if (s.typed.length >= String(s.q.answer).length) judge(s);
}

export function backspace(s: GameState) {
  if (s.over || s.reveal > 0) return;
  s.typed = s.typed.slice(0, -1);
}

/** Enter: check what is typed now (useful when the player typed fewer digits on purpose) */
export function submit(s: GameState) {
  if (s.over || s.reveal > 0 || s.typed === "") return;
  judge(s);
}

// ------------------------------------------------------------ results

/** Grade out of 10 in steps of 0.5 */
export function grade(correct: number) {
  return Math.min(10, Math.round((correct / PERFECT_AT) * 10 * 2) / 2);
}

export function teacherComment(g: number) {
  if (g >= 10) return "Xuất sắc! Cô tuyên dương trước lớp.";
  if (g >= 8.5) return "Giỏi lắm, tính nhẩm rất nhanh!";
  if (g >= 7) return "Khá tốt, cố thêm chút nữa là điểm 10.";
  if (g >= 5) return "Đạt yêu cầu, nhưng cần luyện thêm bảng cửu chương.";
  if (g >= 3) return "Em cần cố gắng hơn. Mai kiểm tra lại!";
  return "Gặp cô sau giờ học nhé! 😅";
}

/** "8,5" */
export const formatGrade = (g: number) => g.toLocaleString("vi-VN", { minimumFractionDigits: g % 1 ? 1 : 0, maximumFractionDigits: 1 });

/** Đ/S row like a marked test sheet, 10 per line */
export function markSheet(marks: Mark[]) {
  const cells = marks.map((m) => (m === "ok" ? "✅" : "❌"));
  const rows: string[] = [];
  for (let i = 0; i < cells.length; i += 10) rows.push(cells.slice(i, i + 10).join(""));
  return rows.join("\n");
}
