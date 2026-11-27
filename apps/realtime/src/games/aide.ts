/**
 * Ai dễ… nhất? — each round shows a prompt ("Ai dễ ngủ gật trong cuộc họp nhất?") and everyone
 * secretly votes for another player in the room. Votes stay anonymous: only the totals are shown.
 *
 * Scoring rewards reading the room, not being picked: voting for the most-voted player (ties
 * count) scores 100. The most-voted player(s) win the prompt's light-hearted award and 50 points.
 * Nobody can vote for themselves.
 */
import { AIDE_ROUND_OPTIONS, AIDE_SECONDS_OPTIONS, type AiDePhase, type AiDeSettings, type AiDeView } from "@play4fun/party";
import { AI_DE_NHAT_PROMPTS, type AiDeNhatPrompt } from "./content/ai-de-nhat-prompts";
import { clampOption, pickFresh, type Ctx, type GameModule } from "./types";

const LEAD_MS = 800;
const MATCH_POINTS = 100;
const WINNER_POINTS = 50;

type State = {
  settings: AiDeSettings;
  phase: AiDePhase;
  round: number;
  prompt: AiDeNhatPrompt;
  /** voter → target */
  votes: Map<string, string>;
  endsAt: number;
  scores: Map<string, number>;
  tally: Map<string, number> | null;
  winners: string[] | null;
  gains: Map<string, number> | null;
  titles: Map<string, string[]>;
};

function startRound(ctx: Ctx, s: State) {
  s.round++;
  s.phase = "vote";
  [s.prompt] = pickFresh(AI_DE_NHAT_PROMPTS, (p) => `aide:${p.id}`, ctx.room.used, 1);
  s.votes.clear();
  s.tally = null;
  s.winners = null;
  s.gains = null;
  const ms = LEAD_MS + s.settings.seconds * 1000;
  s.endsAt = ctx.now() + ms;
  ctx.timer("close", ms, () => {
    close(ctx, s);
    ctx.push();
  });
}

const add = (m: Map<string, number>, id: string, n: number) => m.set(id, (m.get(id) ?? 0) + n);

function close(ctx: Ctx, s: State) {
  if (s.phase !== "vote") return;
  ctx.clearTimer("close");
  s.phase = "reveal";
  s.endsAt = 0;
  s.tally = new Map();
  s.gains = new Map();
  for (const target of s.votes.values()) add(s.tally, target, 1);
  const top = Math.max(0, ...s.tally.values());
  s.winners = top ? [...s.tally].filter(([, n]) => n === top).map(([id]) => id) : [];
  for (const [voter, target] of s.votes) if (s.winners.includes(target)) add(s.gains, voter, MATCH_POINTS);
  for (const id of s.winners) {
    add(s.gains, id, WINNER_POINTS);
    s.titles.set(id, [...(s.titles.get(id) ?? []), s.prompt.title]);
  }
  for (const [id, n] of s.gains) add(s.scores, id, n);
}

function maybeClose(ctx: Ctx, s: State) {
  if (s.phase !== "vote") return;
  const online = ctx.active();
  if (online.length && online.every((id) => s.votes.has(id))) close(ctx, s);
}

export const aide: GameModule<State, AiDeSettings> = {
  normalizeSettings(raw) {
    const r = (raw ?? {}) as Partial<AiDeSettings>;
    return { rounds: clampOption(r.rounds, AIDE_ROUND_OPTIONS, 12), seconds: clampOption(r.seconds, AIDE_SECONDS_OPTIONS, 15) };
  },

  start(ctx, settings) {
    const s: State = {
      settings,
      phase: "vote",
      round: 0,
      prompt: AI_DE_NHAT_PROMPTS[0],
      votes: new Map(),
      endsAt: 0,
      scores: new Map(ctx.connected().map((id) => [id, 0])),
      tally: null,
      winners: null,
      gains: null,
      titles: new Map(),
    };
    startRound(ctx, s);
    return s;
  },

  action(ctx, s, pid, a) {
    const host = ctx.isHost(pid);
    switch (a.type) {
      case "aide:vote": {
        if (s.phase !== "vote" || typeof a.target !== "string") return;
        // Only players in this game, never yourself; ignore taps during the lead-in
        if (a.target === pid || !s.scores.has(a.target) || ctx.now() < s.endsAt - s.settings.seconds * 1000) return;
        s.votes.set(pid, a.target);
        maybeClose(ctx, s);
        break;
      }
      case "aide:close":
        if (host) close(ctx, s);
        break;
      case "aide:next":
        if (!host || s.phase !== "reveal") return;
        if (s.round >= s.settings.rounds) s.phase = "over";
        else startRound(ctx, s);
        break;
      default:
        return;
    }
    ctx.push();
  },

  view(_ctx, s, pid): AiDeView {
    const reveal = s.phase !== "vote";
    return {
      kind: "aide",
      phase: s.phase,
      round: s.round,
      totalRounds: s.settings.rounds,
      prompt: s.prompt.q,
      title: s.prompt.title,
      endsAt: s.endsAt,
      voted: [...s.votes.keys()],
      myVote: s.votes.get(pid) ?? null,
      tally: reveal && s.tally ? Object.fromEntries(s.tally) : null,
      winners: reveal ? s.winners : null,
      gains: reveal && s.gains ? Object.fromEntries(s.gains) : null,
      scores: Object.fromEntries(s.scores),
      titles: Object.fromEntries(s.titles),
    };
  },

  onJoin(_ctx, s, pid) {
    if (!s.scores.has(pid)) s.scores.set(pid, 0);
  },

  onConnectionChange(ctx, s) {
    maybeClose(ctx, s);
  },

  onRemove(ctx, s, pid) {
    // Their vote no longer counts; votes for them still do (they were in the room when voted)
    s.votes.delete(pid);
    maybeClose(ctx, s);
  },

  resume(ctx, s, paused) {
    if (s.phase !== "vote") return;
    s.endsAt += paused;
    ctx.timer("close", Math.max(0, s.endsAt - ctx.now()), () => {
      close(ctx, s);
      ctx.push();
    });
  },
};
