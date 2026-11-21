/**
 * Ma sói — werewolf with the server as game master; phones hold secret roles.
 *
 * Roles: werewolves (know each other), seer (checks one player each night), guard (protects
 * one player each night, not the same one twice in a row), villagers. Night: every night actor
 * picks on their phone; the werewolves' target is the most picked (ties broken at random) and
 * dies at dawn unless guarded. Day: timed discussion out loud, then a vote; most votes is out
 * and their role is shown (a tie eliminates nobody). The village wins when no werewolf is
 * left; the werewolves win once they are at least as many as everyone else.
 */
import { WOLF_TALK_OPTIONS, maxWolves, type WolfPhase, type WolfRole, type WolfSettings, type WolfView } from "@play4fun/party";
import { clampOption, pickOne, shuffle, type Ctx, type GameModule } from "./types";

const NIGHT_MS = 45_000;
const DAWN_MS = 9_000;
const VOTE_MS = 60_000;

type State = {
  settings: WolfSettings;
  roles: Map<string, WolfRole>;
  alive: Set<string>;
  phase: WolfPhase;
  day: number;
  ready: Set<string>;
  endsAt: number;
  /** Night picks by actor id */
  picks: Map<string, string>;
  /** Per seer: what they learned */
  seerLog: Map<string, { id: string; wolf: boolean }[]>;
  guardLast: string | null;
  died: string | null;
  votes: Map<string, string>;
  tally: { id: string; votes: number }[] | null;
  lastOut: { id: string; role: WolfRole } | null;
  tie: boolean;
  winner: "village" | "wolves" | null;
};

const isAlive = (s: State, id: string) => s.alive.has(id);
const roleOf = (s: State, id: string) => s.roles.get(id);
const wolvesAlive = (s: State) => [...s.alive].filter((id) => roleOf(s, id) === "wolf");

function checkWinner(s: State): State["winner"] {
  const wolves = wolvesAlive(s).length;
  if (wolves === 0) return "village";
  if (wolves >= s.alive.size - wolves) return "wolves";
  return null;
}

/** Alive connected players with a night job (werewolves, seer, guard) */
function nightActors(ctx: Ctx, s: State) {
  const online = new Set(ctx.active());
  return [...s.alive].filter((id) => online.has(id) && roleOf(s, id) !== "villager");
}

const mustAct = (ctx: Ctx, s: State) => [...s.alive].filter((id) => ctx.active().includes(id));

function setPhase(ctx: Ctx, s: State, phase: WolfPhase, ms: number, then?: () => void) {
  s.phase = phase;
  ctx.clearTimer("phase");
  if (ms > 0 && then) {
    s.endsAt = ctx.now() + ms;
    ctx.timer("phase", ms, () => {
      then();
      ctx.push();
    });
  } else {
    s.endsAt = 0;
  }
}

function startNight(ctx: Ctx, s: State) {
  s.picks.clear();
  s.died = null;
  s.votes.clear();
  s.tally = null;
  s.tie = false;
  setPhase(ctx, s, "night", NIGHT_MS, () => resolveNight(ctx, s));
}

function resolveNight(ctx: Ctx, s: State) {
  if (s.phase !== "night") return;
  // Werewolves' target: most picked by living wolves, ties at random
  const counts = new Map<string, number>();
  for (const [actor, target] of s.picks) {
    if (roleOf(s, actor) === "wolf" && isAlive(s, actor) && isAlive(s, target) && roleOf(s, target) !== "wolf") counts.set(target, (counts.get(target) ?? 0) + 1);
  }
  let victim: string | null = null;
  if (counts.size) {
    const top = Math.max(...counts.values());
    victim = pickOne([...counts].filter(([, n]) => n === top).map(([id]) => id));
  }
  let guarded: string | null = null;
  for (const [actor, target] of s.picks) {
    const role = roleOf(s, actor);
    if (!isAlive(s, actor)) continue;
    if (role === "guard") guarded = target;
    if (role === "seer") {
      const log = s.seerLog.get(actor) ?? [];
      if (!log.some((l) => l.id === target)) log.push({ id: target, wolf: roleOf(s, target) === "wolf" });
      s.seerLog.set(actor, log);
    }
  }
  s.guardLast = guarded;
  s.died = victim && victim !== guarded ? victim : null;
  if (s.died) s.alive.delete(s.died);
  s.day++;
  s.winner = checkWinner(s);
  if (s.winner) return setPhase(ctx, s, "over", 0);
  setPhase(ctx, s, "dawn", DAWN_MS, () => startDay(ctx, s));
}

