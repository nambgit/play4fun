/**
 * Keep party rooms across deploys/restarts: on shutdown every room is written to Valkey
 * (REDIS_URL), on startup it is read back. Players' phones reconnect on their own and get
 * their seats back (they have RECONNECT_GRACE_S to come back). Timers are re-armed by each
 * game module's resume(), with deadlines pushed back by the downtime so nobody loses time.
 */
import { createClient } from "redis";
import type { Room } from "./rooms";

const KEY = "p4f:realtime:rooms";
const TTL_S = 15 * 60;

type Snapshot = { savedAt: number; rooms: unknown[] };

/** JSON with Set/Map support (game states use both) */
const replacer = (_k: string, v: unknown) =>
  v instanceof Set ? { __t: "Set", v: [...v] } : v instanceof Map ? { __t: "Map", v: [...v] } : v;
const reviver = (_k: string, v: unknown) => {
  if (v && typeof v === "object" && "__t" in v) {
    const o = v as { __t: string; v: unknown[] };
    if (o.__t === "Set") return new Set(o.v);
    if (o.__t === "Map") return new Map(o.v as [unknown, unknown][]);
  }
  return v;
};

const makeClient = (url: string) => createClient({ url, socket: { connectTimeout: 2000, reconnectStrategy: false } });
type Client = ReturnType<typeof makeClient>;

async function withClient<T>(fn: (c: Client) => Promise<T>): Promise<T | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  const client = makeClient(url);
  client.on("error", () => {});
  try {
    await client.connect();
    return await fn(client);
  } catch (err) {
    console.error("[realtime] valkey unavailable:", (err as Error).message);
    return null;
  } finally {
    client.destroy();
  }
}

/** Serializable copy of a room (no sockets, no timers) */
function toPlain(room: Room) {
  return {
    code: room.code,
    gameSlug: room.gameSlug,
    hostId: room.hostId,
    status: room.status,
    settings: room.settings,
    createdAt: room.createdAt,
    used: room.used,
    custom: room.custom,
    players: [...room.players.values()].map((p) => ({ id: p.id, secret: p.secret, name: p.name, joinedAt: p.joinedAt })),
    game: room.game ? { state: room.game.state } : null,
    gameNo: room.gameNo,
    matched: room.matched,
  };
}
export type PlainRoom = ReturnType<typeof toPlain>;

export async function saveRooms(rooms: Iterable<Room>) {
  const list = [...rooms].filter((r) => r.players.size > 0).map(toPlain);
  if (list.length === 0) return 0;
  const snap: Snapshot = { savedAt: Date.now(), rooms: list };
  const ok = await withClient((c) => c.set(KEY, JSON.stringify(snap, replacer), { expiration: { type: "EX", value: TTL_S } }));
  return ok ? list.length : 0;
}

/** Read and clear the snapshot (each snapshot is restored once) */
export async function loadRooms(): Promise<{ pausedMs: number; rooms: PlainRoom[] } | null> {
  const raw = await withClient((c) => c.getDel(KEY));
  if (!raw) return null;
  try {
    const snap = JSON.parse(String(raw), reviver) as Snapshot;
    return { pausedMs: Math.max(0, Date.now() - snap.savedAt), rooms: snap.rooms as PlainRoom[] };
  } catch {
    return null;
  }
}
