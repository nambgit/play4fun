/**
 * Đường lên CEO — idle/clicker logic (pure, no React / DOM).
 *
 * Click to earn money, hire staff that earn per second, buy upgrades, climb 10 career ranks.
 * Random office situations (with choices), a "golden coffee" bonus, an in-game calendar
 * (Monday blues, Friday energy, seasonal situations), achievements, offline earnings, and
 * "khởi nghiệp lại" (start over for permanent reputation stars).
 */
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_BONUS,
  CLICK_UPGRADES,
  COST_GROWTH,
  GLOBAL_UPGRADES,
  RANKS,
  SITUATIONS,
  STAFF,
  STAFF_UPGRADE_AT,
  WEEKDAY_MULT,
  type Outcome,
  type Situation,
} from "./content";

export const SAVE_KEY = "p4f:duong-len-ceo:save";
/** One in-game day lasts this many real seconds; a month is 30 days */
export const DAY_SEC = 20;
const BASE_CLICK = 1000;
const STAR_BONUS = 0.02;
/** Offline earnings: share of normal income, and the cap */
const OFFLINE_RATE = 0.5;
const OFFLINE_MAX_SEC = 8 * 3600;
/** Cost of a staff upgrade = staff base cost × factor (index = upgrade tier) */
const STAFF_UPGRADE_COST = [10, 100, 1e3, 1e5, 1e7];

export type Boost = { target: "prod" | "click"; mult: number; until: number; label: string };

export type State = {
  v: 1;
  money: number;
  /** Earned in the current career (ranks, unlocks) */
  career: number;
  /** Earned across all careers (reputation stars) */
  allTime: number;
  clicks: number;
  owned: Record<string, number>;
  /** Bought upgrade ids (click, global, and staff upgrades "s-<staff>-<tier>") */
  bought: string[];
  stars: number;
  prestiges: number;
  achievements: string[];
  events: number;
  coffees: number;
  /** Active play time in seconds across careers (drives the calendar and timers) */
  time: number;
  /** Real month (1–12) when the save was created: the calendar starts there */
  month0: number;
  boosts: Boost[];
  coffee: { x: number; y: number; until: number } | null;
  nextCoffee: number;
  /** Situation waiting for the player's choice */
  event: string | null;
  nextEvent: number;
  recent: string[];
  /** Highest rank reached in this career */
  rank: number;
  savedAt: number;
};

export function createState(now = Date.now()): State {
  return {
    v: 1,
    money: 0,
    career: 0,
    allTime: 0,
    clicks: 0,
    owned: {},
    bought: [],
    stars: 0,
    prestiges: 0,
    achievements: [],
    events: 0,
    coffees: 0,
    time: 0,
    month0: new Date(now).getMonth() + 1,
    boosts: [],
    coffee: null,
    nextCoffee: 45,
    event: null,
    nextEvent: 50,
    recent: [],
    rank: 0,
    savedAt: now,
  };
}

const rand = (rng: () => number, a: number, b: number) => a + rng() * (b - a);

// ------------------------------------------------------------ calendar

export function calendar(s: State) {
  const day = Math.floor(s.time / DAY_SEC);
  return { day: day + 1, weekday: day % 7, month: ((s.month0 - 1 + Math.floor(day / 30)) % 12) + 1, dayOfMonth: (day % 30) + 1, year: Math.floor((s.month0 - 1 + Math.floor(day / 30)) / 12) + 1 };
}

// ------------------------------------------------------------ prices and income

export const owned = (s: State, id: string) => s.owned[id] ?? 0;

/** Cost of the next `n` of a staff tier */
export function staffCost(s: State, id: string, n = 1) {
  const st = STAFF.find((x) => x.id === id)!;
  const k = owned(s, id);
  // Geometric series: base × g^k × (g^n − 1)/(g − 1)
  return st.cost * Math.pow(COST_GROWTH, k) * ((Math.pow(COST_GROWTH, n) - 1) / (COST_GROWTH - 1));
}

