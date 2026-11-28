import { eq, sql, userRecords } from "@play4fun/db";
import { deserialize } from "@/games/duong-len-ceo/engine";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { CEO_KEY, PROGRESS, PROGRESS_BY_KEY, STREAK_KEY, mergeProgress, parseDays, streakStats, type ProgressItem } from "@/lib/progress-keys";
import { dayOf } from "@/lib/daily";

export const dynamic = "force-dynamic";

const KEYS = PROGRESS.map((p) => p.key);

async function stored(userId: string): Promise<Map<string, string>> {
  const rows = await getDb()
    .select({ key: userRecords.key, meta: userRecords.meta })
    .from(userRecords)
    .where(eq(userRecords.userId, userId));
  const out = new Map<string, string>();
  // A player has only a handful of rows: filter the progress keys here
  for (const r of rows) {
    if (!KEYS.includes(r.key)) continue;
    const data = (r.meta as { data?: unknown } | null)?.data;
    if (typeof data === "string") out.set(r.key, data);
  }
  return out;
}

/** Clean a value sent by the browser; null when it is not acceptable */
function clean(key: string, data: unknown): string | null {
  const def = PROGRESS_BY_KEY.get(key);
  if (!def || typeof data !== "string" || data.length > def.maxBytes) return null;
  if (key === STREAK_KEY) {
    const days = parseDays(data);
    return days.length ? JSON.stringify(days) : null;
  }
  if (key === CEO_KEY) {
    // Re-parse with the game's own loader: unknown fields dropped, numbers range-checked
    const s = deserialize(data);
    return s.allTime > 0 ? JSON.stringify(s) : null;
  }
  return null;
}

/** Progress saved on the signed-in account */
export async function GET() {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  const map = await stored(user.id);
  return Response.json({ items: [...map].map(([key, data]) => ({ key, data })) satisfies ProgressItem[] });
}

/** Merge this device's progress into the account (union of streak days, the CEO save with more progress) */
export async function PUT(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { items?: unknown } | null;
  const incoming = Array.isArray(body?.items) ? body.items.slice(0, KEYS.length) : [];

  const db = getDb();
  const current = await stored(user.id);
  for (const raw of incoming) {
    const item = raw as Partial<ProgressItem>;
    if (typeof item?.key !== "string") continue;
    const value = clean(item.key, item.data);
    if (!value) continue;
    const merged = mergeProgress(item.key, current.get(item.key), value);
    if (!merged || merged === current.get(item.key)) continue;
    current.set(item.key, merged);
    // value column: best streak / career stars, handy for the account page and admin
    const num = item.key === STREAK_KEY ? streakStats(parseDays(merged), dayOf()).best : Math.min(2_000_000_000, deserialize(merged).stars);
    await db
      .insert(userRecords)
      .values({ userId: user.id, key: item.key, value: num, meta: { data: merged } })
      .onConflictDoUpdate({ target: [userRecords.userId, userRecords.key], set: { value: num, meta: { data: merged }, updatedAt: sql`now()` } });
  }
  return Response.json({ items: [...current].map(([key, data]) => ({ key, data })) satisfies ProgressItem[] });
}
