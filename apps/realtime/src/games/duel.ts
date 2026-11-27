/**
 * Nối từ — 2 to 10 players chain words in turns (rules in @play4fun/party/noi-tu). The server
 * checks every word against the dictionary and runs the turn clock, so nobody can cheat.
 *
 * Each round is knock-out: timeout / give-up / being left without an answer puts you out, the
 * last player standing wins the round. A match is first to `target` round wins. The first turn
 * rotates between rounds. After the match everyone still here presses "Chơi lại" (strangers
 * paired by matchmaking have no real host, so it is not a host-only button).
 */
import { DUEL_SECONDS_OPTIONS, DUEL_TARGET_OPTIONS, type DuelPhase, type DuelSettings, type DuelView } from "@play4fun/party";
import { PLAY_ERROR_TEXT, hints, leaveRound, loseTurn, openRound, playWord, type DuelRound } from "@play4fun/party/noi-tu";
import { clampOption, type Ctx, type GameModule } from "./types";

const ROUND_BREAK_MS = 5000;
/** Small grace on the turn clock for network lag */
const LAG_MS = 600;
export const MAX_SEATS = 10;

type State = {
  settings: DuelSettings;
  phase: DuelPhase;
  /** Players in turn order */
  seats: string[];
  /** Seats whose player left the room for good (they sit out the next rounds) */
  gone: Set<string>;
  round: DuelRound;
  roundNo: number;
  wins: Map<string, number>;
  endsAt: number;
  nextAt: number;
  hints: string[] | null;
  errors: Map<string, { text: string; at: number }>;
  rematch: Set<string>;
  champion: string | null;
};

const seatOf = (s: State, pid: string) => s.seats.indexOf(pid);
const absentSeats = (s: State) => new Set(s.seats.map((id, i) => (s.gone.has(id) ? i : -1)).filter((i) => i >= 0));

function onTimeout(ctx: Ctx, s: State) {
  if (s.phase !== "play") return;
  s.hints = hints(s.round);
  loseTurn(s.round, "timeout");
  afterMove(ctx, s);
  ctx.push();
}

function armTurn(ctx: Ctx, s: State, ms = s.settings.seconds * 1000) {
  s.endsAt = ctx.now() + ms;
  ctx.timer("turn", ms + LAG_MS, () => onTimeout(ctx, s));
}

/** After any change to the round: end it, or restart the clock for whoever is up */
function afterMove(ctx: Ctx, s: State) {
  if (s.round.winner !== null) endRound(ctx, s);
  else armTurn(ctx, s);
}

function startRound(ctx: Ctx, s: State) {
  s.roundNo++;
  s.phase = "play";
  // The first turn rotates through the seats
  s.round = openRound(s.seats.length, (s.roundNo - 1) % s.seats.length, Math.random, absentSeats(s));
  s.hints = null;
  s.errors.clear();
  s.nextAt = 0;
  armTurn(ctx, s);
}

function endRound(ctx: Ctx, s: State) {
  ctx.clearTimer("turn");
  const w = s.round.winner;
  if (w === null) return;
  const id = s.seats[w];
  s.wins.set(id, (s.wins.get(id) ?? 0) + 1);
  s.endsAt = 0;
  if ((s.wins.get(id) ?? 0) >= s.settings.target) {
    s.phase = "over";
    s.champion = id;
    s.rematch.clear();
    return;
  }
  s.phase = "roundEnd";
  s.nextAt = ctx.now() + ROUND_BREAK_MS;
  ctx.timer("next", ROUND_BREAK_MS, () => {
    startRound(ctx, s);
    ctx.push();
  });
}

function fresh(settings: DuelSettings, seats: string[]): State {
  return {
    settings,
    phase: "play",
    seats,
    gone: new Set(),
    round: openRound(seats.length, 0, Math.random),
    roundNo: 0,
    wins: new Map(seats.map((id) => [id, 0])),
    endsAt: 0,
    nextAt: 0,
    hints: null,
    errors: new Map(),
    rematch: new Set(),
    champion: null,
  };
}

