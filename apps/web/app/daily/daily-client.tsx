"use client";

import { Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { msUntilNextDay } from "@/lib/daily";
import { readLocalDaily, type LocalDaily } from "@/lib/daily-client";

/** Time left until the next challenge (midnight, Vietnam time) */
export function Countdown() {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setMs(msUntilNextDay());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (ms === null) return null;
  const s = Math.floor(ms / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return (
    <p className="inline-flex items-center gap-1.5 text-sm text-white/80">
      <Timer className="h-4 w-4" aria-hidden="true" />
      Đề mới sau <span className="font-mono font-bold text-white tabular-nums">{`${hh}:${mm}:${ss}`}</span>
    </p>
  );
}

/** A guest's own result for today (kept on this device only) */
export function LocalResult({ day, unit }: { day: string; unit: string }) {
  const [r, setR] = useState<LocalDaily | null>(null);
  useEffect(() => setR(readLocalDaily(day)), [day]);
  if (!r) return null;
  return (
    <p className="mt-2 text-sm">
      Kết quả hôm nay trên máy này: <b className="font-mono">{r.score.toLocaleString("vi-VN")}</b> {unit}
    </p>
  );
}
