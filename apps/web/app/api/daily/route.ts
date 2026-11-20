import { currentUser } from "@/lib/auth";
import { dayOf } from "@/lib/daily";
import { dailyBoard } from "@/lib/daily-server";

export const dynamic = "force-dynamic";

/** GET /api/daily → today's challenge, board, my result, streak */
export async function GET() {
  const user = await currentUser();
  return Response.json(await dailyBoard(dayOf(), user?.id), { headers: { "cache-control": "private, max-age=10" } });
}

// Daily scores are submitted through /api/runs/finish, which checks the round first.
