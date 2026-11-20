/**
 * Ai là gián điệp? — social deduction played face to face, phones hold the secret words.
 *
 * Civilians share a word; the spy (or spies) get a similar word and do NOT know they are
 * the spy ("blank spy" mode: no word, but they know). Each round everyone describes their
 * word out loud in the shown order, then votes on their phone. Most votes is out (a tie
 * eliminates nobody). Civilians win when every spy is out; spies win once they are at
 * least as many as the civilians left.
 */
import { maxSpies, type SpyPhase, type SpySettings, type SpyView } from "@play4fun/party";
import { SPY_PAIRS } from "./content/spy-words";
import { pickFresh, shuffle, type Ctx, type GameModule } from "./types";

type State = {
  civilianWord: string;
  spyWord: string;
  blank: boolean;
  /** Everyone dealt into this game, with their role */
  roles: Map<string, { spy: boolean; word: string | null }>;
  alive: Set<string>;
  phase: SpyPhase;
  round: number;
  ready: Set<string>;
  order: string[];
  votes: Map<string, string>;
  lastOut: { id: string; wasSpy: boolean } | null;
  tie: boolean;
  tally: { id: string; votes: number }[] | null;
  winner: "civilians" | "spies" | null;
};

const spiesAlive = (s: State) => [...s.alive].filter((id) => s.roles.get(id)?.spy).length;

function checkWinner(s: State): State["winner"] {
  const spies = spiesAlive(s);
  const civilians = s.alive.size - spies;
  if (spies === 0) return "civilians";
  if (spies >= civilians) return "spies";
  return null;
}

function newRound(s: State) {
  s.round++;
  s.phase = "describe";
  s.votes.clear();
  s.tie = false;
  s.tally = null;
  // Speaking order: alive players in a fresh random order each round
  s.order = shuffle([...s.alive]);
}

/** Alive players who are connected must act; disconnected ones are not waited for */
const mustAct = (ctx: Ctx, s: State) => [...s.alive].filter((id) => ctx.connected().includes(id));

function maybeFinishReveal(ctx: Ctx, s: State) {
  if (s.phase !== "reveal") return;
  if (mustAct(ctx, s).every((id) => s.ready.has(id))) newRound(s);
}

function resolveVote(s: State) {
  const counts = new Map<string, number>();
  for (const [voter, target] of s.votes) {
    if (s.alive.has(voter) && s.alive.has(target)) counts.set(target, (counts.get(target) ?? 0) + 1);
  }
  s.tally = [...counts].map(([id, votes]) => ({ id, votes })).sort((a, b) => b.votes - a.votes);
  const top = s.tally[0];
  const tied = !top || s.tally.filter((t) => t.votes === top.votes).length > 1;
  if (tied) {
    s.tie = true;
    s.lastOut = null;
    s.phase = "result";
    return;
  }
  s.alive.delete(top.id);
  s.lastOut = { id: top.id, wasSpy: !!s.roles.get(top.id)?.spy };
  s.winner = checkWinner(s);
  s.phase = s.winner ? "over" : "result";
}

function maybeFinishVote(ctx: Ctx, s: State) {
  if (s.phase !== "vote") return;
  const voters = mustAct(ctx, s);
  if (voters.length > 0 && voters.every((id) => s.votes.has(id))) resolveVote(s);
}

export const spy: GameModule<State, SpySettings> = {
  normalizeSettings(raw, players) {
    const r = (raw ?? {}) as Partial<SpySettings>;
    const max = maxSpies(Math.max(3, players));
    const spies = typeof r.spies === "number" ? Math.min(max, Math.max(1, Math.round(r.spies))) : 1;
    return { spies, blankSpy: r.blankSpy === true };
  },

  canStart(ctx, settings) {
    const n = ctx.connected().length;
    if (settings.spies > maxSpies(n)) return `Với ${n} người chỉ nên có tối đa ${maxSpies(n)} gián điệp.`;
    return null;
  },

  start(ctx, settings) {
    const [pair] = pickFresh(SPY_PAIRS, (p) => `spy:${p.id}`, ctx.room.used, 1);
    const flip = Math.random() < 0.5;
    const civilianWord = flip ? pair.a : pair.b;
    const spyWord = flip ? pair.b : pair.a;
    const players = ctx.connected();
    const spyIds = new Set(shuffle(players).slice(0, settings.spies));
    const roles = new Map(
      players.map((id) => [id, spyIds.has(id) ? { spy: true, word: settings.blankSpy ? null : spyWord } : { spy: false, word: civilianWord }]),
    );
    return {
      civilianWord,
      spyWord,
      blank: settings.blankSpy,
      roles,
      alive: new Set(players),
      phase: "reveal",
      round: 0,
      ready: new Set(),
      order: [],
      votes: new Map(),
      lastOut: null,
      tie: false,
      tally: null,
      winner: null,
    };
  },

  action(ctx, s, pid, a) {
    const host = ctx.isHost(pid);
    switch (a.type) {
      case "spy:ready":
        if (s.phase === "reveal" && s.roles.has(pid)) {
          s.ready.add(pid);
          maybeFinishReveal(ctx, s);
        }
        break;
      case "spy:next":
        if (!host) return;
        if (s.phase === "reveal") newRound(s);
        else if (s.phase === "result") newRound(s);
        break;
      case "spy:startVote":
        if (host && s.phase === "describe") {
          s.phase = "vote";
          s.votes.clear();
        }
        break;
      case "spy:vote":
        if (s.phase !== "vote" || !s.alive.has(pid) || typeof a.target !== "string") return;
        if (a.target === pid || !s.alive.has(a.target)) return;
        s.votes.set(pid, a.target);
        maybeFinishVote(ctx, s);
        break;
      case "spy:endVote":
        if (host && s.phase === "vote") resolveVote(s);
        break;
      default:
        return;
    }
    ctx.push();
  },

  view(_ctx, s, pid): SpyView {
    const role = s.roles.get(pid);
    const over = s.phase === "over";
    return {
      kind: "spy",
      phase: s.phase,
      round: s.round,
      spies: [...s.roles.values()].filter((r) => r.spy).length,
      myWord: role ? role.word : null,
      iKnowImSpy: !!role?.spy && s.blank,
      amAlive: s.alive.has(pid),
      alive: [...s.alive],
      ready: [...s.ready],
      order: s.order,
      voted: [...s.votes.keys()],
      myVote: s.votes.get(pid) ?? null,
      lastOut: s.lastOut,
      tie: s.tie,
      tally: s.phase === "result" || over ? s.tally : null,
      winner: s.winner,
      reveal: over ? [...s.roles].map(([id, r]) => ({ id, spy: r.spy, word: r.word })) : null,
      civilianWord: over ? s.civilianWord : null,
      spyWord: over ? s.spyWord : null,
    };
  },

  onConnectionChange(ctx, s) {
    maybeFinishReveal(ctx, s);
    maybeFinishVote(ctx, s);
  },

  onRemove(ctx, s, pid) {
    if (!s.alive.has(pid) || s.phase === "over") return;
    s.alive.delete(pid);
    s.votes.delete(pid);
    for (const [voter, target] of s.votes) if (target === pid) s.votes.delete(voter);
    s.order = s.order.filter((id) => id !== pid);
    s.winner = checkWinner(s);
    if (s.winner) s.phase = "over";
    else {
      maybeFinishReveal(ctx, s);
      maybeFinishVote(ctx, s);
    }
  },
};
