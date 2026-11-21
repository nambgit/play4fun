/**
 * Ai hiểu ai nhất? — each turn one player (the hot seat) secretly picks the answer that is true
 * for them; everyone else guesses what they picked. Correct guessers score 100; the hot seat
 * scores 50 per correct guesser (being predictable to your friends pays). If the hot seat does
 * not answer in time the turn is skipped.
 *
 * The hot seat rotates to whoever has had it the fewest times (join order breaks ties), so late
 * joiners and reconnects are handled without a fixed order.
 */
import { HIEU_SECONDS_OPTIONS, HIEU_TURN_OPTIONS, type HieuPhase, type HieuSettings, type HieuView } from "@play4fun/party";
import { HIEU_NHAU_QUESTIONS, type HieuNhauQuestion } from "./content/hieu-nhau-questions";
import { clampOption, pickFresh, type Ctx, type GameModule } from "./types";

const LEAD_MS = 800;
const GUESS_POINTS = 100;
const HOT_POINTS = 50;

type State = {
  settings: HieuSettings;
  phase: HieuPhase;
  turn: number;
  hotSeat: string;
  hotCounts: Map<string, number>;
  question: HieuNhauQuestion;
  picks: Map<string, number>;
  endsAt: number;
  scores: Map<string, number>;
  gains: Map<string, number> | null;
  counts: number[] | null;
  hotPick: number | null;
  skipped: boolean;
};

function nextHotSeat(ctx: Ctx, s: State) {
  const online = ctx.connected();
  let best = online[0];
  for (const id of online) if ((s.hotCounts.get(id) ?? 0) < (s.hotCounts.get(best) ?? 0)) best = id;
  return best;
}

function startTurn(ctx: Ctx, s: State) {
  s.turn++;
  s.phase = "answer";
  s.hotSeat = nextHotSeat(ctx, s);
  s.hotCounts.set(s.hotSeat, (s.hotCounts.get(s.hotSeat) ?? 0) + 1);
  [s.question] = pickFresh(HIEU_NHAU_QUESTIONS, (q) => `hieu:${q.id}`, ctx.room.used, 1);
  s.picks.clear();
  s.gains = null;
  s.counts = null;
  s.hotPick = null;
  s.skipped = false;
  const ms = LEAD_MS + s.settings.seconds * 1000;
  s.endsAt = ctx.now() + ms;
  ctx.timer("close", ms, () => {
    close(ctx, s);
    ctx.push();
  });
}

function close(ctx: Ctx, s: State) {
  if (s.phase !== "answer") return;
  ctx.clearTimer("close");
  s.phase = "reveal";
  s.endsAt = 0;
  const hot = s.picks.get(s.hotSeat);
  s.hotPick = hot ?? null;
  s.skipped = hot === undefined;
  s.counts = s.question.options.map(() => 0);
  s.gains = new Map();
  if (s.skipped) return;
  let right = 0;
  for (const [pid, pick] of s.picks) {
    if (pid === s.hotSeat) continue;
    s.counts[pick]++;
    if (pick === hot) {
      right++;
      s.gains.set(pid, GUESS_POINTS);
      s.scores.set(pid, (s.scores.get(pid) ?? 0) + GUESS_POINTS);
    }
  }
  if (right) {
    s.gains.set(s.hotSeat, right * HOT_POINTS);
    s.scores.set(s.hotSeat, (s.scores.get(s.hotSeat) ?? 0) + right * HOT_POINTS);
  }
}

function maybeClose(ctx: Ctx, s: State) {
  if (s.phase !== "answer") return;
  const online = ctx.active();
  if (online.length && online.every((id) => s.picks.has(id))) close(ctx, s);
}

export const hieu: GameModule<State, HieuSettings> = {
  normalizeSettings(raw) {
    const r = (raw ?? {}) as Partial<HieuSettings>;
    return { turns: clampOption(r.turns, HIEU_TURN_OPTIONS, 10), seconds: clampOption(r.seconds, HIEU_SECONDS_OPTIONS, 20) };
  },

  start(ctx, settings) {
    const s: State = {
      settings,
      phase: "answer",
      turn: 0,
      hotSeat: "",
      hotCounts: new Map(),
      question: HIEU_NHAU_QUESTIONS[0],
      picks: new Map(),
      endsAt: 0,
      scores: new Map(ctx.connected().map((id) => [id, 0])),
      gains: null,
      counts: null,
      hotPick: null,
      skipped: false,
    };
    startTurn(ctx, s);
    return s;
  },

  action(ctx, s, pid, a) {
    const host = ctx.isHost(pid);
    switch (a.type) {
      case "hieu:pick": {
        if (s.phase !== "answer" || typeof a.index !== "number") return;
        const i = Math.floor(a.index);
        if (i < 0 || i >= s.question.options.length || ctx.now() < s.endsAt - s.settings.seconds * 1000) return;
        s.picks.set(pid, i);
        maybeClose(ctx, s);
        break;
      }
      case "hieu:close":
        if (host) close(ctx, s);
        break;
      case "hieu:next":
        if (!host || s.phase !== "reveal") return;
        if (s.turn >= s.settings.turns) s.phase = "over";
        else startTurn(ctx, s);
        break;
      default:
        return;
    }
    ctx.push();
  },

  view(_ctx, s, pid): HieuView {
    const reveal = s.phase !== "answer";
    return {
      kind: "hieu",
      phase: s.phase,
      turn: s.turn,
      totalTurns: s.settings.turns,
      hotSeat: s.hotSeat,
      question: { text: s.question.q, options: [...s.question.options] },
      endsAt: s.endsAt,
      answered: [...s.picks.keys()],
      myPick: s.picks.get(pid) ?? null,
      hotPick: reveal ? s.hotPick : null,
      skipped: reveal && s.skipped,
      counts: reveal ? s.counts : null,
      gains: reveal && s.gains ? Object.fromEntries(s.gains) : null,
      scores: Object.fromEntries(s.scores),
    };
  },

  onJoin(_ctx, s, pid) {
    if (!s.scores.has(pid)) s.scores.set(pid, 0);
  },

  onConnectionChange(ctx, s) {
    maybeClose(ctx, s);
  },

  onRemove(ctx, s, pid) {
    s.picks.delete(pid);
    // The hot seat left: nothing to guess any more
    if (s.phase === "answer" && pid === s.hotSeat) close(ctx, s);
    else maybeClose(ctx, s);
  },

  resume(ctx, s, paused) {
    if (s.phase !== "answer") return;
    s.endsAt += paused;
    ctx.timer("close", Math.max(0, s.endsAt - ctx.now()), () => {
      close(ctx, s);
      ctx.push();
    });
  },
};