/** How many of a staff tier the player can afford right now */
export function maxAffordable(s: State, id: string) {
  const st = STAFF.find((x) => x.id === id)!;
  const first = st.cost * Math.pow(COST_GROWTH, owned(s, id));
  if (s.money < first) return 0;
  return Math.floor(Math.log((s.money * (COST_GROWTH - 1)) / first + 1) / Math.log(COST_GROWTH));
}

const has = (s: State, id: string) => s.bought.includes(id);
const staffUpgradeId = (staff: string, tier: number) => `s-${staff}-${tier}`;
export const staffMult = (s: State, id: string) => Math.pow(2, STAFF_UPGRADE_AT.filter((_, t) => has(s, staffUpgradeId(id, t))).length);

const boostMult = (s: State, target: "prod" | "click") => s.boosts.filter((b) => b.target === target && b.until > s.time).reduce((m, b) => m * b.mult, 1);

/** Permanent multiplier: reputation stars and achievements */
export const permanentMult = (s: State) => (1 + STAR_BONUS * s.stars) * (1 + ACHIEVEMENT_BONUS * s.achievements.length);

function globalMult(s: State) {
  let m = 1;
  for (const u of GLOBAL_UPGRADES) if (u.kind === "global" && has(s, u.id)) m += u.pct;
  return m;
}

/** Income per second of one staff tier (all owned), including every multiplier */
export function staffIncome(s: State, id: string, withBoosts = true) {
  const st = STAFF.find((x) => x.id === id)!;
  const weekday = withBoosts ? WEEKDAY_MULT[calendar(s).weekday] : 1;
  return st.rate * owned(s, id) * staffMult(s, id) * globalMult(s) * permanentMult(s) * weekday * (withBoosts ? boostMult(s, "prod") : 1);
}

export function income(s: State, withBoosts = true) {
  return STAFF.reduce((sum, st) => sum + staffIncome(s, st.id, withBoosts), 0);
}

export function clickValue(s: State) {
  let mult = 1;
  let pct = 0;
  for (const u of CLICK_UPGRADES) {
    if (u.kind !== "click" || !has(s, u.id)) continue;
    mult *= u.mult ?? 1;
    pct += u.pctOfIncome ?? 0;
  }
  return (BASE_CLICK * mult * permanentMult(s) + income(s) * pct) * boostMult(s, "click");
}

// ------------------------------------------------------------ actions

function earn(s: State, amount: number) {
  s.money += amount;
  s.career += amount;
  s.allTime += amount;
}

export function click(s: State) {
  const v = clickValue(s);
  earn(s, v);
  s.clicks++;
  return v;
}

export function buyStaff(s: State, id: string, n: number) {
  if (n <= 0) return false;
  const cost = staffCost(s, id, n);
  if (s.money < cost) return false;
  s.money -= cost;
  s.owned[id] = owned(s, id) + n;
  return true;
}

/** A staff tier is shown once the player has earned half its first price (or owns one) */
export const staffVisible = (s: State, i: number) => i === 0 || owned(s, STAFF[i].id) > 0 || s.career >= STAFF[i].cost * 0.5;

export type ShopItem = { id: string; name: string; emoji: string; desc: string; cost: number };

/** Upgrades the player can see now (cheapest first) */
export function shop(s: State): ShopItem[] {
  const out: ShopItem[] = [];
  for (const st of STAFF) {
    STAFF_UPGRADE_AT.forEach((at, t) => {
      const id = staffUpgradeId(st.id, t);
      if (!has(s, id) && owned(s, st.id) >= at) out.push({ id, name: st.upgrades[t], emoji: st.emoji, desc: `${st.name} làm việc hiệu quả gấp đôi`, cost: st.cost * STAFF_UPGRADE_COST[t] });
    });
  }
  for (const u of [...CLICK_UPGRADES, ...GLOBAL_UPGRADES]) {
    if (!has(s, u.id) && s.career >= u.cost * 0.3) out.push({ id: u.id, name: u.name, emoji: u.emoji, desc: u.desc, cost: u.cost });
  }
  return out.sort((a, b) => a.cost - b.cost);
}

