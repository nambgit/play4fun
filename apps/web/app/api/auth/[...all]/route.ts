import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Better Auth endpoints: /api/auth/sign-in/social, /api/auth/callback/google, /api/auth/get-session…
export const { GET, POST } = toNextJsHandler((request: Request) => getAuth().handler(request));
