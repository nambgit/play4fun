import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Signed, stateless tokens for verified scores (no database table needed):
 * - ticket: issued when a round starts → proves when it started and with which seed
 * - receipt: issued for a verified score → lets a guest's record join their account after sign-in
 *
 * Signed with RUN_SECRET, or BETTER_AUTH_SECRET when that is not set.
 */

export type Ticket = { k: string; s: number; d: string | null; t: number; n: string };
export type Receipt = { k: string; v: number; t: number };

/** A round must finish within this time of its ticket */
export const TICKET_TTL_MS = 30 * 60_000;

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

export const issueReceipt = (key: string, value: number) => sign("receipt", { k: key, v: value, t: Date.now() } satisfies Receipt);
export const readReceipt = (token: unknown) => open<Receipt>("receipt", token);
