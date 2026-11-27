import { umamiSql } from "./admin-stats";
import { GAMES, getGame, type GameEntry } from "./games";

/**
 * "Game hot" on the home page: the most played games of the last 7 days, from Umami events.
 * - solo games (and the vs-computer modes of two-player games): one `game-start` per round
 * - party games: one `party-start` per game, sent by the host with the number of players, so
 *   each player in the room counts as one play
 *
 * Runs when the home page is (re)generated (ISR, hourly). Without analytics (local dev, the
 * Docker build) or on any error it falls back to a hand-picked list, and the list is always
 * topped up to `limit` games.
 */

const DAYS = 7;
const TIMEOUT_MS = 2500;
/** Used when there is no data yet, and to top up a short list */
const FALLBACK = ["noi-tu", "co-caro", "ma-soi", "ai-la-gian-diep", "pixel-dodge", "doan-chu", "do-vui-team-building", "inbox-zero"];

export type HotGame = { game: GameEntry; plays: number | null };

async function playCounts(): Promise<Map<string, number>> {
  const db = umamiSql();
  const site = process.env.UMAMI_WEBSITE_ID;
  if (!db || !site) return new Map();
  const query = db`
    select game, sum(n)::int as plays from (
      select g.string_value as game, count(*)::int as n
      from website_event e
      join event_data g on g.website_event_id = e.event_id and g.data_key = 'game'
      where e.website_id = ${site} and e.event_type = 2 and e.event_name = 'game-start'
        and e.created_at >= now() - make_interval(days => ${DAYS})
      group by 1
      union all
      select g.string_value as game, sum(greatest(coalesce(p.number_value, 1), 1))::int as n
      from website_event e
      join event_data g on g.website_event_id = e.event_id and g.data_key = 'game'
      left join event_data p on p.website_event_id = e.event_id and p.data_key = 'players'
      where e.website_id = ${site} and e.event_type = 2 and e.event_name = 'party-start'
        and e.created_at >= now() - make_interval(days => ${DAYS})
      group by 1
    ) t group by game order by plays desc`;
  // Never reject: a failed or slow query just means "no data" (the page must render regardless)
  let timer: ReturnType<typeof setTimeout> | undefined;
  const rows = await Promise.race([
    Promise.resolve(query).then(
      (r) => r as unknown as { game: string; plays: number }[],
      (e: unknown) => {
        console.warn(`[hot-games] analytics query failed: ${(e as { code?: string })?.code ?? String(e)}`);
        return null;
      },
    ),
    new Promise<null>((resolve) => {
      timer = setTimeout(() => resolve(null), TIMEOUT_MS);
    }),
  ]);
  clearTimeout(timer);
  return new Map((rows ?? []).map((r) => [r.game, r.plays]));
}

export async function hotGames(limit = 6): Promise<HotGame[]> {
  let counts = new Map<string, number>();
  try {
    counts = await playCounts();
  } catch (e) {
    console.warn(`[hot-games] ${String((e as { code?: string })?.code ?? e)}`);
  }
  const live = (slug: string) => {
    const g = getGame(slug);
    return g && g.status === "live" ? g : null;
  };
  const out: HotGame[] = [];
  for (const [slug, plays] of [...counts].sort((a, b) => b[1] - a[1])) {
    const g = live(slug);
    if (g && plays > 0 && out.length < limit) out.push({ game: g, plays });
  }
  for (const slug of [...FALLBACK, ...GAMES.map((g) => g.slug)]) {
    if (out.length >= limit) break;
    const g = live(slug);
    if (g && !out.some((h) => h.game.slug === slug)) out.push({ game: g, plays: null });
  }
  return out;
}
