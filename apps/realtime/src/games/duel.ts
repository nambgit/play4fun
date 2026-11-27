/**
 * Nối từ đối kháng — two players chain words in turns (rules in @play4fun/party/noi-tu). The server
 * checks every word against the dictionary and runs the turn clock, so nobody can cheat.
 *
 * A match is first to `target` round wins. The first turn alternates between rounds. After the
 * match both players press "Chơi lại" to start a rematch (either player, not only the host —
 * strangers paired by matchmaking have no real host).
 */
import { DUEL_SECONDS_OPTIONS, DUEL_TARGET_OPTIONS, type DuelPhase, type DuelSettings, type DuelView } from "@play4fun/party";
import { PLAY_ERROR_TEXT, hints, loseTurn, openRound, playWord, type DuelRound, type Side } from "@play4fun/party/noi-tu";
import { clampOption, type Ctx, type GameModule } from "./types";

const ROUND_BREAK_MS = 4000;
/** Small grace on the turn clock for network lag */
const LAG_MS = 600;

type State = {
  settings: DuelSettings;
  phase: DuelPhase;
  seats: [string, string];
  round: DuelRound;
  roundNo: number;
  wins: Map<string, number>;
  endsAt: number;
  nextAt: number;
  hints: string[] | null;
  errors: Map<string, { text: string; at: number }>;
  rematch: Set<string>;
};

const sideOf = (s: State, pid: string): Side | null => (s.seats[0] === pid ? 0 : s.seats[1] === pid ? 1 : null);

function armTurn(ctx: Ctx, s: State) {
  const ms = s.settings.seconds * 1000;
  s.endsAt = ctx.now() + ms;
  ctx.timer("turn", ms + LAG_MS, () => {
    if (s.phase !== "play") return;
    s.hints = hints(s.round);
    loseTurn(s.round, "timeout");
    endRound(ctx, s);
    ctx.push();
  });
}

function startRound(ctx: Ctx, s: State) {
  s.roundNo++;
  s.phase = "play";
  // Side 0 starts odd rounds, side 1 even rounds
  s.round = openRound(s.roundNo % 2 === 1 ? 0 : 1, Math.random);
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

function fresh(ctx: Ctx, settings: DuelSettings): State {
  const ids = ctx.connected();
  return {
    settings,
    phase: "play",
    seats: [ids[0], ids[1]],
    round: openRound(0, Math.random),
    roundNo: 0,
    wins: new Map(ids.slice(0, 2).map((id) => [id, 0])),
    endsAt: 0,
    nextAt: 0,
    hints: null,
    errors: new Map(),
    rematch: new Set(),
  };
}

export const duel: GameModule<State, DuelSettings> = {
  normalizeSettings(raw) {
    const r = (raw ?? {}) as Partial<DuelSettings>;
    return { target: clampOption(r.target, DUEL_TARGET_OPTIONS, 3), seconds: clampOption(r.seconds, DUEL_SECONDS_OPTIONS, 15) };
  },

  canStart(ctx) {
    return ctx.connected().length === 2 ? null : "Cần đúng 2 người để đấu.";
  },

  start(ctx, settings) {
    const s = fresh(ctx, settings);
    startRound(ctx, s);
    return s;
  },

  action(ctx, s, pid, a) {
    const side = sideOf(s, pid);
    if (side === null) return;
    switch (a.type) {
      case "duel:word": {
        if (s.phase !== "play" || s.round.turn !== side || typeof a.text !== "string") return;
        const r = playWord(s.round, side, a.text.slice(0, 40));
        if (!r.ok) {
          if (r.error === "turn") return;
          s.errors.set(pid, { text: PLAY_ERROR_TEXT[r.error](r.word ?? ""), at: ctx.now() });
          break;
        }
        s.errors.delete(pid);
        if (s.round.winner !== null) endRound(ctx, s);
        else armTurn(ctx, s);
        break;
      }
      case "duel:skip":
        if (s.phase !== "play" || s.round.turn !== side) return;
        s.hints = hints(s.round);
        loseTurn(s.round, "skip");
        endRound(ctx, s);
        break;
      case "duel:rematch": {
        if (s.phase !== "over") return;
        s.rematch.add(pid);
        if (s.seats.every((id) => s.rematch.has(id))) {
          const next = fresh(ctx, s.settings);
          // Swap sides so the other player opens the first round
          next.seats = [s.seats[1], s.seats[0]];
          Object.assign(s, next);
          startRound(ctx, s);
        }
        break;
      }
      default:
        return;
    }
    ctx.push();
  },

  view(_ctx, s, pid): DuelView {
    const by = (side: Side | null) => (side === null ? null : s.seats[side]);
    return {
      kind: "duel",
      phase: s.phase,
      seats: s.seats,
      turn: s.seats[s.round.turn],
      need: s.round.need,
      chain: s.round.chain.map((c) => ({ word: c.word, by: by(c.by) })),
      endsAt: s.endsAt,
      roundNo: s.roundNo,
      target: s.settings.target,
      wins: Object.fromEntries(s.wins),
      roundWinner: by(s.round.winner),
      reason: s.round.reason,
      hints: s.phase === "play" ? null : s.hints,
      nextAt: s.nextAt,
      myError: s.errors.get(pid) ?? null,
      rematch: [...s.rematch],
    };
  },

  // A player who leaves for good ends the game: the server sends the room back to the lobby
  // (fewer than 2 players). Nothing to do here.

  resume(ctx, s, paused) {
    if (s.phase === "play") {
      s.endsAt += paused;
      const left = Math.max(0, s.endsAt - ctx.now());
      ctx.timer("turn", left + LAG_MS, () => {
        if (s.phase !== "play") return;
        s.hints = hints(s.round);
        loseTurn(s.round, "timeout");
        endRound(ctx, s);
        ctx.push();
      });
    } else if (s.phase === "roundEnd") {
      ctx.timer("next", 1500, () => {
        startRound(ctx, s);
        ctx.push();
      });
    }
  },
};

