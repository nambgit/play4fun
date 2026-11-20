"use client";

import {
  JOIN_ERROR_TEXT,
  type ChatMsg,
  type DrawOp,
  type GameAction,
  type JoinResult,
  type PartySettings,
  type PartySlug,
  type ServerState,
} from "@play4fun/party";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

const PID_KEY = "p4f:pid";
const NAME_KEY = "p4f:name";
const roomKey = (slug: string) => `p4f:party:${slug}:room`;

function store(kind: "get" | "set" | "del", key: string, value?: string) {
  try {
    if (kind === "get") return localStorage.getItem(key);
    if (kind === "set") localStorage.setItem(key, value!);
    else localStorage.removeItem(key);
  } catch {
    /* storage blocked: works for this tab only */
  }
  return null;
}

function playerId() {
  let id = store("get", PID_KEY);
  if (!id || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) {
    id = (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`).replace(/[^A-Za-z0-9_-]/g, "");
    store("set", PID_KEY, id);
  }
  return id;
}

/**
 * Production: same origin (nginx proxies /socket.io/ to the realtime container).
 * Dev: Next runs on :3000 and the realtime server on :3001.
 */
function realtimeUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_REALTIME_URL;
  if (fromEnv) return fromEnv;
  const { protocol, hostname, port, origin } = window.location;
  return port === "3000" ? `${protocol}//${hostname}:3001` : origin;
}

export type Connection = "connecting" | "online" | "offline";

export type PartyApi = ReturnType<typeof useParty>;

export function useParty(slug: PartySlug) {
  const socketRef = useRef<Socket | null>(null);
  const pidRef = useRef("");
  const offsetRef = useRef(0);
  const [state, setState] = useState<ServerState | null>(null);
  const [conn, setConn] = useState<Connection>("connecting");
  const [notice, setNotice] = useState<string | null>(null);
  const [savedName, setSavedName] = useState("");
  const listeners = useRef({ chat: new Set<(m: ChatMsg) => void>(), op: new Set<(o: DrawOp) => void>() });

  const apply = useCallback(
    (st: ServerState) => {
      offsetRef.current = st.serverNow - Date.now();
      setState(st);
      store("set", roomKey(slug), st.room.code);
    },
    [slug],
  );

  const drop = useCallback(
    (msg: string | null) => {
      setState(null);
      store("del", roomKey(slug));
      setNotice(msg);
    },
    [slug],
  );

  useEffect(() => {
    pidRef.current = playerId();
    setSavedName(store("get", NAME_KEY) ?? "");
    const socket = io(realtimeUrl(), { transports: ["websocket", "polling"], reconnectionDelayMax: 4000 });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConn("online");
      // Rejoin the room we were in (reload, phone woke up, network blip)
      const code = store("get", roomKey(slug));
      const name = store("get", NAME_KEY);
      if (code && name) {
        socket.emit("room:join", { code, name, pid: pidRef.current, gameSlug: slug }, (r: JoinResult) => {
          if (r.ok) apply(r.state);
          else drop(r.error === "room_not_found" ? "Phòng cũ đã đóng." : null);
        });
      }
    });
    socket.on("disconnect", () => setConn("connecting"));
    socket.io.on("reconnect_failed", () => setConn("offline"));
    socket.on("connect_error", () => setConn((c) => (c === "online" ? "connecting" : c === "connecting" && !socket.active ? "offline" : c)));
    socket.on("room:state", apply);
    socket.on("room:kicked", () => drop("Bạn đã được mời ra khỏi phòng."));
    socket.on("room:replaced", () => drop("Bạn đã mở phòng này ở một tab khác."));
    socket.on("chat:msg", (m: ChatMsg) => listeners.current.chat.forEach((fn) => fn(m)));
    socket.on("draw:op", (o: DrawOp) => listeners.current.op.forEach((fn) => fn(o)));
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [apply, drop, slug]);

  const enter = useCallback(
    (kind: "create" | "join", name: string, code?: string) =>
      new Promise<string | null>((resolve) => {
        const socket = socketRef.current;
        if (!socket?.connected) return resolve("Chưa kết nối được máy chủ, thử lại sau giây lát.");
        store("set", NAME_KEY, name);
        setSavedName(name);
        setNotice(null);
        const payload = kind === "create" ? { gameSlug: slug, name, pid: pidRef.current } : { code, name, pid: pidRef.current, gameSlug: slug };
        socket.timeout(8000).emit(`room:${kind}`, payload, (err: Error | null, r: JoinResult) => {
          if (err) return resolve("Máy chủ không phản hồi, thử lại nhé.");
          if (!r.ok) return resolve(JOIN_ERROR_TEXT[r.error]);
          apply(r.state);
          resolve(null);
        });
      }),
    [apply, slug],
  );

  const api = useMemo(
    () => ({
      create: (name: string) => enter("create", name),
      join: (code: string, name: string) => enter("join", name, code),
      leave: () => {
        socketRef.current?.emit("room:leave");
        drop(null);
      },
      settings: (s: PartySettings) => socketRef.current?.emit("room:settings", s),
      start: () =>
        new Promise<string | null>((resolve) =>
          socketRef.current?.timeout(8000).emit("room:start", null, (err: Error | null, r: { ok: boolean; error?: string }) =>
            resolve(err ? "Máy chủ không phản hồi." : r.ok ? null : (r.error ?? "Chưa bắt đầu được.")),
          ),
        ),
      toLobby: () => socketRef.current?.emit("room:lobby"),
      kick: (id: string) => socketRef.current?.emit("room:kick", id),
      act: (a: GameAction) => socketRef.current?.emit("game:action", a),
      op: (o: DrawOp) => socketRef.current?.emit("draw:op", o),
      sync: <T,>() =>
        new Promise<T | null>((resolve) => socketRef.current?.timeout(5000).emit("game:sync", null, (err: Error | null, data: T) => resolve(err ? null : data))),
      onChat: (fn: (m: ChatMsg) => void) => {
        listeners.current.chat.add(fn);
        return () => void listeners.current.chat.delete(fn);
      },
      onOp: (fn: (o: DrawOp) => void) => {
        listeners.current.op.add(fn);
        return () => void listeners.current.op.delete(fn);
      },
      /** Current time on the server clock (for countdowns) */
      now: () => Date.now() + offsetRef.current,
    }),
    [drop, enter],
  );

  return { state, conn, notice, savedName, ...api };
}

/** Countdown in whole seconds to a server timestamp, re-rendering 4×/s */
export function useCountdown(endsAt: number | undefined, now: () => number) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!endsAt) return;
    const id = setInterval(() => tick((n) => n + 1), 250);
    return () => clearInterval(id);
  }, [endsAt]);
  if (!endsAt) return 0;
  return Math.max(0, Math.ceil((endsAt - now()) / 1000));
}
