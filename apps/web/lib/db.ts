import { createDb, type Db } from "@play4fun/db";

// Khởi tạo lười để `next build` không cần DATABASE_URL, và giữ 1 pool khi dev hot-reload.
const globalForDb = globalThis as unknown as { __play4funDb?: Db };

export function getDb(): Db {
  if (!globalForDb.__play4funDb) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    globalForDb.__play4funDb = createDb(url);
  }
  return globalForDb.__play4funDb;
}
