import { and, desc, eq, sql, userRecords, users } from "@play4fun/db";
import { getDb } from "./db";
import { RECORD_BY_KEY } from "./record-keys";

export type LeaderRow = { rank: number; userId: string; name: string; image: string | null; value: number };

/** Public top list for one record key (players who hid themselves are skipped) */
export async function topRecords(key: string, limit = 10): Promise<LeaderRow[]> {
  if (RECORD_BY_KEY.get(key)?.kind !== "best") return [];
  const rows = await getDb()
    .select({ userId: users.id, name: users.displayName, image: users.avatarUrl, value: userRecords.value })
    .from(userRecords)
    .innerJoin(users, eq(users.id, userRecords.userId))
    .where(and(eq(userRecords.key, key), sql`${userRecords.value} > 0`, eq(users.showOnLeaderboard, true)))
    .orderBy(desc(userRecords.value), userRecords.updatedAt)
    .limit(Math.min(100, limit));
  return rows.map((r, i) => ({ rank: i + 1, ...r }));
}

/** The player's own rank (counted among visible players) and value, or null if no record */
export async function myRank(key: string, userId: string) {
  const db = getDb();
  const [mine] = await db
    .select({ value: userRecords.value })
    .from(userRecords)
    .where(and(eq(userRecords.key, key), eq(userRecords.userId, userId)));
  if (!mine || mine.value <= 0) return null;
  const [{ above }] = await db
    .select({ above: sql<number>`count(*)::int` })
    .from(userRecords)
    .innerJoin(users, eq(users.id, userRecords.userId))
    .where(and(eq(userRecords.key, key), sql`${userRecords.value} > ${mine.value}`, eq(users.showOnLeaderboard, true)));
  return { rank: above + 1, value: mine.value };
}
