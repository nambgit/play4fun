import { accounts, sessions, users, verifications } from "@play4fun/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { getDb } from "./db";

/**
 * Login is optional: guests keep playing everything; signing in only saves records to an account.
 *
 * Env:
 *   BETTER_AUTH_SECRET   random string ≥ 32 chars (required in production)
 *   BETTER_AUTH_URL      public site URL, e.g. https://play4fun.io.vn (falls back to PUBLIC_URL)
 *   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET       → shows "Tiếp tục với Google"
 *   FACEBOOK_CLIENT_ID / FACEBOOK_CLIENT_SECRET   → shows "Tiếp tục với Facebook"
 *   AUTH_DEV_PASSWORD=1  dev only: enables email+password sign-in so the flow can be tested
 *                        without OAuth apps. Ignored in production.
 */

const env = process.env;

export const AUTH_PROVIDERS = {
  google: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
  facebook: !!(env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET),
};

export const DEV_PASSWORD_LOGIN = env.AUTH_DEV_PASSWORD === "1" && env.NODE_ENV !== "production";

const clip = (s: string | undefined, n: number) => (s ?? "").trim().slice(0, n) || "Người chơi";

function createAuth() {
  return betterAuth({
    appName: "Play4Fun",
    baseURL: env.BETTER_AUTH_URL ?? env.PUBLIC_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(), { provider: "pg", schema: { users, sessions, accounts, verifications } }),
    advanced: { database: { generateId: "uuid" } },

    // Map Better Auth's models onto our tables (packages/db/src/schema.ts)
    user: {
      modelName: "users",
      fields: { name: "displayName", image: "avatarUrl" },
      additionalFields: { isGuest: { type: "boolean", defaultValue: false, input: false } },
      deleteUser: { enabled: true },
    },
    session: {
      modelName: "sessions",
      expiresIn: 60 * 60 * 24 * 60, // 60 days
      updateAge: 60 * 60 * 24, // refresh the expiry at most once a day
      cookieCache: { enabled: true, maxAge: 5 * 60 },
    },
    account: {
      modelName: "accounts",
      // Same email on Google and Facebook → one player, not two
      accountLinking: { enabled: true, trustedProviders: ["google", "facebook"] },
    },
    verification: { modelName: "verifications" },

    socialProviders: {
      google: {
        enabled: AUTH_PROVIDERS.google,
        clientId: env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
        prompt: "select_account",
        mapProfileToUser: (p) => ({ name: clip(p.name, 64) }),
      },
      facebook: {
        enabled: AUTH_PROVIDERS.facebook,
        clientId: env.FACEBOOK_CLIENT_ID ?? "",
        clientSecret: env.FACEBOOK_CLIENT_SECRET ?? "",
        // Facebook accounts made with a phone number have no email; Better Auth needs one,
        // so give those a private placeholder that can never receive mail (.invalid TLD).
        mapProfileToUser: (p) => {
          const fbId = "id" in p ? p.id : (p as { sub?: string }).sub;
          return { name: clip(p.name, 64), ...(p.email ? {} : { email: `fb-${fbId}@users.play4fun.invalid` }) };
        },
      },
    },

    emailAndPassword: { enabled: DEV_PASSWORD_LOGIN },
    plugins: [nextCookies()],
  });
}

type Auth = ReturnType<typeof createAuth>;
const globalForAuth = globalThis as unknown as { __play4funAuth?: { auth: Auth; config: string } };

/**
 * Created on first use so `next build` does not need DATABASE_URL.
 * Re-created when the auth env changes (dev server reloading .env.local keeps globalThis).
 */
export function getAuth(): Auth {
  const config = JSON.stringify([AUTH_PROVIDERS, DEV_PASSWORD_LOGIN, env.BETTER_AUTH_URL, env.BETTER_AUTH_SECRET?.length]);
  const cached = globalForAuth.__play4funAuth;
  if (cached?.config === config) return cached.auth;
  const auth = createAuth();
  globalForAuth.__play4funAuth = { auth, config };
  return auth;
}

/** Signed-in user for the current request (server components / route handlers), or null */
export async function currentUser() {
  try {
    const session = await getAuth().api.getSession({ headers: await headers() });
    return session?.user ?? null;
  } catch {
    return null;
  }
}