export function buyUpgrade(s: State, id: string) {
  const item = shop(s).find((x) => x.id === id);
  if (!item || s.money < item.cost) return false;
  s.money -= item.cost;
  s.bought.push(id);
  return true;
}

// ------------------------------------------------------------ ranks and achievements

export const rankIndex = (career: number) => RANKS.reduce((r, rank, i) => (career >= rank.at ? i : r), 0);
const staffTotal = (s: State) => Object.values(s.owned).reduce((a, b) => a + b, 0);

const CHECKS: Record<string, (s: State) => boolean> = {
  "a-click-100": (s) => s.clicks >= 100,
  "a-click-1k": (s) => s.clicks >= 1e3,
  "a-click-10k": (s) => s.clicks >= 1e4,
  "a-earn-1m": (s) => s.allTime >= 1e6,
  "a-earn-1b": (s) => s.allTime >= 1e9,
  "a-earn-1t": (s) => s.allTime >= 1e12,
  "a-earn-1q": (s) => s.allTime >= 1e15,
  "a-staff-10": (s) => staffTotal(s) >= 10,
  "a-staff-100": (s) => staffTotal(s) >= 100,
  "a-staff-500": (s) => staffTotal(s) >= 500,
  ...Object.fromEntries(STAFF.map((st) => [`a-first-${st.id}`, (s: State) => owned(s, st.id) >= 1])),
  "a-event-10": (s) => s.events >= 10,
  "a-event-50": (s) => s.events >= 50,
  "a-coffee-1": (s) => s.coffees >= 1,
  "a-coffee-25": (s) => s.coffees >= 25,
  "a-rank-tn": (s) => s.rank >= 3,
  "a-rank-gd": (s) => s.rank >= 5,
  "a-rank-ceo": (s) => s.rank >= 7,
  "a-prestige-1": (s) => s.prestiges >= 1,
  "a-prestige-5": (s) => s.prestiges >= 5,
  "a-year-1": (s) => s.time >= DAY_SEC * 360,
};

function checkAchievements(s: State) {
  const fresh: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!s.achievements.includes(a.id) && CHECKS[a.id]?.(s)) {
      s.achievements.push(a.id);
      fresh.push(a.id);
    }
  }
  return fresh;
}

// ------------------------------------------------------------ situations

export function eligibleSituations(s: State): Situation[] {
  const { month, weekday } = calendar(s);
  return SITUATIONS.filter(
    (e) =>
      s.rank >= (e.minRank ?? 0) &&
      s.rank <= (e.maxRank ?? 99) &&
      (!e.months || e.months.includes(month)) &&
      (!e.weekdays || e.weekdays.includes(weekday)) &&
      !s.recent.includes(e.id),
  );
}

export const situation = (id: string | null) => (id ? (SITUATIONS.find((e) => e.id === id) ?? null) : null);

export type Resolved = { text: string; amount: number; lost: number; boost: Boost | null; won: boolean | null };

function apply(s: State, o: Outcome, label: string): Resolved {
  let amount = 0;
  let lost = 0;
  let boost: Boost | null = null;
  if (o.lose) {
    lost = s.money * Math.min(0.2, o.lose);
    s.money -= lost;
  }
  if (o.gain) {
    // Worth `gain` seconds of income, and never less than a fair number of clicks early on
    amount = Math.max(income(s) * o.gain, (clickValue(s) * o.gain) / 15);
    earn(s, amount);
  }
  if (o.boost) {
    boost = { target: o.boost.target, mult: o.boost.mult, until: s.time + o.boost.sec, label };
    s.boosts.push(boost);
  }
  return { text: o.text, amount, lost, boost, won: null };
}

