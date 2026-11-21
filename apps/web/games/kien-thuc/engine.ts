/**
 * Kiểm tra kiến thức Việt Nam — 15 multiple-choice questions, scored out of 10 (pure logic).
 *
 * Each round draws questions evenly across the four topics, preferring ones the player has
 * not seen recently, and shuffles the answer order. Every question has a 20-second clock;
 * after answering the right answer and a one-line note are shown (the clock is stopped).
 */
import { QUESTIONS, type Question, type Topic } from "./questions";

export const ASK = 15;
export const SECONDS = 20;

export const TOPIC_LABEL: Record<Topic, string> = {
  "lich-su": "Lịch sử",
  "dia-ly": "Địa lý",
  "van-hoa": "Văn hóa",
  "doi-song": "Đời sống",
};
const TOPICS = Object.keys(TOPIC_LABEL) as Topic[];

export type Asked = { q: Question; order: number[]; picked: number | null; correct: boolean; timedOut: boolean };

export type GameState = {
  items: Asked[];
  index: number;
  timeLeft: number;
  /** answer shown, waiting for "next" */
  revealed: boolean;
  over: boolean;
};

function shuffle<T>(arr: readonly T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Even mix of topics; recently seen questions only when a topic runs out */
export function pickQuestions(recent: ReadonlySet<string>, rnd = Math.random): Question[] {
  const perTopic = TOPICS.map((t) => {
    const all = shuffle(
      QUESTIONS.filter((q) => q.topic === t),
      rnd,
    );
    return [...all.filter((q) => !recent.has(q.id)), ...all.filter((q) => recent.has(q.id))];
  });
  const out: Question[] = [];
  for (let i = 0; out.length < ASK && i < 50; i++) {
    for (const list of shuffle(perTopic, rnd)) {
      const q = list[i];
      if (q && out.length < ASK) out.push(q);
    }
  }
  return shuffle(out, rnd);
}

export function createGame(recent: ReadonlySet<string> = new Set(), rnd = Math.random): GameState {
  const items = pickQuestions(recent, rnd).map((q) => ({ q, order: shuffle([0, 1, 2, 3], rnd), picked: null, correct: false, timedOut: false }));
  return { items, index: 0, timeLeft: SECONDS, revealed: false, over: false };
}

export const current = (s: GameState) => s.items[s.index];

/** Pick a displayed option (0–3); maps back through the shuffled order */
export function answer(s: GameState, shown: number) {
  if (s.revealed || s.over) return;
  const it = current(s);
  const original = it.order[shown];
  it.picked = original;
  it.correct = original === it.q.answer;
  s.revealed = true;
}

export function tick(s: GameState, dt: number) {
  if (s.revealed || s.over) return;
  s.timeLeft -= dt;
  if (s.timeLeft <= 0) {
    s.timeLeft = 0;
    current(s).timedOut = true;
    s.revealed = true;
  }
}

export function next(s: GameState) {
  if (!s.revealed) return;
  if (s.index >= s.items.length - 1) {
    s.over = true;
    return;
  }
  s.index++;
  s.timeLeft = SECONDS;
  s.revealed = false;
}

export const correctCount = (s: GameState) => s.items.filter((i) => i.correct).length;
export const grade = (correct: number, total = ASK) => Math.round((correct / total) * 10 * 2) / 2;
export const formatGrade = (g: number) => g.toLocaleString("vi-VN", { maximumFractionDigits: 1 });

export function byTopic(s: GameState) {
  return TOPICS.map((t) => {
    const items = s.items.filter((i) => i.q.topic === t);
    return { topic: t, label: TOPIC_LABEL[t], correct: items.filter((i) => i.correct).length, total: items.length };
  }).filter((x) => x.total > 0);
}

export function verdict(g: number) {
  if (g >= 9.5) return "Học giả Việt Nam học";
  if (g >= 8) return "Hiểu biết sâu rộng";
  if (g >= 6.5) return "Khá vững";
  if (g >= 5) return "Tạm ổn, đọc thêm chút nữa";
  return "Cần ôn lại kiến thức nước nhà";
}
