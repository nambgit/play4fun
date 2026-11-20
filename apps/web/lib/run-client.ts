"use client";

import type { DailyInfo } from "./daily";
import { notifyRecordChanged, saveReceipt } from "./record-sync";

/**
 * A round being played. startRun() asks the server for a ticket in the background (the game
 * starts right away); finish() sends the score with its proof. A verified score is saved to
 * the account and/or kept as a receipt on this device. Offline or rejected → the score simply
 * stays local, the game itself is never blocked.
 */
export type RunResult = { ok: boolean; score?: number };
export type Run = { finish: (score: number, proof: object) => Promise<RunResult> };

export function startRun(key: string, seed: number, daily?: DailyInfo): Run {
  const ticket: Promise<string | null> = fetch("/api/runs", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ key, seed, day: daily?.day ?? null }),
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((j: { ticket?: string } | null) => j?.ticket ?? null)
    .catch(() => null);

  let sent: Promise<RunResult> | null = null;
  return {
    finish(score, proof) {
      sent ??= (async (): Promise<RunResult> => {
        const t = await ticket;
        if (!t) return { ok: false };
        const res = await fetch("/api/runs/finish", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ticket: t, score: Math.round(score), proof }),
        });
        if (!res.ok) return { ok: false };
        const j = (await res.json()) as { score: number; receipt: string | null };
        if (j.receipt) saveReceipt(key, j.score, j.receipt);
        notifyRecordChanged();
        return { ok: true, score: j.score };
      })().catch(() => ({ ok: false }));
      return sent;
    },
  };
}

/** Random 31-bit seed for a normal (non-daily) round */
export const randomSeed = () => Date.now() ^ Math.floor(Math.random() * 2 ** 31);
