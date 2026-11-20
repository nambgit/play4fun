/**
 * Deadline Dash — pure endless-runner logic (no DOM).
 * Logical coordinates: width is chosen by the component (wide on desktop, narrower on phones),
 * height is fixed. A red "deadline" wall chases the player: every stumble lets it close in,
 * clean running slowly rebuilds the lead. Caught = game over.
 */
import { SCENARIOS, type Scenario } from "./content";

export const H = 320;
export const GROUND = 262;
export const PLAYER_X = 150;
export const PLAYER_W = 28;
export const STAND_H = 58;
export const DUCK_H = 30;

const GRAVITY = 2600;
const JUMP_V = 900; // apex ≈ 156px, airtime ≈ 0.69s
const FAST_FALL = 5200;
const JUMP_BUFFER = 0.12;
const COYOTE = 0.08;

const BASE_SPEED = 280;
const MAX_SPEED = 620;
const SPEED_GAIN = 5; // px/s per second
const TURBO_SECONDS = 4;
const TURBO_MULT = 1.35;

const HIT_COST = 45;
const COFFEE_LEAD = 8;
const INVULN = 1.2;
/** Lead regained per second of clean running — generous early, stingy later so runs end in ~1–3 min */
const leadRegen = (t: number) => Math.max(0.4, 3 - t * 0.025);

export type ObKind = "box" | "meeting" | "vacuum" | "bubble";
export type Obstacle = { kind: ObKind; x: number; y: number; w: number; h: number; label: string; vx: number; smashed: boolean };
export type Coffee = { x: number; y: number; taken: boolean };
export type Particle = { x: number; y: number; vx: number; vy: number; rot: number; vr: number; life: number; max: number; color: string };

export type Input = { jump: boolean; duck: boolean; duckTimer: number };

export type GameState = {
  W: number;
  t: number;
  speed: number;
  dist: number;
  py: number;
  vy: number;
  onGround: boolean;
  ducking: boolean;
  jumpBuffer: number;
  coyote: number;
  runAnim: number;
  obstacles: Obstacle[];
  coffees: Coffee[];
  particles: Particle[];
  nextSpawn: number;
  lead: number;
  invuln: number;
  meter: number;
  turbo: number;
  coffeeCount: number;
  hits: number;
  smashed: number;
  banner: { text: string; tone: "good" | "bad" | "info"; t: number } | null;
  over: boolean;
  deadFor: number;
  scenario: Scenario;
  rng: () => number;
  decks: { messages: Deck; boxes: Deck; meetings: Deck };
};

type Deck = { cards: string[]; i: number };

export function createInput(): Input {
  return { jump: false, duck: false, duckTimer: 0 };
}

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

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawFrom(deck: Deck, rng: () => number) {
  if (deck.i >= deck.cards.length) {
    deck.cards = shuffle(deck.cards, rng);
    deck.i = 0;
  }
  return deck.cards[deck.i++];
}

/** Picks a random scenario, never the one played last time. */
export function pickScenario(rng: () => number, lastId?: string | null): Scenario {
  const pool = SCENARIOS.filter((s) => s.id !== lastId);
  return pool[Math.floor(rng() * pool.length)];
}

export function createGame(width: number, seed = Date.now(), lastScenarioId?: string | null): GameState {
  const rng = makeRng(seed);
  const scenario = pickScenario(rng, lastScenarioId);
  return {
    W: width,
    t: 0,
    speed: BASE_SPEED,
    dist: 0,
    py: GROUND,
    vy: 0,
    onGround: true,
    ducking: false,
    jumpBuffer: 0,
    coyote: 0,
    runAnim: 0,
    obstacles: [],
    coffees: [],
    particles: [],
    nextSpawn: BASE_SPEED * 1.6,
    lead: 100,
    invuln: 0,
    meter: 0,
    turbo: 0,
    coffeeCount: 0,
    hits: 0,
    smashed: 0,
    banner: { text: `${scenario.title} — ${scenario.subtitle}`, tone: "info", t: 2.8 },
    over: false,
    deadFor: 0,
    scenario,
    rng,
    decks: {
      messages: { cards: shuffle(scenario.messages, rng), i: 0 },
      boxes: { cards: shuffle(scenario.boxes, rng), i: 0 },
      meetings: { cards: shuffle(scenario.meetings, rng), i: 0 },
    },
  };
}

export const meters = (s: GameState) => Math.floor(s.dist / 40);
export const scoreOf = (s: GameState) => meters(s) + s.coffeeCount * 25 + s.smashed * 10;

// ------------------------------------------------------------ spawning

const textWidth = (label: string) => Math.min(250, 30 + label.length * 8.2);

