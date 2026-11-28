"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PROGRESS_EVENT } from "@/lib/progress-sync";
import { STREAK_EVENT, currentStreak } from "@/lib/streak";

/** 🔥 N in the header: days in a row the player has played. Hidden until the first day is played. */
export function StreakBadge() {
  const [s, setS] = useState<{ current: number; best: number; playedToday: boolean } | null>(null);
  useEffect(() => {
    const update = () => setS(currentStreak());
    update();
    window.addEventListener(STREAK_EVENT, update);
    window.addEventListener(PROGRESS_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(STREAK_EVENT, update);
      window.removeEventListener(PROGRESS_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  if (!s || s.current === 0) return null;
  const title = s.playedToday
    ? `Chuỗi ${s.current} ngày chơi liên tiếp (kỷ lục ${s.best} ngày)`
    : `Chuỗi ${s.current} ngày: chơi một game hôm nay để giữ chuỗi!`;
  return (
    <Link
      href="/daily"
      title={title}
      aria-label={title}
      className={`inline-flex h-10 items-center gap-1 rounded-xl border px-2.5 text-sm font-bold tabular-nums transition-colors ${
        s.playedToday ? "border-[#ff6a3d]/30 bg-[#ff6a3d]/10 text-[#e0531f] dark:text-[#ff8a5c]" : "border-line bg-surface text-muted hover:text-fg"
      }`}
    >
      <span aria-hidden="true" className={s.playedToday ? "" : "grayscale"}>
        🔥
      </span>
      {s.current}
    </Link>
  );
}
