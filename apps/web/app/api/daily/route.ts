import { currentUser } from "@/lib/auth";
import { dailyGame, dayOf, isDay, type DailySlug } from "@/lib/daily";
import { dailyBoard, dailyCap, submitDaily } from "@/lib/daily-server";

export const dynamic = "force-dynamic";

/** Yesterday is accepted too: a round started before midnight may finish after it */
function acceptedDays() {
  const today = dayOf();
  return [today, dayOf(new Date(Date.now() - 86_400_000))];
}

/** GET /api/daily → today's challenge, board, my result, streak */
export async function GET() {
  const user = await currentUser();
  return Response.json(await dailyBoard(dayOf(), user?.id), { headers: { "cache-control": "private, max-age=10" } });
}

/** POST { day, game, score, share? } — records the first finished round of the day */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { day?: unknown; game?: unknown; score?: unknown; share?: unknown } | null;
  const day = body?.day;
  if (!isDay(day) || !acceptedDays().includes(day)) return Response.json({ error: "wrong_day" }, { status: 400 });
  const game = dailyGame(day);
  if (body?.game !== game) return Response.json({ error: "wrong_game" }, { status: 400 });
  const score = Number(body?.score);
  if (!Number.isFinite(score) || score < 0 || score > dailyCap(game as DailySlug)) return Response.json({ error: "invalid_score" }, { status: 400 });
  await submitDaily(user.id, day, score, typeof body?.share === "string" ? body.share : undefined);
  return Response.json(await dailyBoard(day, user.id));
}