export const duel: GameModule<State, DuelSettings> = {
  normalizeSettings(raw) {
    const r = (raw ?? {}) as Partial<DuelSettings>;
    return { target: clampOption(r.target, DUEL_TARGET_OPTIONS, 2), seconds: clampOption(r.seconds, DUEL_SECONDS_OPTIONS, 30) };
  },

  canStart(ctx) {
    const n = ctx.connected().length;
    return n >= 2 && n <= MAX_SEATS ? null : `Cần từ 2 đến ${MAX_SEATS} người.`;
  },

  start(ctx, settings) {
    const s = fresh(settings, ctx.connected().slice(0, MAX_SEATS));
    startRound(ctx, s);
    return s;
  },

  action(ctx, s, pid, a) {
    const seat = seatOf(s, pid);
    if (seat < 0) return;
    switch (a.type) {
      case "duel:word": {
        if (s.phase !== "play" || s.round.turn !== seat || typeof a.text !== "string") return;
        const before = s.round.out.length;
        const r = playWord(s.round, seat, a.text.slice(0, 40));
        if (!r.ok) {
          if (r.error === "turn") return;
          s.errors.set(pid, { text: PLAY_ERROR_TEXT[r.error](r.word ?? ""), at: ctx.now() });
          break;
        }
        s.errors.delete(pid);
        // Someone was left without an answer: no hints (there were none), the round goes on
        if (s.round.out.length > before) s.hints = null;
        afterMove(ctx, s);
        break;
      }
      case "duel:skip":
        if (s.phase !== "play" || s.round.turn !== seat) return;
        s.hints = hints(s.round);
        loseTurn(s.round, "skip");
        afterMove(ctx, s);
        break;
      case "duel:rematch": {
        if (s.phase !== "over") return;
        s.rematch.add(pid);
        const present = ctx.connected().filter((id) => s.seats.includes(id));
        if (present.length >= 2 && present.every((id) => s.rematch.has(id))) {
          // Same table, everyone who is still here; rotate so someone else opens
          const seats = [...present.slice(1), present[0]].slice(0, MAX_SEATS);
          Object.assign(s, fresh(s.settings, seats));
          ctx.newGame();
          startRound(ctx, s);
        }
        break;
      }
      default:
        return;
    }
    ctx.push();
  },

  view(ctx, s, pid): DuelView {
    const by = (seat: number | null) => (seat === null ? null : s.seats[seat]);
    return {
      kind: "duel",
      phase: s.phase,
      seats: s.seats,
      alive: s.seats.filter((_, i) => s.round.alive[i]),
      out: s.round.out.map((o) => ({ id: s.seats[o.seat], reason: o.reason })),
      turn: s.seats[s.round.turn],
      need: s.round.need,
      chain: s.round.chain.map((c) => ({ word: c.word, by: by(c.by) })),
      endsAt: s.endsAt,
      roundNo: s.roundNo,
      target: s.settings.target,
      wins: Object.fromEntries(s.wins),
      roundWinner: by(s.round.winner),
      reason: s.round.reason,
      hints: s.hints,
      nextAt: s.nextAt,
      myError: s.errors.get(pid) ?? null,
      rematch: [...s.rematch].filter((id) => ctx.connected().includes(id)),
      champion: s.champion,
    };
  },

  onConnectionChange(ctx, s) {
    // A rematch may now be agreed by everyone still connected
    if (s.phase !== "over") return;
    const present = ctx.connected().filter((id) => s.seats.includes(id));
    if (present.length >= 2 && present.every((id) => s.rematch.has(id))) {
      Object.assign(s, fresh(s.settings, present));
      ctx.newGame();
      startRound(ctx, s);
    }
  },

  onRemove(ctx, s, pid) {
    // With fewer than 2 players left the server sends the room back to the lobby
    const seat = seatOf(s, pid);
    if (seat < 0) return;
    s.gone.add(pid);
    s.rematch.delete(pid);
    if (s.phase === "play") {
      leaveRound(s.round, seat);
      afterMove(ctx, s);
    }
  },

  resume(ctx, s, paused) {
    if (s.phase === "play") {
      s.endsAt += paused;
      armTurn(ctx, s, Math.max(0, s.endsAt - ctx.now()));
    } else if (s.phase === "roundEnd") {
      ctx.timer("next", 1500, () => {
        startRound(ctx, s);
        ctx.push();
      });
    }
  },
};