function spawnBox(s: GameState, x: number) {
  const w = 30 + Math.floor(s.rng() * 22);
  const h = 34 + Math.floor(s.rng() * 24);
  s.obstacles.push({ kind: "box", x, y: GROUND - h, w, h, label: drawFrom(s.decks.boxes, s.rng), vx: 0, smashed: false });
  return w;
}

function spawnMeeting(s: GameState, x: number) {
  const w = 104;
  const h = 42;
  s.obstacles.push({ kind: "meeting", x, y: GROUND - h, w, h, label: drawFrom(s.decks.meetings, s.rng), vx: 0, smashed: false });
  return w;
}

function spawnVacuum(s: GameState, x: number) {
  s.obstacles.push({ kind: "vacuum", x, y: GROUND - 18, w: 40, h: 18, label: "", vx: 90, smashed: false });
  return 40;
}

function spawnBubble(s: GameState, x: number) {
  const label = drawFrom(s.decks.messages, s.rng);
  const w = textWidth(label);
  // Bottom edge 40px above the floor: ducking (30px) slips under, standing (58px) doesn't,
  // and a jump can't clear it either — the only answer is to duck.
  s.obstacles.push({ kind: "bubble", x, y: GROUND - 84, w, h: 44, label, vx: 0, smashed: false });
  return w;
}

function addCoffee(s: GameState, x: number, y: number) {
  s.coffees.push({ x, y, taken: false });
}

/** Spawns one pattern at the right edge and returns the gap (px) until the next one. */
function spawnPattern(s: GameState): number {
  const x = s.W + 40;
  const t = s.t;
  const rng = s.rng;
  const d = Math.min(1, t / 90);
  const minGapTime = 0.95 - 0.35 * d;
  const gap = () => s.speed * (minGapTime + rng() * 0.6);

  const options: [number, () => number][] = [
    [1, () => spawnBox(s, x)],
    [t > 5 ? 0.6 : 0, () => spawnMeeting(s, x)],
    [t > 8 ? 0.75 : 0, () => spawnBubble(s, x)],
    [t > 15 ? 0.4 : 0, () => spawnVacuum(s, x)],
    [
      t > 25 ? 0.35 : 0,
      () => {
        // two quick jumps — the gap must outlast one full airtime (~0.69s) so the player can land and re-jump
        const w1 = spawnBox(s, x);
        const x2 = x + w1 + s.speed * 0.9;
        return x2 - x + spawnBox(s, x2);
      },
    ],
    [
      t > 30 ? 0.4 : 0,
      () => {
        // duck, then jump
        const w1 = spawnBubble(s, x);
        const x2 = x + w1 + s.speed * 0.7;
        return x2 - x + spawnBox(s, x2);
      },
    ],
  ];

  const total = options.reduce((a, [w]) => a + w, 0);
  let roll = rng() * total;
  let width = 0;
  for (const [w, fn] of options) {
    if ((roll -= w) <= 0) {
      width = fn();
      break;
    }
  }

  const last = s.obstacles[s.obstacles.length - 1];
  const g = gap();
  if (rng() < 0.5 && last) {
    if (last.kind === "bubble") addCoffee(s, last.x + last.w / 2, GROUND - 16); // reward ducking
    else if (rng() < 0.5) addCoffee(s, last.x + last.w / 2, GROUND - last.h - 70); // arc over the jump
    else addCoffee(s, x + width + g * 0.5, GROUND - 22); // on the floor in the gap
  }
  return width + g;
}

// ------------------------------------------------------------ step

function burst(s: GameState, x: number, y: number, n: number, colors: string[], speed = 260) {
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (s.rng() - 0.5) * Math.PI * 1.4;
    const v = speed * (0.4 + s.rng() * 0.8);
    const max = 0.6 + s.rng() * 0.6;
    s.particles.push({
      x,
      y,
      vx: Math.cos(a) * v - s.speed * 0.3,
      vy: Math.sin(a) * v,
      rot: s.rng() * Math.PI,
      vr: (s.rng() - 0.5) * 12,
      life: max,
      max,
      color: colors[Math.floor(s.rng() * colors.length)],
    });
  }
}

export function playerBox(s: GameState) {
  const h = s.ducking ? DUCK_H : STAND_H;
  const w = s.ducking ? PLAYER_W + 14 : PLAYER_W;
  return { x: PLAYER_X - w / 2, y: s.py - h, w, h };
}

const overlap = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }, pad: number) =>
  a.x + pad < b.x + b.w && a.x + a.w - pad > b.x && a.y + pad < b.y + b.h && a.y + a.h - pad > b.y;