function startDay(ctx: Ctx, s: State) {
  if (s.phase !== "dawn" && s.phase !== "result") return;
  setPhase(ctx, s, "day", s.settings.talkSeconds * 1000, () => startVote(ctx, s));
}

function startVote(ctx: Ctx, s: State) {
  if (s.phase !== "day") return;
  s.votes.clear();
  setPhase(ctx, s, "vote", VOTE_MS, () => resolveVote(ctx, s));
}

function resolveVote(ctx: Ctx, s: State) {
  if (s.phase !== "vote") return;
  const counts = new Map<string, number>();
  for (const [voter, target] of s.votes) if (isAlive(s, voter) && isAlive(s, target)) counts.set(target, (counts.get(target) ?? 0) + 1);
  s.tally = [...counts].map(([id, votes]) => ({ id, votes })).sort((a, b) => b.votes - a.votes);
  const top = s.tally[0];
  s.tie = !top || s.tally.filter((t) => t.votes === top.votes).length > 1;
  if (s.tie) {
    s.lastOut = null;
  } else {
    s.alive.delete(top.id);
    s.lastOut = { id: top.id, role: roleOf(s, top.id)! };
    s.winner = checkWinner(s);
  }
  setPhase(ctx, s, s.winner ? "over" : "result", 0);
}

function maybeFinishNight(ctx: Ctx, s: State) {
  if (s.phase !== "night") return;
  const actors = nightActors(ctx, s);
  if (actors.length && actors.every((id) => s.picks.has(id))) resolveNight(ctx, s);
}
function maybeFinishVote(ctx: Ctx, s: State) {
  if (s.phase !== "vote") return;
  const voters = mustAct(ctx, s);
  if (voters.length && voters.every((id) => s.votes.has(id))) resolveVote(ctx, s);
}
function maybeFinishReveal(ctx: Ctx, s: State) {
  if (s.phase === "reveal" && mustAct(ctx, s).every((id) => s.ready.has(id))) startNight(ctx, s);
}

/** Is `target` a legal night pick for `actor`? */
function canPick(s: State, actor: string, target: string) {
  if (!isAlive(s, actor) || !isAlive(s, target)) return false;
  switch (roleOf(s, actor)) {
    case "wolf":
      return roleOf(s, target) !== "wolf";
    case "seer":
      return target !== actor;
    case "guard":
      return target !== s.guardLast;
    default:
      return false;
  }
}

