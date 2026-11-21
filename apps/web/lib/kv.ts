import { createClient } from "redis";

/**
 * Small Valkey helper for the web app (REDIS_URL). Optional: without it (local dev) every call
 * returns null and callers fall back to their stateless behaviour.
 */
const makeClient = (url: string) => createClient({ url, socket: { connectTimeout: 2000, reconnectStrategy: (n) => Math.min(n * 200, 3000) } });
type Client = ReturnType<typeof makeClient>;

const g = globalThis as unknown as { __p4fKv?: Promise<Client | null> };

function client(): Promise<Client | null> {
  const url = process.env.REDIS_URL;
  if (!url) return Promise.resolve(null);
  g.__p4fKv ??= (async () => {
    const c = makeClient(url);
    c.on("error", () => {});
    try {
      await c.connect();
      return c;
    } catch (err) {
      console.error("[kv] valkey unavailable:", (err as Error).message);
      g.__p4fKv = undefined; // try again next time
      return null;
    }
  })();
  return g.__p4fKv;
}

/** Run a Valkey command; null if Valkey is not configured or not reachable */
export async function kv<T>(fn: (c: Client) => Promise<T>): Promise<T | null> {
  try {
    const c = await client();
    return c ? await fn(c) : null;
  } catch (err) {
    console.error("[kv] command failed:", (err as Error).message);
    return null;
  }
}
