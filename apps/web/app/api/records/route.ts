import { eq, sql, userRecords } from "@play4fun/db";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { RECORD_BY_KEY, type RecordValue } from "@/lib/record-keys";

export const dynamic = "force-dynamic";

const MAX_BATCH = 50;

async function listFor(userId: string): Promise<RecordValue[]> {
  const rows = await getDb()
    .select({ key: userRecords.key, value: userRecords.value, meta: userRecords.meta, updatedAt: userRecords.updatedAt })
    .from(userRecords)
    .where(eq(userRecords.userId, userId));
  return rows.map((r) => ({ key: r.key, value: r.value, meta: (r.meta as RecordValue["meta"]) ?? null, updatedAt: r.updatedAt.toISOString() }));
}

/** Records saved on the signed-in account */
export async function GET() {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  return Response.json({ records: await listFor(user.id) });
}

/**
 * Merge records from this device into the account and return the merged set.
 * best → keep the highest value (done in SQL, so concurrent devices never lower a record)
 * latest → replace with the value sent (only sent right after a new quiz result)
 */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const incoming = Array.isArray((body as { records?: unknown })?.records) ? (body as { records: unknown[] }).records.slice(0, MAX_BATCH) : [];

  const db = getDb();
  for (const raw of incoming) {
    const r = raw as Partial<RecordValue>;
    const def = typeof r?.key === "string" ? RECORD_BY_KEY.get(r.key) : undefined;
    if (!def) continue;

    if (def.kind === "best") {
      const value = Number(r.value);
      // Implausible scores are dropped, not clamped (clamping would put a cheater at the cap, on top of the leaderboard)
      if (!Number.isFinite(value) || value <= 0 || value > (def.max ?? 1_000_000_000)) continue;
      const v = Math.round(value);
      await db
        .insert(userRecords)
        .values({ userId: user.id, key: def.key, value: v })
        .onConflictDoUpdate({
          target: [userRecords.userId, userRecords.key],
          set: { value: sql`greatest(${userRecords.value}, excluded.value)`, updatedAt: sql`case when excluded.value > ${userRecords.value} then now() else ${userRecords.updatedAt} end` },
        });
    } else {
      const result = typeof r.meta?.result === "string" ? r.meta.result.slice(0, 40) : "";
      if (!/^[a-z0-9-]+$/.test(result)) continue;
      await db
        .insert(userRecords)
        .values({ userId: user.id, key: def.key, value: 0, meta: { result } })
        .onConflictDoUpdate({ target: [userRecords.userId, userRecords.key], set: { meta: { result }, updatedAt: sql`now()` } });
    }
  }

  return Response.json({ records: await listFor(user.id) });
}
