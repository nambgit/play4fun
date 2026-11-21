import { createServer } from "node:http";
import {
  PARTY_GAMES,
  RECONNECT_GRACE_S,
  defaultSettings,
  isPartySlug,
  type ChatMsg,
  type DrawOp,
  type GameAction,
  type JoinResult,
  type PartySlug,
  type ServerState,
} from "@play4fun/party";
import { Server, type Socket } from "socket.io";
import { loadQuestionSet } from "./db";
import { loadRooms, saveRooms } from "./persist";
import { draw } from "./games/draw";
import { hieu } from "./games/hieu";
import { spy } from "./games/spy";
import { trivia } from "./games/trivia";
import { wolf } from "./games/wolf";
import type { Ctx, GameModule } from "./games/types";
import {
  cleanCode,
  cleanName,
  cleanPid,
  connectedIds,
  ensureHost,
  newRoomCode,
  playerList,
  publicRoom,
  rooms,
  type Room,
} from "./rooms";

const PORT = Number(process.env.PORT ?? 3001);
const CORS_ORIGINS = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODULES: Record<PartySlug, GameModule<any, any>> = {
  "ai-la-gian-diep": spy,
  "ve-doan-chu": draw,
  "do-vui-team-building": trivia,
  "ma-soi": wolf,
  "ai-hieu-ai": hieu,
};

const httpServer = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    // Live numbers for /admin (no personal data: counts only)
    const byGame: Record<string, { rooms: number; playing: number; players: number }> = {};
    let players = 0;
    for (const room of rooms.values()) {
      const online = connectedIds(room).length;
      players += online;
      const g = (byGame[room.gameSlug] ??= { rooms: 0, playing: 0, players: 0 });
      g.rooms++;
      g.players += online;
      if (room.status === "playing") g.playing++;
    }
    res.end(JSON.stringify({ status: "ok", rooms: rooms.size, players, byGame }));
    return;
  }
  res.writeHead(404).end();
});

// Socket.IO dùng path mặc định /socket.io — nginx forward path này sang container realtime.
const io = new Server(httpServer, {
  cors: { origin: CORS_ORIGINS, credentials: true },
  maxHttpBufferSize: 64 * 1024,
});

type SocketData = { pid: string | null; code: string | null; buckets: Record<string, { tokens: number; at: number }> };
type S = Socket & { data: SocketData };

// ------------------------------------------------------------ rate limit (token bucket per socket)

function allow(socket: S, key: string, perSec: number, burst = perSec * 2) {
  const now = Date.now();
  const b = (socket.data.buckets[key] ??= { tokens: burst, at: now });
  b.tokens = Math.min(burst, b.tokens + ((now - b.at) / 1000) * perSec);
  b.at = now;
  if (b.tokens < 1) return false;
  b.tokens -= 1;
  return true;
}

// ------------------------------------------------------------ room helpers

function stateFor(room: Room, pid: string): ServerState {
  const g = room.game;
  return {
    room: publicRoom(room),
    me: pid,
    game: g ? g.module.view(ctxFor(room), g.state, pid) : null,
    serverNow: Date.now(),
  };
}

function push(room: Room) {
  for (const p of room.players.values()) {
    if (p.socketId) io.to(p.socketId).emit("room:state", stateFor(room, p.id));
  }
}

function socketsOf(room: Room, ids?: string[]) {
  const list = ids ? ids.map((id) => room.players.get(id)) : [...room.players.values()];
  return list.map((p) => p?.socketId).filter((x): x is string => !!x);
}

function ctxFor(room: Room): Ctx {
  return {
    room,
    push: () => push(room),
    emit: (event: string, data: ChatMsg | DrawOp, to?: string[]) => {
      const targets = socketsOf(room, to);
      if (targets.length) io.to(targets).emit(event, data);
    },
    timer: (key, ms, fn) => {
      const k = `g:${key}`;
      clearTimeout(room.timers.get(k));
      room.timers.set(
        k,
        setTimeout(() => {
          room.timers.delete(k);
          if (rooms.get(room.code) === room && room.game) fn();
        }, ms),
      );
    },
    clearTimer: (key) => {
      clearTimeout(room.timers.get(`g:${key}`));
      room.timers.delete(`g:${key}`);
    },
    connected: () => connectedIds(room),
    name: (id) => room.players.get(id)?.name ?? "Ai đó",
    isHost: (id) => room.hostId === id,
    now: () => Date.now(),
  };
}