/** The player picked choice `i` of the pending situation */
export function resolveSituation(s: State, i: number, rng: () => number = Math.random): Resolved | null {
  const e = situation(s.event);
  const c = e?.choices[i];
  if (!e || !c) return null;
  let r: Resolved;
  if ("chance" in c) {
    const won = rng() < c.chance;
    r = { ...apply(s, won ? c.win : c.fail, e.title), won };
  } else r = apply(s, c.outcome, e.title);
  s.events++;
  s.event = null;
  s.recent = [e.id, ...s.recent].slice(0, 10);
  s.nextEvent = s.time + rand(rng, 75, 150);
  return r;
}

// ------------------------------------------------------------ golden coffee

export type CoffeeResult = { kind: "money" | "prod" | "click"; text: string; amount: number };

export function catchCoffee(s: State, rng: () => number = Math.random): CoffeeResult | null {
  if (!s.coffee || s.coffee.until <= s.time) return null;
  s.coffee = null;
  s.coffees++;
  s.nextCoffee = s.time + rand(rng, 60, 150);
  const roll = rng();
  if (roll < 0.5) {
    const amount = Math.max(Math.min(s.money * 0.15, income(s) * 900), clickValue(s) * 15) + clickValue(s) * 10;
    earn(s, amount);
    return { kind: "money", text: "Lộc bất ngờ! Khách hàng thanh toán sớm.", amount };
  }
  if (roll < 0.8) {
    s.boosts.push({ target: "prod", mult: 7, until: s.time + 30, label: "Ly cà phê vàng" });
    return { kind: "prod", text: "Cả công ty tỉnh táo! Thu nhập ×7 trong 30 giây.", amount: 0 };
  }
  s.boosts.push({ target: "click", mult: 50, until: s.time + 15, label: "Ly cà phê vàng" });
  return { kind: "click", text: "Tay nhanh như chớp! Mỗi lần bấm ×50 trong 15 giây.", amount: 0 };
}

// ------------------------------------------------------------ tick

export type TickNews = { rankUp: number | null; achievements: string[]; situation: string | null };

/** Advance the game by dt seconds of active play */
export function tick(s: State, dt: number, rng: () => number = Math.random): TickNews {
  s.time += dt;
  earn(s, income(s) * dt);
  s.boosts = s.boosts.filter((b) => b.until > s.time);

  // Golden coffee: appears now and then, disappears after 12 seconds
  if (s.coffee && s.coffee.until <= s.time) {
    s.coffee = null;
    s.nextCoffee = s.time + rand(rng, 60, 150);
  } else if (!s.coffee && s.time >= s.nextCoffee) {
    s.coffee = { x: rand(rng, 0.08, 0.82), y: rand(rng, 0.12, 0.7), until: s.time + 12 };
  }

  // Situations: one at a time, never while the player is deciding another
  let started: string | null = null;
  if (!s.event && s.time >= s.nextEvent) {
    const pool = eligibleSituations(s);
    if (pool.length) {
      s.event = started = pool[Math.floor(rng() * pool.length)].id;
    } else s.nextEvent = s.time + 30;
  }

  const r = rankIndex(s.career);
  let rankUp: number | null = null;
  if (r > s.rank) {
    s.rank = r;
    rankUp = r;
  }
  return { rankUp, achievements: checkAchievements(s), situation: started };
}

// ------------------------------------------------------------ khởi nghiệp lại (prestige)

/** Total stars the player's lifetime earnings are worth; the difference is what a restart gives */
export const starsWorth = (allTime: number) => Math.floor(Math.sqrt(allTime / 1e12));
export const starsOnRestart = (s: State) => Math.max(0, starsWorth(s.allTime) - s.stars);

export function restart(s: State) {
  const gain = starsOnRestart(s);
  if (gain <= 0) return 0;
  Object.assign(s, {
    money: 0,
    career: 0,
    owned: {},
    bought: [],
    boosts: [],
    coffee: null,
    event: null,
    nextEvent: s.time + 50,
    rank: 0,
    stars: s.stars + gain,
    prestiges: s.prestiges + 1,
  });
  return gain;
}

