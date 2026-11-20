import { adsConfig } from "@/lib/ads";

export const dynamic = "force-dynamic";

/** https://play4fun.io.vn/ads.txt — required by AdSense once ads are on */
export function GET() {
  const cfg = adsConfig();
  if (!cfg) return new Response("Not found", { status: 404 });
  const pub = cfg.client.replace(/^ca-/, "");
  return new Response(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