function clearGameTimers(room: Room) {
  for (const [k, t] of room.timers) {
    if (k.startsWith("g:")) {
      clearTimeout(t);
      room.timers.delete(k);
    }
  }
}

function startGame(room: Room) {
  clearGameTimers(room);
  const module = MODULES[room.gameSlug];
  const ctx = ctxFor(room);
  room.status = "playing";
  room.game = { module, state: null };
  room.game.state = module.start(ctx, room.settings);
}

/** Remove a seat for good (left, kicked, or reconnect grace expired) */
function removePlayer(room: Room, pid: string) {
  const p = room.players.get(pid);
  if (!p) return;
  clearTimeout(room.timers.get(`gone:${pid}`));
  room.timers.delete(`gone:${pid}`);
  if (room.game) room.game.module.onRemove?.(ctxFor(room), room.game.state, pid);
  room.players.delete(pid);
  if (p.socketId) {
    const sock = io.sockets.sockets.get(p.socketId) as S | undefined;
    sock?.leave(room.code);
    if (sock) sock.data.code = null;
  }
  if (room.players.size === 0) {
    for (const t of room.timers.values()) clearTimeout(t);
    rooms.delete(room.code);
    return;
  }
  ensureHost(room);
  // Not enough players left to keep playing → back to the lobby
  const min = PARTY_GAMES[room.gameSlug].minPlayers;
  if (room.status === "playing" && room.players.size < min) {
    clearGameTimers(room);
    room.status = "lobby";
    room.game = null;
  }
  push(room);
}

/** Bind a socket to a seat (new or existing) */
function seat(socket: S, room: Room, pid: string, name: string) {
  // This socket was in another room: leave it for good
  if (socket.data.code && socket.data.code !== room.code) {
    const old = rooms.get(socket.data.code);
    if (old && socket.data.pid) removePlayer(old, socket.data.pid);
  }
  const existing = room.players.get(pid);
  if (existing) {
    // Same player on a new connection (reconnect, or a second tab: the newest wins)
    if (existing.socketId && existing.socketId !== socket.id) {
      const prev = io.sockets.sockets.get(existing.socketId) as S | undefined;
      prev?.emit("room:replaced");
      prev?.leave(room.code);
      if (prev) prev.data.code = null;
    }
    existing.socketId = socket.id;
    existing.leftAt = null;
    existing.name = name;
    clearTimeout(room.timers.get(`gone:${pid}`));
    room.timers.delete(`gone:${pid}`);
  } else {
    room.players.set(pid, { id: pid, name, socketId: socket.id, joinedAt: Date.now(), leftAt: null });
  }
  socket.data.pid = pid;
  socket.data.code = room.code;
  socket.join(room.code);
  ensureHost(room);
  if (room.game) {
    const ctx = ctxFor(room);
    if (!existing) room.game.module.onJoin?.(ctx, room.game.state, pid);
    room.game.module.onConnectionChange?.(ctx, room.game.state, pid);
  }
}

function currentRoom(socket: S): { room: Room; pid: string } | null {
  const { code, pid } = socket.data;
  const room = code ? rooms.get(code) : undefined;
  if (!room || !pid || room.players.get(pid)?.socketId !== socket.id) return null;
  return { room, pid };
}

// ------------------------------------------------------------ socket events