// ------------------------------------------------------------ offline earnings and saves

/** Money earned while the tab was closed (half the normal rate, at most 8 hours) */
export function applyOffline(s: State, now = Date.now()) {
  const seconds = Math.min(OFFLINE_MAX_SEC, Math.max(0, (now - s.savedAt) / 1000));
  s.savedAt = now;
  if (seconds < 60) return null;
  const amount = income(s, false) * seconds * OFFLINE_RATE;
  if (amount <= 0) return null;
  earn(s, amount);
  return { seconds, amount };
}

export function serialize(s: State, now = Date.now()) {
  s.savedAt = now;
  return JSON.stringify(s);
}

const num = (x: unknown, fallback = 0) => (typeof x === "number" && Number.isFinite(x) && x >= 0 ? x : fallback);

/** Parse a save; anything malformed falls back to a fresh game instead of breaking the page */
export function deserialize(raw: string | null, now = Date.now()): State {
  const base = createState(now);
  if (!raw) return base;
  try {
    const d = JSON.parse(raw) as Partial<State>;
    if (d.v !== 1) return base;
    const ownedRaw = d.owned && typeof d.owned === "object" ? d.owned : {};
    return {
      ...base,
      money: num(d.money),
      career: num(d.career),
      allTime: num(d.allTime),
      clicks: num(d.clicks),
      owned: Object.fromEntries(STAFF.map((st) => [st.id, Math.floor(num((ownedRaw as Record<string, unknown>)[st.id]))]).filter(([, n]) => (n as number) > 0)),
      bought: Array.isArray(d.bought) ? d.bought.filter((x): x is string => typeof x === "string") : [],
      stars: Math.floor(num(d.stars)),
      prestiges: Math.floor(num(d.prestiges)),
      achievements: Array.isArray(d.achievements) ? d.achievements.filter((x): x is string => typeof x === "string") : [],
      events: num(d.events),
      coffees: num(d.coffees),
      time: num(d.time),
      month0: Math.min(12, Math.max(1, Math.floor(num(d.month0, base.month0)))),
      boosts: Array.isArray(d.boosts) ? d.boosts.filter((b) => b && (b.target === "prod" || b.target === "click") && num(b.mult) > 0 && num(b.until) > 0) : [],
      coffee: null,
      nextCoffee: num(d.time) + 30,
      event: typeof d.event === "string" && situation(d.event) ? d.event : null,
      nextEvent: num(d.nextEvent, num(d.time) + 50),
      recent: Array.isArray(d.recent) ? d.recent.filter((x): x is string => typeof x === "string").slice(0, 10) : [],
      rank: Math.min(RANKS.length - 1, Math.floor(num(d.rank))),
      savedAt: num(d.savedAt, now),
    };
  } catch {
    return base;
  }
}

// ------------------------------------------------------------ formatting

const UNITS: [number, string][] = [
  [1e18, "tỷ tỷ"],
  [1e15, "triệu tỷ"],
  [1e12, "nghìn tỷ"],
  [1e9, "tỷ"],
  [1e6, "triệu"],
  [1e3, "nghìn"],
];

/** "1,25 triệu đ", "980 đ", "3,4 nghìn tỷ đ" */
export function fmtMoney(n: number) {
  if (!Number.isFinite(n)) return "∞ đ";
  if (n >= 1e21) return `${n.toExponential(2).replace(".", ",")} đ`;
  for (const [u, name] of UNITS) {
    if (n >= u) {
      const v = n / u;
      return `${v.toLocaleString("vi-VN", { maximumFractionDigits: v < 10 ? 2 : v < 100 ? 1 : 0 })} ${name} đ`;
    }
  }
  return `${Math.floor(n).toLocaleString("vi-VN")} đ`;
}

export function fmtDuration(sec: number) {
  if (sec < 60) return `${Math.round(sec)} giây`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m} phút`;
  return `${Math.floor(m / 60)} giờ ${m % 60} phút`;
}
