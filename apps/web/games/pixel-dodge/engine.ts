/**
 * Pixel Dodge — pure game logic (no DOM / React).
 * Logical arena is W×H pixels, rendered pixelated and scaled up by the component.
 * Randomness comes from a seeded RNG so a "daily challenge" can replay the same run.
 */

export const W = 320;
export const H = 320;

const PLAYER_HIT_R = 1.5;
const GRAZE_R = 9;
const PLAYER_SPEED = 140;
const PLAYER_FOCUS_SPEED = 60;
const WAVE_SECONDS = 10;
const PICKUP_EVERY = 20;

export type Kind = "rain" | "aimed" | "ring" | "spiral" | "wall";

export const BULLET_COLOR: Record<Kind, string> = {
  rain: "#ff6a9a",
  aimed: "#ffb547",
  ring: "#5fd0ff",
  spiral: "#b18cff",
  wall: "#ff6a3d",
};

export type Bullet = { x: number; y: number; vx: number; vy: number; r: number; kind: Kind; grazed: boolean };
export type Warn =
  | { type: "point"; x: number; y: number; t: number; total: number }
  | { type: "edge"; side: number; t: number; total: number };
export type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string };
export type Pickup = { x: number; y: number; life: number };

type Pattern = { kind: Kind; timer: number; age: number; angle: number; side: number; rate: number; x: number; y: number };
type Scheduled = { delay: number; fire: (s: GameState) => void };

export type Input = {
  /** keyboard direction, each -1..1 */
  dx: number;
  dy: number;
  /** slow, precise movement (Shift) */
  focus: boolean;
  /** mouse: absolute point to glide toward */
  target: { x: number; y: number } | null;
  /** touch: relative drag delta accumulated since last step */
  dragX: number;
  dragY: number;
};

export type GameState = {
  t: number;
  wave: number;
  waveFlash: number;
  player: { x: number; y: number };
  trail: { x: number; y: number }[];
  bullets: Bullet[];
  warns: Warn[];
  particles: Particle[];
  pickups: Pickup[];
  patterns: Pattern[];
  scheduled: Scheduled[];
  shield: boolean;
  invuln: number;
  grazes: number;
  over: boolean;
  deadFor: number;
  nextPickup: number;
  rng: () => number;
};

export function createInput(): Input {
  return { dx: 0, dy: 0, focus: false, target: null, dragX: 0, dragY: 0 };
}

/** mulberry32 */
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

export function createGame(seed = Date.now()): GameState {
  const s: GameState = {
    t: 0,
    wave: -1,
    waveFlash: 0,
    player: { x: W / 2, y: H * 0.72 },
    trail: [],
    bullets: [],
    warns: [],
    particles: [],
    pickups: [],
    patterns: [],
    scheduled: [],
    shield: false,
    invuln: 0,
    grazes: 0,
    over: false,
    deadFor: 0,
    nextPickup: 15,
    rng: makeRng(seed),
  };
  startWave(s, 0);
  return s;
}

export function scoreOf(s: GameState) {
  return Math.round(s.t * 100) + s.grazes * 25;
}

const difficulty = (wave: number) => Math.min(2.3, 1 + wave * 0.075);

// ---------------------------------------------------------------- waves

const INTRO_ORDER: Kind[] = ["rain", "aimed", "ring", "spiral", "wall"];

function patternsForWave(s: GameState, n: number): Kind[] {
  if (n < INTRO_ORDER.length) return [INTRO_ORDER[n]];
  const pool = [...INTRO_ORDER];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(s.rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n < 10 ? 2 : 3);
}

function startWave(s: GameState, n: number) {
  s.wave = n;
  s.waveFlash = 1.6;
  const kinds = patternsForWave(s, n);
  const rate = kinds.length === 1 ? 1 : kinds.length === 2 ? 0.7 : 0.55;
  s.patterns = kinds.map((kind) => {
    const p: Pattern = {
      kind,
      timer: n === 0 ? 1.2 : 0.4,
      age: 0,
      angle: s.rng() * Math.PI * 2,
      side: n < 5 ? 0 : Math.floor(s.rng() * 4),
      rate,
      x: W / 2,
      y: H / 2,
    };
    if (kind === "spiral") {
      if (n >= 8) {
        p.x = 80 + s.rng() * (W - 160);
        p.y = 80 + s.rng() * (H - 160);
      }
      p.timer = 1;
      s.warns.push({ type: "point", x: p.x, y: p.y, t: 1, total: 1 });
    }
    return p;
  });
}

// ---------------------------------------------------------------- spawning helpers

