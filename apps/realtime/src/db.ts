import { createDb, eq, questionSets, type Db } from "@play4fun/db";
import type { CustomSet } from "./rooms";

let db: Db | null = null;
function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return (db ??= createDb(url, { max: 3 }));
}

/** Load a Studio question set for a party room (null if missing, empty or the DB is unavailable) */
export async function loadQuestionSet(id: string): Promise<CustomSet | null> {
  const d = getDb();
  if (!d) return null;
  try {
    const [row] = await d.select().from(questionSets).where(eq(questionSets.id, id));
    if (!row || row.questions.length === 0) return null;
    return {
      id: row.id,
      title: row.title,
      brand: { name: row.brandName, color: row.brandColor, logo: row.logo ? `/api/sets/${row.id}/logo` : null },
      questions: row.questions.slice(0, 100),
    };
  } catch (err) {
    console.error("[realtime] loadQuestionSet failed", err);
    return null;
  }
}
