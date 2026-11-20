import { currentUser } from "@/lib/auth";
import { dailyBoard, submitDaily } from "@/lib/daily-server";
import { RECORD_BY_KEY } from "@/lib/record-keys";
import { saveBest } from "@/lib/records-server";
import { RUN_RULES } from "@/lib/run-rules";
import { TICKET_TTL_MS, issueReceipt, readTicket } from "@/lib/run-ticket";

export const dynamic = "force-dynamic";

/**
 * POST { ticket, score, proof } → { score, receipt, daily? }
 * Checks the round against its ticket (lib/run-rules). A verified score is saved to the
 * signed-in account (and to the daily board for a daily round); guests get a receipt that
 * moves the record to their account when they sign in.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { ticket?: unknown; score?: unknown; proof?: unknown } | null;
  const ticket = readTicket(body?.ticket);
  if (!ticket) return Response.json({ error: "invalid_ticket" }, { status: 400 });
  const age = Date.now() - ticket.t;
  if (age < 0 || age > TICKET_TTL_MS) return Response.json({ error: "expired_ticket" }, { status: 400 });

  const score = Number(body?.score);
  const def = RECORD_BY_KEY.get(ticket.k);
  const rule = RUN_RULES[ticket.k];
  if (!def || !rule || !Number.isInteger(score) || score < 0 || score > (def.max ?? 1_000_000_000)) {
    return Response.json({ error: "invalid_score" }, { status: 400 });
  }
  const check = rule({ score, proof: body?.proof, wall: age / 1000, seed: ticket.s, daily: !!ticket.d });
  if (!check.ok) return Response.json({ error: "rejected", reason: check.reason }, { status: 422 });

  const user = await currentUser();
  let daily = null;
  if (user) {
    if (check.score > 0) await saveBest(user.id, ticket.k, check.score);
    if (ticket.d) {
      await submitDaily(user.id, ticket.d, check.score);
      daily = await dailyBoard(ticket.d, user.id);
    }
  }
  return Response.json({ score: check.score, receipt: check.score > 0 ? issueReceipt(ticket.k, check.score) : null, daily });
}
