import type { ChatMsg, DrawOp, GameAction, GameView, PartySettings } from "@play4fun/party";
import type { Room } from "../rooms";

/** What a game module can do with its room */
export type Ctx = {
  room: Room;
  /** Send every connected player a fresh personal view */
  push(): void;
  /** Ephemeral event to some players (ids) or everyone in the room */
  emit(event: "chat:msg", data: ChatMsg, to?: string[]): void;
  emit(event: "draw:op", data: DrawOp, to?: string[]): void;
  /** One timer per key: setting a key again replaces the previous timer */
  timer(key: string, ms: number, fn: () => void): void;
  clearTimer(key: string): void;
  /** Connected player ids in join order */
  connected(): string[];
  name(id: string): string;
  isHost(id: string): boolean;
  now(): number;
};

export interface GameModule<S, Settings extends PartySettings = PartySettings> {
  /** Validate/clamp settings sent by the host (player count is the current lobby size) */
  normalizeSettings(raw: unknown, players: number): Settings;
  /** Can the game start with these players? Return an error text, or null */
  canStart?(ctx: Ctx, settings: Settings): string | null;
  start(ctx: Ctx, settings: Settings): S;
  action(ctx: Ctx, s: S, pid: string, a: GameAction): void;
  view(ctx: Ctx, s: S, pid: string): GameView;
  /** A new player joined a running game (only for games with lateJoin) */
  onJoin?(ctx: Ctx, s: S, pid: string): void;
  /** Connection dropped (seat kept) or came back */
  onConnectionChange?(ctx: Ctx, s: S, pid: string): void;
  /** Seat removed for good (grace period over / left / kicked) */
  onRemove?(ctx: Ctx, s: S, pid: string): void;
  /** Drawing ops (Vẽ & đoán) */
  op?(ctx: Ctx, s: S, pid: string, op: DrawOp): void;
  /** Full state a client needs after (re)connecting that is not part of the view (strokes, chat) */
  sync?(ctx: Ctx, s: S, pid: string): unknown;
}

export type RunningGame = { module: GameModule<unknown>; state: unknown };

// ------------------------------------------------------------ helpers for modules

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick n items, preferring ones whose id is not in `used`; marks the picks as used */
export function pickFresh<T>(items: readonly T[], idOf: (t: T) => string, used: Set<string>, n: number): T[] {
  let fresh = shuffle(items.filter((t) => !used.has(idOf(t))));
  if (fresh.length < n) {
    // Pool exhausted for this room: forget this pool's history and start over
    for (const t of items) used.delete(idOf(t));
    fresh = shuffle(items);
  }
  const picks = fresh.slice(0, n);
  for (const t of picks) used.add(idOf(t));
  return picks;
}

export const pickOne = <T>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

export function clampOption(raw: unknown, options: number[], fallback: number) {
  return typeof raw === "number" && options.includes(raw) ? raw : fallback;
}
