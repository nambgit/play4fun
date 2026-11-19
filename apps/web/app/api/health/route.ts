import { sql } from "@play4fun/db";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let db: "ok" | "down" = "ok";
  try {
    await getDb().execute(sql`select 1`);
  } catch {
    db = "down";
  }
  return Response.json({ status: db === "ok" ? "ok" : "degraded", db });
}
