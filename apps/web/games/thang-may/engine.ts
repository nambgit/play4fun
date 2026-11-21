/**
 * Thang máy giờ cao điểm — rush-hour elevator dispatcher (pure logic, no React / DOM).
 *
 * The clock runs from 8:00 to 9:00 in GAME_SECONDS real seconds. Employees keep arriving in
 * the lobby, each going to one floor and with limited patience. The player picks who boards
 * (up to CAPACITY) and sends the car. A trip takes longer the higher it goes and the more
 * different floors it stops at, so grouping people by floor delivers more of them in time.
 * Someone whose patience runs out walks off to take the stairs: one heart lost.
 */

export const GAME_SECONDS = 90;
export const CAPACITY = 6;
export const MAX_LOBBY = 12;
export const MAX_LIVES = 3;
export const FLOORS = { min: 2, max: 12 } as const;

/** Trip time: doors + travel up and back + each stop */
const DOOR_S = 1;
const PER_FLOOR_S = 0.15;
const PER_STOP_S = 1.6;

const AVATARS = ["👩‍💼", "👨‍💼", "🧑‍💻", "👩‍💻", "👨‍🔧", "👩‍🎨", "🧑‍🏫", "👨‍🍳", "👩‍🔬", "🧑‍💼", "👨‍💻", "👩‍🏫"];

export type Person = { id: number; floor: number; avatar: string; patience: number; total: number; picked: boolean };

export type Trip = { floors: number[]; people: number; left: number; total: number; nice: boolean };

export type Feedback = { text: string; good: boolean; t: number };

export type GameState = {
  t: number;
  lobby: Person[];
  trip: Trip | null;
  nextSpawn: number;
  lives: number;
  delivered: number;
  score: number;
  trips: number;
  niceTrips: number;
  angry: number;
  feedback: Feedback | null;
  over: boolean;
  overReason: "time" | "lives" | null;
  uid: number;
  /** Busy department floors this game */
  hotFloors: number[];
  rng: () => number;
};

function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** "8:37" for the in-game clock */
export function clockText(t: number) {
  const minutes = Math.min(60, Math.floor((t / GAME_SECONDS) * 60));
  return minutes >= 60 ? "9:00" : `8:${String(minutes).padStart(2, "0")}`;
}

export function tripSeconds(floors: number[]) {
  if (!floors.length) return 0;
  const top = Math.max(...floors);
  const stops = new Set(floors).size;
  return DOOR_S + top * PER_FLOOR_S * 2 + stops * PER_STOP_S;
}

/** Arrivals speed up as 9:00 gets closer; patience gets shorter */
const spawnGap = (t: number, rng: () => number) => Math.max(0.7, 1.75 - t * 0.012) * (0.7 + rng() * 0.6);
const patienceAt = (t: number) => Math.max(15, 26 - t * 0.12);

function spawn(s: GameState) {
  if (s.lobby.length >= MAX_LOBBY) return;
  // Most people work on a few busy department floors, which rewards grouping
  const floor = s.rng() < 0.75 ? s.hotFloors[Math.floor(s.rng() * s.hotFloors.length)] : FLOORS.min + Math.floor(s.rng() * (FLOORS.max - FLOORS.min + 1));
  const total = patienceAt(s.t);
  s.lobby.push({ id: s.uid++, floor, avatar: AVATARS[Math.floor(s.rng() * AVATARS.length)], patience: total, total, picked: false });
}

function pickHotFloors(rng: () => number) {
  const all = Array.from({ length: FLOORS.max - FLOORS.min + 1 }, (_, i) => FLOORS.min + i);
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, 4).sort((a, b) => a - b);
}

export function createGame(seed = Date.now()): GameState {
  const rng = makeRng(seed);
  const s: GameState = {
    t: 0,
    lobby: [],
    trip: null,
    nextSpawn: 0.6,
    lives: MAX_LIVES,
    delivered: 0,
    score: 0,
    trips: 0,
    niceTrips: 0,
    angry: 0,
    feedback: null,
    over: false,
    overReason: null,
    uid: 1,
    hotFloors: pickHotFloors(rng),
    rng,
  };
  for (let i = 0; i < 4; i++) spawn(s);
  return s;
}

export const picked = (s: GameState) => s.lobby.filter((p) => p.picked);

/** Tap a person: select / unselect for the next trip (selection works while the car is away) */
export function toggle(s: GameState, id: number) {
  if (s.over) return;
  const p = s.lobby.find((x) => x.id === id);
  if (!p) return;
  if (!p.picked && picked(s).length >= CAPACITY) {
    s.feedback = { text: `Thang chỉ chở ${CAPACITY} người!`, good: false, t: 0 };
    return;
  }
  p.picked = !p.picked;
}

export const canSend = (s: GameState) => !s.over && !s.trip && picked(s).length > 0;

/** Close the doors and go */
export function send(s: GameState) {
  if (!canSend(s)) return;
  const riders = picked(s);
  const floors = riders.map((p) => p.floor);
  const total = tripSeconds(floors);
  const nice = riders.length >= 3 && new Set(floors).size <= 2;
  s.trip = { floors: [...new Set(floors)].sort((a, b) => a - b), people: riders.length, left: total, total, nice };
  s.lobby = s.lobby.filter((p) => !p.picked);
  s.trips++;
  // Delivered on departure: they are inside, nobody can walk off any more
  s.delivered += riders.length;
  s.score += riders.length * 10 + (nice ? riders.length * 5 : 0);
  if (nice) {
    s.niceTrips++;
    s.feedback = { text: `Chuyến đẹp! +${riders.length * 5} điểm thưởng`, good: true, t: 0 };
  }
}

export function tick(s: GameState, dt: number) {
  if (s.over) return;
  s.t += dt;
  if (s.feedback) {
    s.feedback.t += dt;
    if (s.feedback.t > 1.4) s.feedback = null;
  }
  if (s.trip) {
    s.trip.left -= dt;
    if (s.trip.left <= 0) s.trip = null;
  }
  s.nextSpawn -= dt;
  if (s.nextSpawn <= 0) {
    spawn(s);
    s.nextSpawn = spawnGap(s.t, s.rng);
  }
  for (const p of s.lobby) p.patience -= dt;
  const gone = s.lobby.filter((p) => p.patience <= 0);
  if (gone.length) {
    s.lobby = s.lobby.filter((p) => p.patience > 0);
    s.lives -= gone.length;
    s.angry += gone.length;
    s.feedback = { text: gone.length > 1 ? `${gone.length} người bỏ đi thang bộ!` : "Có người bỏ đi thang bộ!", good: false, t: 0 };
  }
  if (s.lives <= 0) {
    s.lives = 0;
    s.over = true;
    s.overReason = "lives";
  } else if (s.t >= GAME_SECONDS) {
    s.over = true;
    s.overReason = "time";
  }
}

const RANKS: [number, string][] = [
  [350, "Thực tập sinh bấm thang"],
  [550, "Bảo vệ tòa nhà tận tâm"],
  [750, "Quản lý tòa nhà xuất sắc"],
  [Infinity, "Huyền thoại giờ cao điểm"],
];
export const rankFor = (score: number) => RANKS.find(([max]) => score < max)![1];
