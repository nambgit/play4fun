import { and, dailyChallenges, dailyResults, desc, eq, games, sql, users } from "@play4fun/db";
import { DAILY_RECORD_KEY, dailyInfo, dayOf, type DailySlug } from "./daily";
import { getDb } from "./db";
import { getGame } from "./games";
import { RECORD_BY_KEY } from "./record-keys";

/** Get (or create) today's challenge row; the games row is created on first use */
async function ensureChallenge(day: string) {
  const db = getDb();
  const info = dailyInfo(day);
  const g = getGame(info.game);
  await db
    .insert(games)
    .values({ slug: info.game, title: g?.title ?? info.game, type: "arcade", isPublished: true })
    .onConflictDoNothing({ target: games.slug });
  const [gameRow] = await db.select({ id: games.id }).from(games).where(eq(games.slug, info.game));
  await db
    .insert(dailyChallenges)
    .values({ gameId: gameRow.id, day, seed: String(info.seed) })
    .onConflictDoNothing({ target: [dailyChallenges.gameId, dailyChallenges.day] });
  const [ch] = await db
    .select({ id: dailyChallenges.id })
    .from(dailyChallenges)
    .where(and(eq(dailyChallenges.gameId, gameRow.id), eq(dailyChallenges.day, day)));
  return { id: ch.id, ...info };
}

/** Max plausible daily score for the game (same caps as personal records) */
export const dailyCap = (game: DailySlug) => RECORD_BY_KEY.get(DAILY_RECORD_KEY[game])?.max ?? 1_000_000;

/** First finished round of the day counts; later rounds only bump `attempts` */
export async function submitDaily(userId: string, day: string, score: number, shareText?: string) {
  const ch = await ensureChallenge(day);
  await getDb()
    .insert(dailyResults)
    .values({ challengeId: ch.id, userId, score: Math.round(score), shareText: shareText?.slice(0, 300) })
    .onConflictDoUpdate({ target: [dailyResults.challengeId, dailyResults.userId], set: { attempts: sql`${dailyResults.attempts} + 1` } });
  return ch;
}

export type DailyBoard = {
  day: string;
  game: DailySlug;
  seed: number;
  players: number;
  top: { rank: number; userId: string; name: string; image: string | null; score: number }[];
  me: { score: number; rank: number; attempts: number } | null;
  streak: number;
};

export async function dailyBoard(day = dayOf(), userId?: string | null, limit = 20): Promise<DailyBoard> {
  const db = getDb();
  const ch = await ensureChallenge(day);
  const [top, [{ players }]] = await Promise.all([
    db
      .select({ userId: users.id, name: users.displayName, image: users.avatarUrl, score: dailyResults.score })
      .from(dailyResults)
      .innerJoin(users, eq(users.id, dailyResults.userId))
      .where(and(eq(dailyResults.challengeId, ch.id), eq(users.showOnLeaderboard, true)))
      .orderBy(desc(dailyResults.score), dailyResults.createdAt)
      .limit(limit),
    db.select({ players: sql<number>`count(*)::int` }).from(dailyResults).where(eq(dailyResults.challengeId, ch.id)),
  ]);

  let me: DailyBoard["me"] = null;
  let streak = 0;
  if (userId) {
    const [mine] = await db
      .select({ score: dailyResults.score, attempts: dailyResults.attempts })
      .from(dailyResults)
      .where(and(eq(dailyResults.challengeId, ch.id), eq(dailyResults.userId, userId)));
    if (mine) {
      const [{ above }] = await db
        .select({ above: sql<number>`count(*)::int` })
        .from(dailyResults)
        .where(and(eq(dailyResults.challengeId, ch.id), sql`${dailyResults.score} > ${mine.score}`));
      me = { score: mine.score, rank: above + 1, attempts: mine.attempts };
    }
    streak = await streakOf(userId, day);
  }
  return { day, game: ch.game, seed: ch.seed, players, top: top.map((r, i) => ({ rank: i + 1, ...r })), me, streak };
}

/** Consecutive days played, ending today (or yesterday if today is not played yet) */
async function streakOf(userId: string, today: string) {
  const rows = await getDb()
    .select({ day: dailyChallenges.day })
    .from(dailyResults)
    .innerJoin(dailyChallenges, eq(dailyChallenges.id, dailyResults.challengeId))
    .where(eq(dailyResults.userId, userId))
    .orderBy(desc(dailyChallenges.day))
    .limit(400);
  const played = new Set(rows.map((r) => r.day));
  const step = (d: string, n: number) => {
    const t = new Date(`${d}T12:00:00Z`);
    t.setUTCDate(t.getUTCDate() + n);
    return t.toISOString().slice(0, 10);
  };
  let d = played.has(today) ? today : step(today, -1);
  let n = 0;
  while (played.has(d)) {
    n++;
    d = step(d, -1);
  }
  return n;
}
