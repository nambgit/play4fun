import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export function createDb(url: string, options: { max?: number } = {}) {
  const client = postgres(url, { max: options.max ?? 10 });
  return drizzle(client, { schema });
}

export type Db = ReturnType<typeof createDb>;

/** Plain SQL client for another database (used by /admin to read Umami's tables) */
export function createSql(url: string, options: { max?: number; idle_timeout?: number } = {}) {
  return postgres(url, { max: options.max ?? 3, idle_timeout: options.idle_timeout ?? 30 });
}
export type Sql = ReturnType<typeof createSql>;
