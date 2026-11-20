/**
 * Personality quiz engine shared by every "Trắc nghiệm & test vui" game (pure logic, no React).
 *
 * A quiz has a pool of questions larger than the number asked. Each run draws a random
 * subset (questions seen in recent runs go last) and shuffles the answer order, so
 * replays feel fresh. Every answer adds points to one or more personality types;
 * the type with the most points wins.
 */

export type QuizType = {
  id: string;
  name: string;
  emoji: string;
  /** One-line hook shown under the name */
  tagline: string;
  description: string;
  strengths: string[];
  watchOut: string[];
  /** Practical advice tailored to this type */
  tips: string[];
  /** id of the type this one gets along with best */
  buddy: string;
};

export type QuizOption = {
  text: string;
  /** Points per type id, usually { main: 2 } or { main: 2, other: 1 } */
  scores: Record<string, number>;
};

export type QuizQuestion = {
  /** Stable id (stored in players' "recently seen" list — never reuse) */
  id: string;
  text: string;
  options: QuizOption[];
};

export type Quiz = {
  slug: string;
  title: string;
  intro: string;
  /** Emoji shown on the start screen */
  emoji: string;
  /** Number of questions per run (≤ pool size) */
  ask: number;
  types: QuizType[];
  pool: QuizQuestion[];
};

export type QuizRun = {
  questions: QuizQuestion[];
  /** Index of the chosen option per answered question (index into the shuffled options) */
  answers: number[];
};

export type QuizResult = {
  type: QuizType;
  buddy: QuizType;
  /** Share of points per type, 0–100, sorted high → low (sums to 100) */
  breakdown: { type: QuizType; pct: number }[];
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

/**
 * @param recentlySeen question ids from the player's last runs — drawn only after every unseen question
 */
export function createRun(quiz: Quiz, seed = Date.now(), recentlySeen: ReadonlySet<string> = new Set()): QuizRun {
  const rng = makeRng(seed);
  const shuffled = shuffle(quiz.pool, rng);
  const ordered = [...shuffled.filter((q) => !recentlySeen.has(q.id)), ...shuffled.filter((q) => recentlySeen.has(q.id))];
  const questions = ordered.slice(0, quiz.ask).map((q) => ({ ...q, options: shuffle(q.options, rng) }));
  return { questions, answers: [] };
}

export function answer(run: QuizRun, optionIndex: number) {
  if (run.answers.length < run.questions.length) run.answers.push(optionIndex);
}

export function back(run: QuizRun) {
  run.answers.pop();
}

export const isDone = (run: QuizRun) => run.answers.length >= run.questions.length;

export function result(quiz: Quiz, run: QuizRun): QuizResult {
  const totals = new Map(quiz.types.map((t) => [t.id, 0]));
  // Remember which type the latest answers leaned to, to break ties
  const lastHit = new Map(quiz.types.map((t) => [t.id, -1]));
  run.answers.forEach((oi, qi) => {
    const opt = run.questions[qi].options[oi];
    for (const [id, pts] of Object.entries(opt.scores)) {
      totals.set(id, (totals.get(id) ?? 0) + pts);
      lastHit.set(id, qi);
    }
  });

  // Normalise by opportunity: with 5 types and 4 answers per question, a type that appears in
  // more of this run's questions would otherwise win more often just by being offered more.
  const possible = new Map(quiz.types.map((t) => [t.id, 0]));
  for (const q of run.questions) {
    for (const t of quiz.types) {
      possible.set(t.id, possible.get(t.id)! + Math.max(0, ...q.options.map((o) => o.scores[t.id] ?? 0)));
    }
  }
  const ratio = (id: string) => (possible.get(id) ? totals.get(id)! / possible.get(id)! : 0);

  const ranked = [...quiz.types].sort(
    (a, b) => ratio(b.id) - ratio(a.id) || totals.get(b.id)! - totals.get(a.id)! || lastHit.get(b.id)! - lastHit.get(a.id)!,
  );
  const sum = quiz.types.reduce((acc, t) => acc + ratio(t.id), 0) || 1;

  // Largest-remainder rounding so the bars add up to exactly 100
  const raw = ranked.map((t) => (ratio(t.id) / sum) * 100);
  const floors = raw.map(Math.floor);
  let left = 100 - floors.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - floors[i], i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left <= 0) break;
    floors[i]++;
    left--;
  }

  const type = ranked[0];
  return {
    type,
    buddy: quiz.types.find((t) => t.id === type.buddy) ?? ranked[1],
    breakdown: ranked.map((t, i) => ({ type: t, pct: floors[i] })),
  };
}

/** Dev-time sanity check: every score key points at a real type, ids are unique, pool is big enough */
export function validateQuiz(quiz: Quiz): string[] {
  const errs: string[] = [];
  const typeIds = new Set(quiz.types.map((t) => t.id));
  if (quiz.pool.length < quiz.ask) errs.push(`pool (${quiz.pool.length}) < ask (${quiz.ask})`);
  const qids = new Set<string>();
  for (const q of quiz.pool) {
    if (qids.has(q.id)) errs.push(`duplicate question id ${q.id}`);
    qids.add(q.id);
    if (q.options.length < 3 || q.options.length > 4) errs.push(`${q.id}: needs 3–4 options`);
    for (const o of q.options) for (const k of Object.keys(o.scores)) if (!typeIds.has(k)) errs.push(`${q.id}: unknown type "${k}"`);
  }
  for (const t of quiz.types) {
    if (!typeIds.has(t.buddy)) errs.push(`${t.id}: unknown buddy "${t.buddy}"`);
    const reach = quiz.pool.filter((q) => q.options.some((o) => (o.scores[t.id] ?? 0) >= 2)).length;
    if (reach < quiz.ask * 0.6) errs.push(`${t.id}: main answer in only ${reach} questions — hard to get`);
  }
  return errs;
}