io.on("connection", (raw) => {
  const socket = raw as S;
  socket.data = { pid: null, code: null, buckets: {} };

  socket.on("room:create", (payload: { gameSlug?: unknown; name?: unknown; pid?: unknown }, ack?: (r: JoinResult) => void) => {
    if (!allow(socket, "join", 1, 5)) return ack?.({ ok: false, error: "invalid_input" });
    const name = cleanName(payload?.name);
    const pid = cleanPid(payload?.pid);
    if (!name || !pid) return ack?.({ ok: false, error: "invalid_input" });
    if (!isPartySlug(payload?.gameSlug)) return ack?.({ ok: false, error: "unknown_game" });

    const room: Room = {
      code: newRoomCode(),
      gameSlug: payload.gameSlug,
      hostId: pid,
      players: new Map(),
      status: "lobby",
      settings: defaultSettings(payload.gameSlug),
      createdAt: Date.now(),
      game: null,
      timers: new Map(),
      used: new Set(),
      custom: null,
    };
    rooms.set(room.code, room);
    seat(socket, room, pid, name);
    ack?.({ ok: true, state: stateFor(room, pid) });
  });

  socket.on("room:join", (payload: { code?: unknown; name?: unknown; pid?: unknown; gameSlug?: unknown }, ack?: (r: JoinResult) => void) => {
    if (!allow(socket, "join", 1, 5)) return ack?.({ ok: false, error: "invalid_input" });
    const name = cleanName(payload?.name);
    const pid = cleanPid(payload?.pid);
    const room = rooms.get(cleanCode(payload?.code));
    if (!name || !pid) return ack?.({ ok: false, error: "invalid_input" });
    if (!room) return ack?.({ ok: false, error: "room_not_found" });
    if (payload?.gameSlug !== undefined && payload.gameSlug !== room.gameSlug) return ack?.({ ok: false, error: "unknown_game" });

    const returning = room.players.has(pid);
    if (!returning) {
      const limits = PARTY_GAMES[room.gameSlug];
      if (room.status === "playing" && !limits.lateJoin) return ack?.({ ok: false, error: "game_in_progress" });
      if (room.players.size >= limits.maxPlayers) return ack?.({ ok: false, error: "room_full" });
    }
    seat(socket, room, pid, name);
    ack?.({ ok: true, state: stateFor(room, pid) });
    push(room);
  });

  socket.on("room:leave", () => {
    const cur = currentRoom(socket);
    if (cur) removePlayer(cur.room, cur.pid);
  });

  socket.on("room:settings", async (settings: unknown) => {
    const cur = currentRoom(socket);
    if (!cur || cur.room.hostId !== cur.pid || cur.room.status !== "lobby" || !allow(socket, "settings", 5)) return;
    const { room } = cur;
    room.settings = MODULES[room.gameSlug].normalizeSettings(settings, connectedIds(room).length);
    // Đố vui: the host picked a Studio question set → load it (and its branding) from the database
    const setId = (room.settings as { setId?: string | null }).setId ?? null;
    if (setId !== (room.custom?.id ?? null)) {
      room.custom = setId ? await loadQuestionSet(setId) : null;
      if (setId && !room.custom) (room.settings as { setId?: string | null }).setId = null;
    }
    push(room);
  });

  socket.on("room:start", (_: unknown, ack?: (r: { ok: boolean; error?: string }) => void) => {
    const cur = currentRoom(socket);
    if (!cur || cur.room.hostId !== cur.pid) return ack?.({ ok: false, error: "Chỉ chủ phòng mới bắt đầu được." });
    const { room } = cur;
    const module = MODULES[room.gameSlug];
    const n = connectedIds(room).length;
    const min = PARTY_GAMES[room.gameSlug].minPlayers;
    if (n < min) return ack?.({ ok: false, error: `Cần ít nhất ${min} người đang online để bắt đầu.` });
    room.settings = module.normalizeSettings(room.settings, n);
    const err = module.canStart?.(ctxFor(room), room.settings);
    if (err) return ack?.({ ok: false, error: err });
    startGame(room);
    ack?.({ ok: true });
    push(room);
  });

  socket.on("room:lobby", () => {
    const cur = currentRoom(socket);
    if (!cur || cur.room.hostId !== cur.pid) return;
    clearGameTimers(cur.room);
    cur.room.status = "lobby";
    cur.room.game = null;
    push(cur.room);
  });

  socket.on("room:kick", (target: unknown) => {
    const cur = currentRoom(socket);
    if (!cur || cur.room.hostId !== cur.pid || typeof target !== "string" || target === cur.pid) return;
    const victim = cur.room.players.get(target);
    if (!victim) return;
    if (victim.socketId) io.to(victim.socketId).emit("room:kicked");
    removePlayer(cur.room, target);
  });

  socket.on("game:action", (a: GameAction) => {
    const cur = currentRoom(socket);
    if (!cur?.room.game || typeof a?.type !== "string" || !allow(socket, "action", 6, 12)) return;
    const { room, pid } = cur;
    if (a.type === "again") {
      if (room.hostId !== pid) return;
      const n = connectedIds(room).length;
      if (n < PARTY_GAMES[room.gameSlug].minPlayers) return;
      room.settings = MODULES[room.gameSlug].normalizeSettings(room.settings, n);
      startGame(room);
      push(room);
      return;
    }
    room.game!.module.action(ctxFor(room), room.game!.state, pid, a);
  });

  socket.on("draw:op", (op: DrawOp) => {
    const cur = currentRoom(socket);
    if (!cur?.room.game?.module.op || !allow(socket, "draw", 60, 120)) return;
    cur.room.game.module.op(ctxFor(cur.room), cur.room.game.state, cur.pid, op);
  });

  socket.on("game:sync", (_: unknown, ack?: (data: unknown) => void) => {
    const cur = currentRoom(socket);
    const g = cur?.room.game;
    ack?.(g?.module.sync ? g.module.sync(ctxFor(cur!.room), g.state, cur!.pid) : null);
  });

  socket.on("disconnect", () => {
    const cur = currentRoom(socket);
    if (!cur) return;
    const { room, pid } = cur;
    const p = room.players.get(pid)!;
    p.socketId = null;
    p.leftAt = Date.now();
    holdSeat(room, pid);
    ensureHost(room);
    if (room.game) room.game.module.onConnectionChange?.(ctxFor(room), room.game.state, pid);
    push(room);
  });
});

