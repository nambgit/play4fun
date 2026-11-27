/**
 * Cờ caro — two players, 15×15 board, five in a row wins (rules in @play4fun/party/caro). The
 * server checks every move and runs the move clock. A match is first to `target` games; X
 * (who moves first) alternates every game. Running out of time or resigning loses the game; a
 * full board is a draw (nobody scores). After the match both players press "Chơi lại".
 */
import { CARO_SECONDS_OPTIONS, CARO_TARGET_OPTIONS, type CaroPhase, type CaroSettings, type CaroView } from "@play4fun/party";
import { emptyBoard, placeStone, type Cell, type Stone } from "@play4fun/party/caro";
import { clampOption, type Ctx, type GameModule } from "./types";

const ROUND_BREAK_MS = 5000;
/** Small grace on the move clock for network lag */
const LAG_MS = 600;

type State = {
  settings: CaroSettings;
  phase: CaroPhase;
  seats: [string, string];
  /** Seat index holding X this game */
  xSeat: 0 | 1;
  board: Cell[];
  /** Stone to move */
  toMove: Stone;
  lastMove: number | null;
  winLine: number[] | null;
  gameNo: number;
  wins: Map<string, number>;
  endsAt: number;
  nextAt: number;
  gameWinner: string | null;
  reason: CaroView["reason"];
  rematch: Set<string>;
};

/** Player id holding a stone this game */
const holder = (s: State, stone: Stone) => s.seats[stone === 1 ? s.xSeat : s.xSeat === 0 ? 1 : 0];
const stoneOf = (s: State, pid: string): Stone | null => (holder(s, 1) === pid ? 1 : holder(s, 2) === pid ? 2 : null);

function armClock(ctx: Ctx, s: State) {
  const ms = s.settings.seconds * 1000;
  s.endsAt = ctx.now() + ms;
  ctx.timer("move", ms + LAG_MS, () => {
    if (s.phase !== "play") return;
    endGame(ctx, s, holder(s, s.toMove === 1 ? 2 : 1), "timeout");
    ctx.push();
  });
}

function startGame(ctx: Ctx, s: State) {
  s.gameNo++;
  s.phase = "play";
  // Seat 0 has X in odd games, seat 1 in even games
  s.xSeat = s.gameNo % 2 === 1 ? 0 : 1;
  s.board = emptyBoard();
  s.toMove = 1;
  s.lastMove = null;
  s.winLine = null;
  s.gameWinner = null;
  s.reason = null;
  s.nextAt = 0;
  armClock(ctx, s);
}

function endGame(ctx: Ctx, s: State, winner: string | null, reason: NonNullable<CaroView["reason"]>) {
  ctx.clearTimer("move");
  s.endsAt = 0;
  s.gameWinner = winner;
  s.reason = reason;
  if (winner) s.wins.set(winner, (s.wins.get(winner) ?? 0) + 1);
  if (winner && (s.wins.get(winner) ?? 0) >= s.settings.target) {
    s.phase = "over";
    s.rematch.clear();
    return;
  }
  s.phase = "roundEnd";
  s.nextAt = ctx.now() + ROUND_BREAK_MS;
  ctx.timer("next", ROUND_BREAK_MS, () => {
    startGame(ctx, s);
    ctx.push();
  });
}

function fresh(ctx: Ctx, settings: CaroSettings, seats?: [string, string]): State {
  const ids = ctx.connected();
  const pair: [string, string] = seats ?? [ids[0], ids[1]];
  return {
    settings,
    phase: "play",
    seats: pair,
    xSeat: 0,
    board: emptyBoard(),
    toMove: 1,
    lastMove: null,
    winLine: null,
    gameNo: 0,
    wins: new Map(pair.map((id) => [id, 0])),
    endsAt: 0,
    nextAt: 0,
    gameWinner: null,
    reason: null,
    rematch: new Set(),
  };
}

export const caro: GameModule<State, CaroSettings> = {
  normalizeSettings(raw) {
    const r = (raw ?? {}) as Partial<CaroSettings>;
    return {
      target: clampOption(r.target, CARO_TARGET_OPTIONS, 2),
      seconds: clampOption(r.seconds, CARO_SECONDS_OPTIONS, 30),
      blocked: r.blocked === true,
    };
  },

  canStart(ctx) {
    return ctx.connected().length === 2 ? null : "Cần đúng 2 người để chơi.";
  },

  start(ctx, settings) {
    const s = fresh(ctx, settings);
    startGame(ctx, s);
    return s;
  },

  action(ctx, s, pid, a) {
    const stone = stoneOf(s, pid);
    if (stone === null) return;
    switch (a.type) {
      case "caro:move": {
        if (s.phase !== "play" || s.toMove !== stone || typeof a.cell !== "number") return;
        const r = placeStone(s.board, a.cell, stone, s.settings.blocked);
        if (!r.ok) return;
        s.lastMove = a.cell;
        if (r.win) {
          s.winLine = r.win;
          endGame(ctx, s, pid, "five");
        } else if (r.draw) endGame(ctx, s, null, "draw");
        else {
          s.toMove = stone === 1 ? 2 : 1;
          armClock(ctx, s);
        }
        break;
      }
      case "caro:resign":
        if (s.phase !== "play") return;
        endGame(ctx, s, holder(s, stone === 1 ? 2 : 1), "resign");
        break;
      case "caro:rematch": {
        if (s.phase !== "over") return;
        s.rematch.add(pid);
        if (s.seats.every((id) => s.rematch.has(id))) {
          // Swap seats so the other player has X in the first game
          Object.assign(s, fresh(ctx, s.settings, [s.seats[1], s.seats[0]]));
          startGame(ctx, s);
        }
        break;
      }
      default:
        return;
    }
    ctx.push();
  },

  view(_ctx, s): CaroView {
    return {
      kind: "caro",
      phase: s.phase,
      seats: s.seats,
      x: holder(s, 1),
      turn: holder(s, s.toMove),
      board: [...s.board],
      lastMove: s.lastMove,
      winLine: s.winLine,
      endsAt: s.endsAt,
      gameNo: s.gameNo,
      target: s.settings.target,
      blocked: s.settings.blocked,
      wins: Object.fromEntries(s.wins),
      gameWinner: s.gameWinner,
      reason: s.reason,
      nextAt: s.nextAt,
      rematch: [...s.rematch],
    };
  },

  // A player who leaves for good sends the room back to the lobby (fewer than 2 players)

  resume(ctx, s, paused) {
    if (s.phase === "play") {
      s.endsAt += paused;
      ctx.timer("move", Math.max(0, s.endsAt - ctx.now()) + LAG_MS, () => {
        if (s.phase !== "play") return;
        endGame(ctx, s, holder(s, s.toMove === 1 ? 2 : 1), "timeout");
        ctx.push();
      });
    } else if (s.phase === "roundEnd") {
      ctx.timer("next", 1500, () => {
        startGame(ctx, s);
        ctx.push();
      });
    }
  },
};
