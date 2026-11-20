import { currentUser } from "@/lib/auth";
import { myRank, topRecords } from "@/lib/leaderboard";
import { RECORD_BY_KEY } from "@/lib/record-keys";

export const dynamic = "force-dynamic";

/** GET /api/leaderboard?key=inbox-zero&limit=10 → { top, me } */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key") ?? "";
  const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit")) || 10));
  if (RECORD_BY_KEY.get(key)?.kind !== "best") return Response.json({ error: "unknown_key" }, { status: 400 });
  const [top, user] = await Promise.all([topRecords(key, limit), currentUser()]);
  const me = user ? await myRank(key, user.id) : null;
  return Response.json({ top: top.map(({ userId, ...r }) => ({ ...r, me: userId === user?.id })), me }, { headers: { "cache-control": "private, max-age=15" } });
}
