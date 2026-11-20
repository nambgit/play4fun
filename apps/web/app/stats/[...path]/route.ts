/**
 * First-party proxy for Umami (self-hosted analytics, apps: docker-compose service "umami").
 *
 *   /stats/script.js  → Umami tracker, with this site's website id set at request time
 *   /stats/api/send   → Umami collector
 *
 * Serving it from our own domain keeps the Umami dashboard private (it only listens on
 * 127.0.0.1) and avoids the third-party URLs ad blockers drop. Not configured → empty script.
 */

export const dynamic = "force-dynamic";

const UMAMI = process.env.UMAMI_INTERNAL_URL?.replace(/\/$/, "");
const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

const js = (body: string, maxAge: number) =>
  new Response(body, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": `public, max-age=${maxAge}` } });

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join("/");
  if (path !== "script.js") return new Response("Not found", { status: 404 });
  if (!UMAMI || !WEBSITE_ID || !/^[0-9a-f-]{36}$/i.test(WEBSITE_ID)) return js("", 300);
  try {
    const res = await fetch(`${UMAMI}/script.js`, { next: { revalidate: 3600 } });
    if (!res.ok) return js("", 60);
    // The tracker reads data-website-id from its own <script> tag: set it before the tracker code runs
    const prelude = `document.currentScript&&document.currentScript.setAttribute("data-website-id",${JSON.stringify(WEBSITE_ID)});\n`;
    return js(prelude + (await res.text()), 3600);
  } catch {
    return js("", 60);
  }
}

/** Headers Umami uses (client IP for country/unique visitors, UA for device/bot detection, its own x-umami-*) */
function forwardHeaders(req: Request) {
  const h = new Headers({ "content-type": "application/json" });
  const ua = req.headers.get("user-agent");
  if (ua) h.set("user-agent", ua);
  // nginx sets X-Real-IP / X-Forwarded-For to the visitor's address
  const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) h.set("x-forwarded-for", ip);
  for (const [k, v] of req.headers) if (k.startsWith("x-umami-")) h.set(k, v);
  return h;
}

export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join("/");
  if (path !== "api/send" || !UMAMI) return new Response("Not found", { status: 404 });
  const body = await req.text();
  if (body.length > 16_384) return new Response("Too large", { status: 413 });
  try {
    const res = await fetch(`${UMAMI}/api/send`, { method: "POST", headers: forwardHeaders(req), body, cache: "no-store" });
    return new Response(await res.text(), { status: res.status, headers: { "content-type": res.headers.get("content-type") ?? "application/json" } });
  } catch {
    // Analytics must never break the site
    return new Response(null, { status: 204 });
  }
}
