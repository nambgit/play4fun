import { and, eq, questionSets } from "@play4fun/db";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { validateSet } from "@/lib/question-sets";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };
const isUuid = (s: string) => /^[0-9a-f-]{36}$/i.test(s);

/** Only the owner can read or change a set's content */
async function ownSet(id: string, userId: string) {
  if (!isUuid(id)) return null;
  const [row] = await getDb()
    .select()
    .from(questionSets)
    .where(and(eq(questionSets.id, id), eq(questionSets.ownerId, userId)));
  return row ?? null;
}

export async function GET(_req: Request, { params }: Ctx) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  const row = await ownSet((await params).id, user.id);
  if (!row) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ id: row.id, title: row.title, brandName: row.brandName, brandColor: row.brandColor, logo: row.logo, questions: row.questions });
}

export async function PUT(req: Request, { params }: Ctx) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  const row = await ownSet((await params).id, user.id);
  if (!row) return Response.json({ error: "not_found" }, { status: 404 });
  const v = validateSet(await req.json().catch(() => null));
  if (!v.ok) return Response.json({ error: v.error }, { status: 400 });
  await getDb().update(questionSets).set(v.set).where(eq(questionSets.id, row.id));
  return Response.json({ ok: true, count: v.set.questions.length });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  const row = await ownSet((await params).id, user.id);
  if (!row) return Response.json({ error: "not_found" }, { status: 404 });
  await getDb().delete(questionSets).where(eq(questionSets.id, row.id));
  return Response.json({ ok: true });
}
