import { desc, eq, questionSets, sql } from "@play4fun/db";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { SET_LIMITS, validateSet } from "@/lib/question-sets";

export const dynamic = "force-dynamic";

/** My question sets (summary) */
export async function GET() {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  const rows = await getDb()
    .select({
      id: questionSets.id,
      title: questionSets.title,
      brandName: questionSets.brandName,
      brandColor: questionSets.brandColor,
      count: sql<number>`jsonb_array_length(${questionSets.questions})::int`,
      updatedAt: questionSets.updatedAt,
    })
    .from(questionSets)
    .where(eq(questionSets.ownerId, user.id))
    .orderBy(desc(questionSets.updatedAt));
  return Response.json({ sets: rows });
}

/** Create a set: { title } → { id } */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  const db = getDb();
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(questionSets).where(eq(questionSets.ownerId, user.id));
  if (n >= SET_LIMITS.sets) return Response.json({ error: `Tối đa ${SET_LIMITS.sets} bộ câu hỏi mỗi tài khoản.` }, { status: 400 });
  const body = (await req.json().catch(() => ({}))) as { title?: string };
  const v = validateSet({ title: body.title || "Bộ câu hỏi mới", questions: [] });
  if (!v.ok) return Response.json({ error: v.error }, { status: 400 });
  const [row] = await db.insert(questionSets).values({ ownerId: user.id, title: v.set.title, questions: [] }).returning({ id: questionSets.id });
  return Response.json({ id: row.id });
}
