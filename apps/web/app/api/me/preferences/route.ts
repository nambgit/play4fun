import { eq, users } from "@play4fun/db";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/** PATCH { showOnLeaderboard: boolean } */
export async function PATCH(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { showOnLeaderboard?: unknown } | null;
  if (typeof body?.showOnLeaderboard !== "boolean") return Response.json({ error: "invalid" }, { status: 400 });
  await getDb().update(users).set({ showOnLeaderboard: body.showOnLeaderboard }).where(eq(users.id, user.id));
  return Response.json({ ok: true, showOnLeaderboard: body.showOnLeaderboard });
}
