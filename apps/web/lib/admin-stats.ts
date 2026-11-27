import { accounts, createSql, sql, userRecords, users, type Sql } from "@play4fun/db";
import { getDb } from "./db";

/**
 * Numbers for /admin.
 * - Traffic & game play: read straight from Umami's own Postgres database (SELECT only),
 *   schema of the pinned image ghcr.io/umami-software/umami:3.4.1 (tables website_event,
 *   event_data, session). Re-check the queries when upgrading Umami.
 * - Accounts & records: our database.
 * - Live party rooms: the realtime server's /health.
 */

const TZ = "Asia/Ho_Chi_Minh";
/** A round longer than this was almost certainly a tab left open: cap it */
const MAX_ROUND_SECONDS = 1800;

export type Range = 1 | 7 | 30;
export const RANGES: Range[] = [1, 7, 30];

const envList = (name: string) =>
  (process.env[name] ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

type MaybeUser = { id?: string; email?: string | null; emailVerified?: boolean } | null | undefined;

/**
 * Admin = user id listed in ADMIN_USER_IDS (strongest), or email listed in ADMIN_EMAILS **and
 * verified** by the provider: accounts are linked by email, so an unverified address must
 * never grant admin rights. The dev-only password login has no verification step, so it is
 * accepted there (it is disabled in production).
 */
export function isAdmin(user: MaybeUser) {
  if (!user) return false;
  if (user.id && envList("ADMIN_USER_IDS").includes(user.id.toLowerCase())) return true;
  if (!user.email || !envList("ADMIN_EMAILS").includes(user.email.toLowerCase())) return false;
  const devLogin = process.env.AUTH_DEV_PASSWORD === "1" && process.env.NODE_ENV !== "production";
  return user.emailVerified === true || devLogin;
}

const globalForUmami = globalThis as unknown as { __umamiSql?: Sql };
export function umamiSql() {
  const url = process.env.UMAMI_DATABASE_URL;
  if (!url) return null;
  return (globalForUmami.__umamiSql ??= createSql(url));
}

export const analyticsConfigured = () => !!(process.env.UMAMI_DATABASE_URL && process.env.UMAMI_WEBSITE_ID);

// ------------------------------------------------------------ traffic (Umami)

export type Traffic = {
  visitors: number;
  visits: number;
  pageviews: number;
  online: number;
  series: { label: string; visitors: number; pageviews: number }[];
  unit: "hour" | "day";
  sources: { name: string; visits: number }[];
  devices: { name: string; visitors: number }[];
  games: { game: string; starts: number; ends: number; quits: number; players: number; seconds: number }[];
  party: { game: string; games: number; avgPlayers: number }[];
  /** Page views of /games/<slug> and /cam-nang/<slug> (visitors = distinct sessions) */
  pages: { path: string; views: number; visitors: number }[];
};

function since(range: Range) {
  // "Hôm nay" = since local midnight; otherwise the last N days including today
  const now = new Date();
  const local = new Date(now.toLocaleString("en-US", { timeZone: TZ }));
  const offset = now.getTime() - local.getTime();
  local.setHours(0, 0, 0, 0);
  local.setDate(local.getDate() - (range - 1));
  return new Date(local.getTime() + offset);
}

export async function traffic(range: Range): Promise<Traffic | null> {
  const db = umamiSql();
  const site = process.env.UMAMI_WEBSITE_ID;
  if (!db || !site) return null;
  const from = since(range);
  const unit = range === 1 ? "hour" : "day";

  const [overview, online, series, sources, devices, games, party, pages] = await Promise.all([
    db`select count(distinct session_id) filter (where event_type = 1)::int as visitors,
              count(distinct visit_id)::int as visits,
              count(*) filter (where event_type = 1)::int as pageviews
       from website_event where website_id = ${site} and created_at >= ${from}`,
    db`select count(distinct session_id)::int as n from website_event
       where website_id = ${site} and created_at >= now() - interval '5 minutes'`,
    db`select to_char(date_trunc(${unit}, created_at at time zone ${TZ}), ${unit === "hour" ? "HH24" : "YYYY-MM-DD"}) as k,
              count(distinct session_id)::int as visitors, count(*)::int as pageviews
       from website_event where website_id = ${site} and created_at >= ${from} and event_type = 1
       group by 1 order by 1`,
    // Source of each visit = its first page view
    db`with first_hit as (
         select distinct on (visit_id) visit_id, referrer_domain, hostname, fbclid, ttclid, utm_source
         from website_event where website_id = ${site} and created_at >= ${from} and event_type = 1
         order by visit_id, created_at)
       select case
           when fbclid is not null or utm_source ilike '%facebook%' or utm_source ilike 'fb%'
             or referrer_domain ~* '(^|\\.)(facebook\\.com|fb\\.com|fb\\.me|messenger\\.com)$' then 'Facebook'
           when ttclid is not null or utm_source ilike '%tiktok%' or referrer_domain ~* '(^|\\.)tiktok\\.com$' then 'TikTok'
           when utm_source ilike '%zalo%' or referrer_domain ~* 'zalo' then 'Zalo'
           when referrer_domain ~* '(^|\\.)google\\.' then 'Google'
           when coalesce(referrer_domain, '') = '' or referrer_domain = hostname then 'Trực tiếp / không rõ'
           else referrer_domain end as name,
         count(*)::int as visits
       from first_hit group by 1 order by 2 desc limit 8`,
    db`select case when s.device in ('desktop', 'laptop') then 'desktop' when coalesce(s.device, '') = '' then 'khác' else s.device end as name,
              count(distinct e.session_id)::int as visitors
       from website_event e join session s on s.session_id = e.session_id
       where e.website_id = ${site} and e.created_at >= ${from}
       group by 1 order by 2 desc`,
    db`select g.string_value as game,
              count(*) filter (where e.event_name = 'game-start')::int as starts,
              count(*) filter (where e.event_name = 'game-end')::int as ends,
              count(*) filter (where e.event_name = 'game-quit')::int as quits,
              count(distinct e.session_id) filter (where e.event_name = 'game-start')::int as players,
              coalesce(sum(least(sec.number_value, ${MAX_ROUND_SECONDS})) filter (where e.event_name in ('game-end', 'game-quit')), 0)::int as seconds
       from website_event e
       join event_data g on g.website_event_id = e.event_id and g.data_key = 'game'
       left join event_data sec on sec.website_event_id = e.event_id and sec.data_key = 'seconds'
       where e.website_id = ${site} and e.created_at >= ${from} and e.event_type = 2
         and e.event_name in ('game-start', 'game-end', 'game-quit')
       group by 1 order by 2 desc`,
    db`select g.string_value as game, count(*)::int as games, coalesce(avg(p.number_value), 0)::float as avg_players
       from website_event e
       join event_data g on g.website_event_id = e.event_id and g.data_key = 'game'
       left join event_data p on p.website_event_id = e.event_id and p.data_key = 'players'
       where e.website_id = ${site} and e.created_at >= ${from} and e.event_type = 2 and e.event_name = 'party-start'
       group by 1 order by 2 desc`,
    // Trailing slash and query string are not part of url_path in Umami, but normalise anyway
    db`select rtrim(url_path, '/') as path, count(*)::int as views, count(distinct session_id)::int as visitors
       from website_event
       where website_id = ${site} and created_at >= ${from} and event_type = 1
         and (url_path like '/games/%' or url_path like '/cam-nang/%')
       group by 1`,
  ]);

  // Fill empty hours/days so the chart has a bar slot for each
  const byKey = new Map(series.map((r) => [r.k as string, r]));
  const slots: { label: string; visitors: number; pageviews: number }[] = [];
  if (unit === "hour") {
    const hourNow = Number(new Date().toLocaleString("en-US", { timeZone: TZ, hour: "2-digit", hour12: false })) % 24;
    for (let h = 0; h <= hourNow; h++) {
      const k = String(h).padStart(2, "0");
      const r = byKey.get(k);
      slots.push({ label: `${k}h`, visitors: r?.visitors ?? 0, pageviews: r?.pageviews ?? 0 });
    }
  } else {
    for (let i = 0; i < range; i++) {
      const d = new Date(from.getTime() + i * 86_400_000 + 12 * 3_600_000);
      const k = d.toLocaleDateString("en-CA", { timeZone: TZ });
      const r = byKey.get(k);
      slots.push({ label: k.slice(8, 10) + "/" + k.slice(5, 7), visitors: r?.visitors ?? 0, pageviews: r?.pageviews ?? 0 });
    }
  }

  const o = overview[0];
  return {
    visitors: o.visitors,
    visits: o.visits,
    pageviews: o.pageviews,
    online: online[0].n,
    series: slots,
    unit,
    sources: sources.map((r) => ({ name: r.name as string, visits: r.visits })),
    devices: devices.map((r) => ({ name: r.name as string, visitors: r.visitors })),
    games: games.map((r) => ({ game: r.game as string, starts: r.starts, ends: r.ends, quits: r.quits, players: r.players, seconds: r.seconds })),
    party: party.map((r) => ({ game: r.game as string, games: r.games, avgPlayers: r.avg_players })),
    pages: pages.map((r) => ({ path: r.path as string, views: r.views, visitors: r.visitors })),
  };
}

// ------------------------------------------------------------ accounts & records (our DB)

export async function accountStats(range: Range) {
  const db = getDb();
  const from = since(range);
  const [totals, providers, records] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)::int`,
        fresh: sql<number>`(count(*) filter (where ${users.createdAt} >= ${from.toISOString()}))::int`,
      })
      .from(users)
      .where(sql`${users.isGuest} = false`),
    db
      .select({ provider: accounts.providerId, n: sql<number>`count(*)::int` })
      .from(accounts)
      .groupBy(accounts.providerId),
    db.execute(sql`select distinct on (${userRecords.key}) ${userRecords.key} as key, ${userRecords.value} as value, ${users.displayName} as name, ${users.id} as user_id
                   from ${userRecords} join ${users} on ${users.id} = ${userRecords.userId}
                   where ${userRecords.value} > 0
                   order by ${userRecords.key}, ${userRecords.value} desc`),
  ]);
  return {
    total: totals[0]?.total ?? 0,
    fresh: totals[0]?.fresh ?? 0,
    providers: providers.map((p) => ({ provider: p.provider, n: p.n })),
    records: (records as unknown as { key: string; value: number; name: string; user_id: string }[]).map((r) => ({ key: r.key, value: Number(r.value), name: r.name, userId: r.user_id })),
  };
}

// ------------------------------------------------------------ live party rooms (realtime server)

export type LiveRooms = {
  rooms: number;
  players: number;
  /** rooms/players: occupied rooms; playing/playingPlayers: the part with a game in progress (the rest is in the lobby) */
  byGame: Record<string, { rooms: number; playing: number; players: number; playingPlayers: number }>;
  /** Players waiting in "Tìm đối thủ" (random matchmaking) */
  waiting: number;
};

export async function liveRooms(): Promise<LiveRooms | null> {
  const url = process.env.REALTIME_INTERNAL_URL;
  if (!url) return null;
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/health`, { cache: "no-store", signal: AbortSignal.timeout(1500) });
    if (!res.ok) return null;
    const j = (await res.json()) as Partial<LiveRooms>;
    // Older realtime versions did not split players by room status
    const byGame = Object.fromEntries(
      Object.entries(j.byGame ?? {}).map(([k, g]) => [k, { ...g, playingPlayers: g.playingPlayers ?? (g.playing ? g.players : 0) }]),
    );
    return { rooms: j.rooms ?? 0, players: j.players ?? 0, byGame, waiting: j.waiting ?? 0 };
  } catch {
    return null;
  }
}
