import { DAILY_RECORD_KEY, dailyGame, dailySeed, dayOf } from "@/lib/daily";
import { RUN_RULES } from "@/lib/run-rules";
import { issueTicket, runsEnabled } from "@/lib/run-ticket";

export const dynamic = "force-dynamic";

/**
 * POST { key, seed, day? } → { ticket }
 * Called when a round starts (guests too). The ticket records the start time and seed;
 * the score is only accepted later together with it (/api/runs/finish).
 */
export async function POST(req: Request) {
  if (!runsEnabled()) return Response.json({ error: "disabled" }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { key?: unknown; seed?: unknown; day?: unknown } | null;
  const key = body?.key;
  const seed = body?.seed;
  if (typeof key !== "string" || !RUN_RULES[key]) return Response.json({ error: "unknown_key" }, { status: 400 });
  if (typeof seed !== "number" || !Number.isInteger(seed) || seed < -(2 ** 53) || seed > 2 ** 53) return Response.json({ error: "invalid_seed" }, { status: 400 });

  let day: string | null = null;
  if (body?.day != null) {
    // A daily round must be today's game with today's seed
    day = dayOf();
    if (body.day !== day || DAILY_RECORD_KEY[dailyGame(day)] !== key || seed !== dailySeed(day)) {
      return Response.json({ error: "wrong_daily" }, { status: 400 });
    }
  }
  return Response.json({ ticket: issueTicket(key, seed, day) }, { headers: { "cache-control": "no-store" } });
}
