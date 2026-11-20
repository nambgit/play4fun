import { adsConfig } from "@/lib/ads";

export const dynamic = "force-dynamic";

/** Ad config for the (static) pages: null while AdSense is not configured */
export function GET() {
  return Response.json(adsConfig(), { headers: { "cache-control": "public, max-age=300" } });
}