function addBullet(s: GameState, x: number, y: number, angle: number, speed: number, r: number, kind: Kind) {
  s.bullets.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r, kind, grazed: false });
}

/** Point just inside a given edge (0 top, 1 right, 2 bottom, 3 left); `along` in 0..1 */
function edgePoint(side: number, along: number, inset: number) {
  switch (side) {
    case 0:
      return { x: along * W, y: inset };
    case 1:
      return { x: W - inset, y: along * H };
    case 2:
      return { x: along * W, y: H - inset };
    default:
      return { x: inset, y: along * H };
  }
}

/** Inward-facing angle for an edge */
const inwardAngle = (side: number) => [Math.PI / 2, Math.PI, -Math.PI / 2, 0][side];

function schedule(s: GameState, delay: number, fire: (s: GameState) => void) {
  s.scheduled.push({ delay, fire });
}

function burst(s: GameState, x: number, y: number, n: number, color: string, speed = 60) {
  for (let i = 0; i < n; i++) {
    const a = s.rng() * Math.PI * 2;
    const v = speed * (0.3 + s.rng() * 0.9);
    const max = 0.4 + s.rng() * 0.6;
    s.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: max, max, color });
  }
}

/** Fires one tick of a pattern and returns seconds until its next tick. */
function firePattern(s: GameState, p: Pattern): number {
  const d = difficulty(s.wave);
  const rng = s.rng;

  switch (p.kind) {
    case "rain": {
      const { x, y } = edgePoint(p.side, rng(), -4);
      const spread = (rng() - 0.5) * 0.35;
      addBullet(s, x, y, inwardAngle(p.side) + spread, (50 + rng() * 35) * d, 2, "rain");
      return 0.2 / (d * p.rate);
    }

    case "aimed": {
      const side = Math.floor(rng() * 4);
      const at = edgePoint(side, 0.1 + rng() * 0.8, 6);
      const count = 3 + Math.min(4, Math.floor(s.wave / 3));
      s.warns.push({ type: "point", x: at.x, y: at.y, t: 0.6, total: 0.6 });
      schedule(s, 0.6, (st) => {
        const base = Math.atan2(st.player.y - at.y, st.player.x - at.x);
        for (let i = 0; i < count; i++) {
          addBullet(st, at.x, at.y, base + (i - (count - 1) / 2) * 0.16, 92 * d, 2, "aimed");
        }
      });
      return 1.5 / (d * p.rate);
    }

    case "ring": {
      let at = { x: W / 2, y: H / 2 };
      for (let tries = 0; tries < 12; tries++) {
        at = { x: 30 + rng() * (W - 60), y: 30 + rng() * (H - 60) };
        if (Math.hypot(at.x - s.player.x, at.y - s.player.y) > 90) break;
      }
      const n = 14 + Math.min(12, Math.floor(s.wave * 1.5));
      const offset = rng() * Math.PI * 2;
      s.warns.push({ type: "point", x: at.x, y: at.y, t: 0.8, total: 0.8 });
      schedule(s, 0.8, (st) => {
        for (let i = 0; i < n; i++) addBullet(st, at.x, at.y, offset + (i / n) * Math.PI * 2, 60 * d, 3, "ring");
      });
      return 2.3 / (d * p.rate);
    }

    case "spiral": {
      const arms = s.wave >= 7 ? 3 : 2;
      for (let k = 0; k < arms; k++) {
        addBullet(s, p.x, p.y, p.angle + (k / arms) * Math.PI * 2, 55 * d, 2, "spiral");
      }
      p.angle += 0.29 * (p.side % 2 ? -1 : 1);
      return 0.09 / (Math.sqrt(d) * p.rate);
    }

    case "wall": {
      const side = p.side % 4;
      p.side++;
      const length = side % 2 === 0 ? W : H;
      const gap = Math.max(34, 50 - s.wave);
      const gapCenter = (0.2 + rng() * 0.6) * length;
      s.warns.push({ type: "edge", side, t: 0.6, total: 0.6 });
      schedule(s, 0.6, (st) => {
        for (let pos = 4; pos < length; pos += 11) {
          if (Math.abs(pos - gapCenter) < gap / 2) continue;
          const { x, y } = edgePoint(side, pos / length, -4);
          addBullet(st, x, y, inwardAngle(side), 48 * d, 2, "wall");
        }
      });
      return 2.8 / (d * p.rate);
    }
  }
}