export const wolf: GameModule<State, WolfSettings> = {
  normalizeSettings(raw, players) {
    const r = (raw ?? {}) as Partial<WolfSettings>;
    const max = maxWolves(Math.max(5, players));
    return {
      wolves: typeof r.wolves === "number" ? Math.min(max, Math.max(1, Math.round(r.wolves))) : 1,
      seer: r.seer !== false,
      guard: r.guard !== false,
      talkSeconds: clampOption(r.talkSeconds, WOLF_TALK_OPTIONS, 120),
    };
  },

  canStart(ctx, settings) {
    const n = ctx.connected().length;
    if (settings.wolves > maxWolves(n)) return `Với ${n} người chỉ nên có tối đa ${maxWolves(n)} sói.`;
    return null;
  },

  start(ctx, settings) {
    const players = shuffle(ctx.connected());
    const roles = new Map<string, WolfRole>();
    let i = 0;
    for (; i < settings.wolves; i++) roles.set(players[i], "wolf");
    if (settings.seer) roles.set(players[i++], "seer");
    if (settings.guard) roles.set(players[i++], "guard");
    for (; i < players.length; i++) roles.set(players[i], "villager");
    return {
      settings,
      roles,
      alive: new Set(players),
      phase: "reveal",
      day: 0,
      ready: new Set(),
      endsAt: 0,
      picks: new Map(),
      seerLog: new Map(),
      guardLast: null,
      died: null,
      votes: new Map(),
      tally: null,
      lastOut: null,
      tie: false,
      winner: null,
    };
  },

  action(ctx, s, pid, a) {
    const host = ctx.isHost(pid);
    switch (a.type) {
      case "wolf:ready":
        if (s.phase !== "reveal" || !s.roles.has(pid)) return;
        s.ready.add(pid);
        maybeFinishReveal(ctx, s);
        break;
      case "wolf:pick":
        if (s.phase !== "night" || typeof a.target !== "string" || !canPick(s, pid, a.target)) return;
        s.picks.set(pid, a.target);
        maybeFinishNight(ctx, s);
        break;
      case "wolf:startVote":
        if (host) startVote(ctx, s);
        break;
      case "wolf:vote":
        if (s.phase !== "vote" || !isAlive(s, pid) || typeof a.target !== "string" || a.target === pid || !isAlive(s, a.target)) return;
        s.votes.set(pid, a.target);
        maybeFinishVote(ctx, s);
        break;
      case "wolf:endVote":
        if (host) resolveVote(ctx, s);
        break;
      case "wolf:next":
        if (!host) return;
        if (s.phase === "reveal") startNight(ctx, s);
        else if (s.phase === "dawn") startDay(ctx, s);
        else if (s.phase === "result") startNight(ctx, s);
        // No host shortcut at night: a werewolf host could end it before the seer/guard act.
        // The night ends when every night role has picked, or when its timer runs out.
        break;
      default:
        return;
    }
    ctx.push();
  },

  view(_ctx, s, pid): WolfView {
    const role = roleOf(s, pid) ?? null;
    const over = s.phase === "over";
    const wolves = [...s.roles].filter(([, r]) => r === "wolf").map(([id]) => id);
    const counts: Record<WolfRole, number> = { wolf: 0, villager: 0, seer: 0, guard: 0 };
    for (const r of s.roles.values()) counts[r]++;
    const amWolf = role === "wolf";
    return {
      kind: "wolf",
      phase: s.phase,
      day: s.day,
      myRole: role,
      amAlive: isAlive(s, pid),
      alive: [...s.alive],
      roleCounts: counts,
      pack: amWolf || over ? wolves : null,
      ready: [...s.ready],
      endsAt: s.endsAt,
      myNightPick: s.phase === "night" ? (s.picks.get(pid) ?? null) : null,
      packPicks: amWolf && s.phase === "night" ? Object.fromEntries([...s.picks].filter(([id]) => roleOf(s, id) === "wolf")) : null,
      seerLog: role === "seer" ? (s.seerLog.get(pid) ?? []) : null,
      guardLast: role === "guard" ? s.guardLast : null,
      died: s.phase === "night" || s.phase === "reveal" ? null : s.died,
      voted: [...s.votes.keys()],
      myVote: s.votes.get(pid) ?? null,
      tally: s.phase === "result" || over ? s.tally : null,
      lastOut: s.lastOut,
      tie: s.tie,
      winner: s.winner,
      reveal: over ? [...s.roles].map(([id, r]) => ({ id, role: r, alive: s.alive.has(id) })) : null,
    };
  },

  onConnectionChange(ctx, s) {
    maybeFinishReveal(ctx, s);
    maybeFinishNight(ctx, s);
    maybeFinishVote(ctx, s);
  },

  onRemove(ctx, s, pid) {
    if (!s.alive.has(pid) || s.phase === "over") return;
    s.alive.delete(pid);
    s.picks.delete(pid);
    s.votes.delete(pid);
    for (const [k, v] of s.picks) if (v === pid) s.picks.delete(k);
    for (const [k, v] of s.votes) if (v === pid) s.votes.delete(k);
    s.winner = checkWinner(s);
    if (s.winner) return setPhase(ctx, s, "over", 0);
    maybeFinishReveal(ctx, s);
    maybeFinishNight(ctx, s);
    maybeFinishVote(ctx, s);
  },

  resume(ctx, s, paused) {
    if (!s.endsAt) return;
    s.endsAt += paused;
    const left = Math.max(0, s.endsAt - ctx.now());
    const then =
      s.phase === "night" ? () => resolveNight(ctx, s) : s.phase === "dawn" ? () => startDay(ctx, s) : s.phase === "day" ? () => startVote(ctx, s) : s.phase === "vote" ? () => resolveVote(ctx, s) : null;
    if (!then) return;
    ctx.timer("phase", left, () => {
      then();
      ctx.push();
    });
  },
};
