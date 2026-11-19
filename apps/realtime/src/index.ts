import { createServer } from "node:http";
import { Server } from "socket.io";
import { MAX_PLAYERS, cleanName, newRoomCode, rooms, view, type Room } from "./rooms";

const PORT = Number(process.env.PORT ?? 3001);
const CORS_ORIGINS = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

type Ack = (res: { ok: true; room: ReturnType<typeof view> } | { ok: false; error: string }) => void;

const httpServer = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok", rooms: rooms.size }));
    return;
  }
  res.writeHead(404).end();
});

// Socket.IO dùng path mặc định /socket.io — nginx forward path này sang container realtime.
const io = new Server(httpServer, {
  cors: { origin: CORS_ORIGINS, credentials: true },
});

function broadcast(room: Room) {
  io.to(room.code).emit("room:state", view(room));
}

function leaveCurrentRoom(socketId: string) {
  for (const room of rooms.values()) {
    if (!room.players.delete(socketId)) continue;
    io.sockets.sockets.get(socketId)?.leave(room.code);
    if (room.players.size === 0) {
      rooms.delete(room.code);
    } else {
      if (room.hostId === socketId) room.hostId = room.players.keys().next().value!;
      broadcast(room);
    }
  }
}

io.on("connection", (socket) => {
  socket.on("room:create", (payload: { gameSlug?: unknown; name?: unknown }, ack: Ack) => {
    const name = cleanName(payload?.name);
    const gameSlug = typeof payload?.gameSlug === "string" ? payload.gameSlug.slice(0, 64) : null;
    if (!name || !gameSlug) return ack?.({ ok: false, error: "invalid_input" });

    leaveCurrentRoom(socket.id);
    const room: Room = {
      code: newRoomCode(),
      gameSlug,
      hostId: socket.id,
      players: new Map([[socket.id, { id: socket.id, name }]]),
      status: "lobby",
      createdAt: Date.now(),
    };
    rooms.set(room.code, room);
    socket.join(room.code);
    ack?.({ ok: true, room: view(room) });
  });

  socket.on("room:join", (payload: { code?: unknown; name?: unknown }, ack: Ack) => {
    const name = cleanName(payload?.name);
    const code = typeof payload?.code === "string" ? payload.code.trim().toUpperCase() : "";
    const room = rooms.get(code);
    if (!name) return ack?.({ ok: false, error: "invalid_input" });
    if (!room) return ack?.({ ok: false, error: "room_not_found" });
    if (room.status !== "lobby") return ack?.({ ok: false, error: "game_in_progress" });
    if (room.players.size >= MAX_PLAYERS) return ack?.({ ok: false, error: "room_full" });

    leaveCurrentRoom(socket.id);
    room.players.set(socket.id, { id: socket.id, name });
    socket.join(room.code);
    ack?.({ ok: true, room: view(room) });
    broadcast(room);
  });

  socket.on("room:leave", () => leaveCurrentRoom(socket.id));
  socket.on("disconnect", () => leaveCurrentRoom(socket.id));
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`[realtime] listening on :${PORT} (cors: ${CORS_ORIGINS.join(", ")})`);
});

function shutdown() {
  io.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
