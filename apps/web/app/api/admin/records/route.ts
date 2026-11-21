import { and, eq, userRecords } from "@play4fun/db";
import { isAdmin } from "@/lib/admin-stats";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Admin: remove a cheated record. DELETE { userId, key } */
export async function DELETE(req: Request) {
  const user = await currentUser();
  if (!user || !isAdmin(user)) return new Response("Not found", { status: 404 });
  const body = (await req.json().catch(() => null)) as { userId?: unknown; key?: unknown } | null;
  if (typeof body?.userId !== "string" || typeof body?.key !== "string") return Response.json({ error: "invalid" }, { status: 400 });
  await getDb().delete(userRecords).where(and(eq(userRecords.userId, body.userId), eq(userRecords.key, body.key)));
  return Response.json({ ok: true });
}
