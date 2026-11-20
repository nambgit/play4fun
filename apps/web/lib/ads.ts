/**
 * Google AdSense, off until configured. Runtime env (no rebuild needed):
 *   ADSENSE_CLIENT       ca-pub-XXXXXXXXXXXXXXXX
 *   ADSENSE_SLOT_HOME    ad unit id for the home page
 *   ADSENSE_SLOT_SIDEBAR ad unit id for game / daily / leaderboard sidebars
 * Ads are never placed inside a game or next to its controls (accidental clicks
 * break AdSense policy and the game).
 */
export type AdPlacement = "home" | "sidebar";

export type AdsConfig = { client: string; slots: Partial<Record<AdPlacement, string>> } | null;

export function adsConfig(): AdsConfig {
  const client = process.env.ADSENSE_CLIENT?.trim();
  if (!client || !/^ca-pub-\d{10,20}$/.test(client)) return null;
  const slot = (v: string | undefined) => (v && /^\d{6,20}$/.test(v.trim()) ? v.trim() : undefined);
  return { client, slots: { home: slot(process.env.ADSENSE_SLOT_HOME), sidebar: slot(process.env.ADSENSE_SLOT_SIDEBAR) } };
}
