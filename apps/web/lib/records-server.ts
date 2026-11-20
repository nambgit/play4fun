import { sql, userRecords } from "@play4fun/db";
import { getDb } from "./db";

/** Keep the highest value (in SQL, so concurrent devices never lower a record) */
export async function saveBest(userId: string, key: string, value: number) {
  const v = Math.round(value);
  await getDb()
    .insert(userRecords)
    .values({ userId, key, value: v })
    .onConflictDoUpdate({
      target: [userRecords.userId, userRecords.key],
      set: {
        value: sql`greatest(${userRecords.value}, excluded.value)`,
        updatedAt: sql`case when excluded.value > ${userRecords.value} then now() else ${userRecords.updatedAt} end`,
      },
    });
}
