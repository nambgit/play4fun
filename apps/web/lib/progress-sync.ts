"use client";

/**
 * Brings the streak and the Đường lên CEO save to the signed-in account and back
 * (merge rules in lib/progress-keys). Called by components/auth/record-sync.
 */
import { PROGRESS, mergeProgress, type ProgressItem } from "./progress-keys";

/** Fired on window when synced progress replaced a value on this device (detail = progress key) */
export const PROGRESS_EVENT = "p4f:progress";

function read(storage: string) {
  try {
    return localStorage.getItem(storage);
  } catch {
    return null;
  }
}

export async function syncProgress({ keepalive = false } = {}) {
  const items: ProgressItem[] = [];
  for (const p of PROGRESS) {
    const data = read(p.storage);
    if (data) items.push({ key: p.key, data });
  }
  try {
    const res = await fetch("/api/me/progress", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items }),
      credentials: "same-origin",
      keepalive,
    });
    if (!res.ok || keepalive) return;
    const { items: merged } = (await res.json()) as { items: ProgressItem[] };
    for (const item of merged) {
      const def = PROGRESS.find((p) => p.key === item.key);
      if (!def) continue;
      const local = read(def.storage);
      // Only write when the account holds something better than this device
      const best = mergeProgress(item.key, local, item.data);
      if (best && best !== local) {
        try {
          localStorage.setItem(def.storage, best);
        } catch {
          continue;
        }
        window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: item.key }));
      }
    }
  } catch {
    /* offline: next sync will catch up */
  }
}
