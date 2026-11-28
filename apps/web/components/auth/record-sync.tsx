"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { onRecordChanged, syncRecords } from "@/lib/record-sync";
import { syncProgress } from "@/lib/progress-sync";

/** Streak and game progress (Đường lên CEO) go up this often while the page is open */
const PROGRESS_EVERY_MS = 120_000;

/**
 * Invisible: when a player is signed in, merges this device's records with the account
 * on sign-in / page load, right after a new record, and when the tab comes back into view.
 * Also syncs progress (streak, Đường lên CEO save): on load, every 2 minutes, and when the tab
 * is hidden or closed.
 * Renders nothing and does nothing for guests.
 */
export function RecordSync() {
  const { data } = useSession();
  const userId = data?.user?.id;
  const busy = useRef(false);

  useEffect(() => {
    if (!userId) return;
    // The first successful sync for this user on this device also uploads quiz results
    // saved before signing in. The flag is set only after the server confirmed it: the
    // request right after login is often cut short by the post-login redirect.
    const firstKey = `p4f:synced:${userId}`;
    const isFirst = () => {
      try {
        return !localStorage.getItem(firstKey);
      } catch {
        return false;
      }
    };
    const run = async (includeLatest: boolean) => {
      if (busy.current) return;
      busy.current = true;
      const first = isFirst();
      const [res] = await Promise.all([syncRecords(includeLatest || first), syncProgress()]);
      if (res && first) {
        try {
          localStorage.setItem(firstKey, "1");
        } catch {
          /* ignore */
        }
      }
      busy.current = false;
    };
    void run(false);

    let timer: ReturnType<typeof setTimeout> | undefined;
    const offRecord = onRecordChanged(() => {
      clearTimeout(timer);
      timer = setTimeout(() => void run(true), 800);
    });
    const onVisible = () => {
      if (document.visibilityState === "visible") void run(false);
      // Leaving: push progress made on this visit (keepalive survives the tab closing)
      else void syncProgress({ keepalive: true });
    };
    document.addEventListener("visibilitychange", onVisible);
    const every = setInterval(() => document.visibilityState === "visible" && void syncProgress(), PROGRESS_EVERY_MS);
    return () => {
      offRecord();
      clearTimeout(timer);
      clearInterval(every);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [userId]);

  return null;
}