// Safety net: drop rooms nobody is connected to after the grace period, and very old rooms
setInterval(() => {
  const now = Date.now();
  for (const room of rooms.values()) {
    const anyone = playerList(room).some((p) => p.socketId);
    const stale = now - room.createdAt > 12 * 3600_000;
    if ((!anyone && playerList(room).every((p) => p.leftAt && now - p.leftAt > RECONNECT_GRACE_S * 1000 + 30_000)) || stale) {
      for (const t of room.timers.values()) clearTimeout(t);
      rooms.delete(room.code);
    }
  }
}, 60_000).unref();

/** Keep a disconnected player's seat for a while: phones drop the connection when the screen locks */
function holdSeat(room: Room, pid: string) {
  clearTimeout(room.timers.get(`gone:${pid}`));
  room.timers.set(
    `gone:${pid}`,
    setTimeout(() => {
      room.timers.delete(`gone:${pid}`);
      const still = room.players.get(pid);
      if (still && !still.socketId) removePlayer(room, pid);
    }, RECONNECT_GRACE_S * 1000),
  );
}

/** Bring back the rooms saved by the previous process (deploy / restart) */
async function restoreRooms() {
  const snap = await loadRooms();
  if (!snap) return;
  const now = Date.now();
  for (const pr of snap.rooms) {
    if (rooms.has(pr.code) || !isPartySlug(pr.gameSlug)) continue;
    const room: Room = {
      code: pr.code,
      gameSlug: pr.gameSlug,
      hostId: pr.hostId,
      status: pr.status,
      settings: pr.settings,
      createdAt: pr.createdAt,
      used: pr.used instanceof Set ? pr.used : new Set(),
      custom: pr.custom ?? null,
      players: new Map(pr.players.map((p) => [p.id, { ...p, socketId: null, leftAt: now }])),
      timers: new Map(),
      game: null,
    };
    rooms.set(room.code, room);
    if (pr.game && room.status === "playing") {
      const module = MODULES[room.gameSlug];
      room.game = { module, state: pr.game.state };
      module.resume?.(ctxFor(room), room.game.state, snap.pausedMs);
    } else {
      room.status = "lobby";
    }
    for (const pid of room.players.keys()) holdSeat(room, pid);
  }
  console.log(`[realtime] restored ${snap.rooms.length} room(s) after ${Math.round(snap.pausedMs / 1000)}s`);
}

restoreRooms()
  .catch((err) => console.error("[realtime] restore failed", err))
  .finally(() => {
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`[realtime] listening on :${PORT} (cors: ${CORS_ORIGINS.join(", ")})`);
    });
  });

let shuttingDown = false;
async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  setTimeout(() => process.exit(0), 8000).unref();
  // Save rooms first (Docker gives 10s after SIGTERM), then drop the connections
  const saved = await saveRooms(rooms.values()).catch(() => 0);
  if (saved) console.log(`[realtime] saved ${saved} room(s) for the next start`);
  io.close(() => process.exit(0));
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