export function step(s: GameState, dt: number, input: Input) {
  for (let i = s.particles.length - 1; i >= 0; i--) {
    const p = s.particles[i];
    p.life -= dt;
    p.vy += 900 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    if (p.life <= 0) s.particles.splice(i, 1);
  }
  if (s.banner) {
    s.banner.t -= dt;
    if (s.banner.t <= 0) s.banner = null;
  }
  if (s.over) {
    s.deadFor += dt;
    return;
  }

  s.t += dt;
  s.turbo = Math.max(0, s.turbo - dt);
  s.invuln = Math.max(0, s.invuln - dt);
  s.speed = Math.min(MAX_SPEED, BASE_SPEED + s.t * SPEED_GAIN) * (s.turbo > 0 ? TURBO_MULT : 1);
  s.dist += s.speed * dt;
  s.runAnim += dt * s.speed * 0.045;

  // --- player
  if (input.jump) {
    s.jumpBuffer = JUMP_BUFFER;
    input.jump = false;
  }
  s.coyote = s.onGround ? COYOTE : s.coyote - dt;
  if (s.jumpBuffer > 0 && s.coyote > 0) {
    s.vy = -JUMP_V;
    s.onGround = false;
    s.coyote = 0;
    s.jumpBuffer = 0;
  }
  s.jumpBuffer = Math.max(0, s.jumpBuffer - dt);
  input.duckTimer = Math.max(0, input.duckTimer - dt);
  const wantsDuck = input.duck || input.duckTimer > 0;
  s.ducking = wantsDuck && s.onGround;
  s.vy += (GRAVITY + (wantsDuck && !s.onGround ? FAST_FALL : 0)) * dt;
  s.py += s.vy * dt;
  if (s.py >= GROUND) {
    s.py = GROUND;
    s.vy = 0;
    s.onGround = true;
  }

  // --- world
  s.nextSpawn -= s.speed * dt;
  if (s.nextSpawn <= 0) s.nextSpawn = spawnPattern(s);

  for (const o of s.obstacles) o.x -= (s.speed + o.vx) * dt;
  for (const c of s.coffees) c.x -= s.speed * dt;
  s.obstacles = s.obstacles.filter((o) => o.x + o.w > -80);
  s.coffees = s.coffees.filter((c) => c.x > -40 && !c.taken);

  // --- collisions
  const pb = playerBox(s);
  for (const o of s.obstacles) {
    if (o.smashed || !overlap(pb, o, 4)) continue;
    if (s.turbo > 0) {
      o.smashed = true;
      s.smashed++;
      burst(s, o.x + o.w / 2, o.y + o.h / 2, 14, ["#ffffff", "#e9e4f5", "#c9b8ff"]);
      continue;
    }
    if (s.invuln > 0) continue;
    s.hits++;
    s.lead -= HIT_COST;
    s.invuln = INVULN;
    o.smashed = true;
    burst(s, PLAYER_X, s.py - 30, 12, ["#ffffff", "#f1f1f1", "#ffd2c2"]);
    if (s.lead <= 0) {
      s.lead = 0;
      s.over = true;
      s.deadFor = 0;
      s.banner = { text: "Deadline đã bắt kịp bạn!", tone: "bad", t: 3 };
      return;
    }
    s.banner = {
      text: o.kind === "bubble" ? `Dính tin nhắn “${o.label}” — deadline áp sát!` : `Vấp phải ${o.label || "robot hút bụi"}! Deadline áp sát!`,
      tone: "bad",
      t: 1.6,
    };
  }

  for (const c of s.coffees) {
    if (c.taken) continue;
    if (Math.abs(c.x - PLAYER_X) < 24 && c.y > pb.y - 14 && c.y < pb.y + pb.h + 14) {
      c.taken = true;
      s.coffeeCount++;
      s.lead = Math.min(100, s.lead + COFFEE_LEAD);
      s.meter++;
      burst(s, c.x, c.y, 6, ["#8b5a2b", "#f5e6d3"], 160);
      if (s.meter >= 3) {
        s.meter = 0;
        s.turbo = TURBO_SECONDS;
        s.banner = { text: "☕ TURBO CÀ PHÊ! Húc bay mọi thứ!", tone: "good", t: 1.8 };
      }
    }
  }

  s.lead = Math.min(100, s.lead + leadRegen(s.t) * dt);
}

// ------------------------------------------------------------ results

const TITLES: [number, string][] = [
  [2500, "Huyền thoại văn phòng"],
  [1500, "Siêu nhân OT"],
  [800, "Chiến thần deadline"],
  [300, "Nhân viên đúng giờ"],
  [0, "Người đi muộn kinh niên"],
];

export function titleFor(m: number) {
  return TITLES.find(([min]) => m >= min)![1];
}
