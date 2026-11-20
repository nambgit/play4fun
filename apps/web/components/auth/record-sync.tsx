"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { onRecordChanged, syncRecords } from "@/lib/record-sync";

/**
 * Invisible: when a player is signed in, merges this device's records with the account
 * on sign-in / page load, right after a new record, and when the tab comes back into view.
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
      const res = await syncRecords(includeLatest || first);
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
    const onVisible = () => document.visibilityState === "visible" && void run(false);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      offRecord();
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [userId]);

  return null;
}
