import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { kv } from "./kv";

/**
 * Signed, stateless tokens for verified scores (no database table needed):
 * - ticket: issued when a round starts → proves when it started and with which seed
 * - receipt: issued for a verified score → lets a guest's record join their account after sign-in
 *
 * Signed with RUN_SECRET, or BETTER_AUTH_SECRET when that is not set.
 */

export type Ticket = { k: string; s: number; d: string | null; t: number; n: string };
export type Receipt = { k: string; v: number; t: number; n: string };

/** A round must finish within this time of its ticket */
export const TICKET_TTL_MS = 30 * 60_000;
/** A guest's receipt must be brought to an account within this time */
export const RECEIPT_TTL_MS = 24 * 3600_000;

const secret = () => process.env.RUN_SECRET || process.env.BETTER_AUTH_SECRET || "";
export const runsEnabled = () => secret().length >= 16;

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const mac = (kind: string, body: string) => createHmac("sha256", secret()).update(`${kind}:${body}`).digest("base64url");

function sign(kind: string, payload: object) {
  const body = b64(JSON.stringify(payload));
  return `${body}.${mac(kind, body)}`;
}

function open<T>(kind: string, token: unknown): T | null {
  if (typeof token !== "string" || token.length > 600 || !runsEnabled()) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const want = Buffer.from(mac(kind, body));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as T;
  } catch {
    return null;
  }
}

export const issueTicket = (key: string, seed: number, day: string | null) =>
  sign("ticket", { k: key, s: seed, d: day, t: Date.now(), n: randomBytes(6).toString("base64url") } satisfies Ticket);
export const readTicket = (token: unknown) => open<Ticket>("ticket", token);

export function issueReceipt(key: string, value: number) {
  const r: Receipt = { k: key, v: value, t: Date.now(), n: randomBytes(9).toString("base64url") };
  return { token: sign("receipt", r), receipt: r };
}
export const readReceipt = (token: unknown) => open<Receipt>("receipt", token);

/**
 * A receipt belongs to the first account that uses it (kept in Valkey until it expires), so one
 * guest score cannot be handed to several accounts. The same account may present it again
 * (every sync re-sends it). Without Valkey only the 24 h expiry applies.
 */
export async function claimReceipt(r: Receipt, userId: string): Promise<boolean> {
  const age = Date.now() - r.t;
  if (typeof r.n !== "string" || !r.n || age < -60_000 || age > RECEIPT_TTL_MS) return false;
  const owner = await kv(async (c) => {
    const key = `p4f:receipt:${r.n}`;
    const set = await c.set(key, userId, { condition: "NX", expiration: { type: "EX", value: Math.ceil(RECEIPT_TTL_MS / 1000) + 3600 } });
    return set === "OK" ? userId : await c.get(key);
  });
  return owner === null || owner === userId;
}
