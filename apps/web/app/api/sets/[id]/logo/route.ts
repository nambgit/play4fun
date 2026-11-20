import { eq, questionSets } from "@play4fun/db";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Brand logo of a question set, shown in party rooms that use the set (public by unguessable id) */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });
  const [row] = await getDb().select({ logo: questionSets.logo }).from(questionSets).where(eq(questionSets.id, id));
  const m = row?.logo?.match(/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/);
  if (!m) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(m[2], "base64"), {
    headers: { "content-type": m[1], "cache-control": "public, max-age=300", "x-content-type-options": "nosniff" },
  });
}