// ---------------------------------------------------------------- step

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function movePlayer(s: GameState, dt: number, input: Input) {
  const p = s.player;
  if (input.dx !== 0 || input.dy !== 0) {
    const len = Math.hypot(input.dx, input.dy) || 1;
    const speed = input.focus ? PLAYER_FOCUS_SPEED : PLAYER_SPEED;
    p.x += (input.dx / len) * speed * dt;
    p.y += (input.dy / len) * speed * dt;
  } else if (input.target) {
    const tx = input.target.x - p.x;
    const ty = input.target.y - p.y;
    const dist = Math.hypot(tx, ty);
    const maxStep = (input.focus ? PLAYER_FOCUS_SPEED : 320) * dt;
    if (dist > 0.01) {
      const k = Math.min(1, maxStep / dist);
      p.x += tx * k;
      p.y += ty * k;
    }
  }
  p.x += input.dragX;
  p.y += input.dragY;
  p.x = clamp(p.x, 3, W - 3);
  p.y = clamp(p.y, 3, H - 3);

  s.trail.push({ x: p.x, y: p.y });
  if (s.trail.length > 10) s.trail.shift();
}

function hit(s: GameState) {
  if (s.shield) {
    s.shield = false;
    s.invuln = 1.5;
    const { x, y } = s.player;
    s.bullets = s.bullets.filter((b) => Math.hypot(b.x - x, b.y - y) > 60);
    burst(s, x, y, 28, "#16b364", 110);
    return;
  }
  s.over = true;
  s.deadFor = 0;
  burst(s, s.player.x, s.player.y, 36, "#7ee2ff", 120);
  burst(s, s.player.x, s.player.y, 16, "#ffffff", 70);
}

export function step(s: GameState, dt: number, input: Input) {
  if (!s.over) {
    s.t += dt;
    const n = Math.floor(s.t / WAVE_SECONDS);
    if (n !== s.wave) startWave(s, n);

    movePlayer(s, dt, input);

    for (const p of s.patterns) {
      p.age += dt;
      p.timer -= dt;
      while (p.timer <= 0) p.timer += firePattern(s, p);
    }

    for (let i = s.scheduled.length - 1; i >= 0; i--) {
      const job = s.scheduled[i];
      job.delay -= dt;
      if (job.delay <= 0) {
        s.scheduled.splice(i, 1);
        job.fire(s);
      }
    }

    // Shield pickups
    if (s.t >= s.nextPickup) {
      s.nextPickup += PICKUP_EVERY;
      if (!s.shield) {
        let at = { x: W / 2, y: H / 2 };
        for (let tries = 0; tries < 12; tries++) {
          at = { x: 24 + s.rng() * (W - 48), y: 24 + s.rng() * (H - 48) };
          if (Math.hypot(at.x - s.player.x, at.y - s.player.y) > 60) break;
        }
        s.pickups.push({ ...at, life: 7 });
      }
    }
    for (let i = s.pickups.length - 1; i >= 0; i--) {
      const pk = s.pickups[i];
      pk.life -= dt;
      if (Math.hypot(pk.x - s.player.x, pk.y - s.player.y) < 8) {
        s.shield = true;
        burst(s, pk.x, pk.y, 14, "#16b364", 60);
        s.pickups.splice(i, 1);
      } else if (pk.life <= 0) {
        s.pickups.splice(i, 1);
      }
    }
  } else {
    s.deadFor += dt;
  }

  s.waveFlash = Math.max(0, s.waveFlash - dt);
  s.invuln = Math.max(0, s.invuln - dt);

  // Bullets: move, cull, collide
  const m = 24;
  const px = s.player.x;
  const py = s.player.y;
  let wasHit = false;
  s.bullets = s.bullets.filter((b) => {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (b.x < -m || b.x > W + m || b.y < -m || b.y > H + m) return false;
    if (s.over || wasHit) return true;

    const dx = b.x - px;
    const dy = b.y - py;
    const d2 = dx * dx + dy * dy;
    const hitR = b.r + PLAYER_HIT_R;
    if (d2 < hitR * hitR && s.invuln <= 0) {
      wasHit = true;
      return false;
    }
    const grazeR = b.r + GRAZE_R;
    if (!b.grazed && d2 < grazeR * grazeR) {
      b.grazed = true;
      s.grazes++;
      burst(s, (b.x + px) / 2, (b.y + py) / 2, 2, "#ffffff", 40);
    }
    return true;
  });
  if (wasHit) hit(s);

  for (let i = s.warns.length - 1; i >= 0; i--) {
    s.warns[i].t -= dt;
    if (s.warns[i].t <= 0) s.warns.splice(i, 1);
  }

  for (let i = s.particles.length - 1; i >= 0; i--) {
    const p = s.particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.96;
    p.vy *= 0.96;
    if (p.life <= 0) s.particles.splice(i, 1);
  }
}
