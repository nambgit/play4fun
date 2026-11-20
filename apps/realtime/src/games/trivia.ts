/**
 * Đố vui team building — live quiz: the host shows it on a big screen, everyone answers on
 * their phone. Faster correct answers score more, streaks add a bonus. A question closes when
 * everyone connected has answered or time runs out; the host moves on to the next one.
 */
import {
  TRIVIA_CATEGORY_LABEL,
  TRIVIA_COUNT_OPTIONS,
  TRIVIA_SECONDS_OPTIONS,
  type TriviaCategory,
  type TriviaPhase,
  type TriviaSettings,
  type TriviaView,
} from "@play4fun/party";
import { TRIVIA } from "./content/trivia-questions";
import { clampOption, pickFresh, shuffle, type Ctx, type GameModule } from "./types";

const CATEGORIES: TriviaCategory[] = ["all", "chung", "vietnam", "khoahoc", "congso"];
/** Short pause so everyone sees the question before the clock runs */
const LEAD_MS = 600;

type Q = { text: string; options: string[]; correct: number; category: string };

type State = {
  questions: Q[];
  index: number;
  phase: TriviaPhase;
  limitMs: number;
  openedAt: number;
  endsAt: number;
  answers: Map<string, { index: number; at: number }>;
  scores: Map<string, { score: number; streak: number }>;
  gains: Map<string, number>;
  counts: number[] | null;
};

function open(ctx: Ctx, s: State) {
  s.phase = "question";
  s.answers.clear();
  s.gains.clear();
  s.counts = null;
  s.openedAt = ctx.now() + LEAD_MS;
  s.endsAt = s.openedAt + s.limitMs;
  ctx.timer("close", LEAD_MS + s.limitMs, () => {
    close(ctx, s);
    ctx.push();
  });
}

function close(ctx: Ctx, s: State) {
  if (s.phase !== "question") return;
  ctx.clearTimer("close");
  const q = s.questions[s.index];
  s.counts = q.options.map(() => 0);
  for (const [pid, entry] of s.scores) {
    const ans = s.answers.get(pid);
    if (ans) s.counts[ans.index]++;
    if (ans && ans.index === q.correct) {
      const left = Math.max(0, Math.min(1, (s.endsAt - ans.at) / s.limitMs));
      const gain = Math.round(500 + 500 * left) + Math.min(entry.streak, 3) * 100;
      entry.score += gain;
      entry.streak++;
      s.gains.set(pid, gain);
    } else {
      entry.streak = 0;
      s.gains.set(pid, 0);
    }
  }
  s.phase = "reveal";
}

function maybeAllAnswered(ctx: Ctx, s: State) {
  if (s.phase !== "question") return;
  const who = ctx.connected().filter((id) => s.scores.has(id));
  if (who.length > 0 && who.every((id) => s.answers.has(id))) close(ctx, s);
}

export const trivia: GameModule<State, TriviaSettings> = {
  normalizeSettings(raw) {
    const r = (raw ?? {}) as Partial<TriviaSettings>;
    return {
      count: clampOption(r.count, TRIVIA_COUNT_OPTIONS, 10),
      seconds: clampOption(r.seconds, TRIVIA_SECONDS_OPTIONS, 20),
      category: CATEGORIES.includes(r.category as TriviaCategory) ? (r.category as TriviaCategory) : "all",
    };
  },

  start(ctx, settings) {
    const pool = settings.category === "all" ? TRIVIA : TRIVIA.filter((q) => q.cat === settings.category);
    const picked = pickFresh(pool, (q) => `trivia:${q.id}`, ctx.room.used, Math.min(settings.count, pool.length));
    const questions: Q[] = picked.map((q) => {
      const options = shuffle(q.a);
      return { text: q.q, options, correct: options.indexOf(q.a[0]), category: TRIVIA_CATEGORY_LABEL[q.cat] };
    });
    const s: State = {
      questions,
      index: 0,
      phase: "question",
      limitMs: settings.seconds * 1000,
      openedAt: 0,
      endsAt: 0,
      answers: new Map(),
      scores: new Map(ctx.connected().map((id) => [id, { score: 0, streak: 0 }])),
      gains: new Map(),
      counts: null,
    };
    open(ctx, s);
    return s;
  },

  action(ctx, s, pid, a) {
    const host = ctx.isHost(pid);
    switch (a.type) {
      case "trivia:answer": {
        if (s.phase !== "question" || s.answers.has(pid) || !s.scores.has(pid)) return;
        const q = s.questions[s.index];
        if (typeof a.index !== "number" || a.index < 0 || a.index >= q.options.length) return;
        // Answers sent during the short lead-in count as instant
        s.answers.set(pid, { index: Math.floor(a.index), at: Math.max(ctx.now(), s.openedAt) });
        maybeAllAnswered(ctx, s);
        break;
      }
      case "trivia:close":
        if (!host) return;
        close(ctx, s);
        break;
      case "trivia:next":
        if (!host || s.phase !== "reveal") return;
        if (s.index + 1 >= s.questions.length) {
          s.phase = "over";
        } else {
          s.index++;
          open(ctx, s);
        }
        break;
      default:
        return;
    }
    ctx.push();
  },

  view(ctx, s, pid): TriviaView {
    const q = s.questions[s.index];
    const shown = s.phase === "reveal" || s.phase === "over";
    const present = new Set(ctx.room.players.keys());
    return {
      kind: "trivia",
      phase: s.phase,
      index: s.index,
      total: s.questions.length,
      seconds: s.limitMs / 1000,
      question: q ? { text: q.text, options: q.options, category: q.category } : null,
      endsAt: s.endsAt,
      answered: [...s.answers.keys()],
      myAnswer: s.answers.get(pid)?.index ?? null,
      correct: shown ? q.correct : null,
      counts: shown ? s.counts : null,
      myGain: shown ? (s.gains.get(pid) ?? null) : null,
      leaderboard: [...s.scores]
        .filter(([id]) => present.has(id))
        .map(([id, e]) => ({ id, score: e.score, streak: e.streak }))
        .sort((a, b) => b.score - a.score),
    };
  },

  onJoin(_ctx, s, pid) {
    if (!s.scores.has(pid)) s.scores.set(pid, { score: 0, streak: 0 });
  },

  onConnectionChange(ctx, s) {
    maybeAllAnswered(ctx, s);
  },

  onRemove(ctx, s) {
    maybeAllAnswered(ctx, s);
  },
};
