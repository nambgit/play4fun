"use client";

import { CalendarDays, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { shortDay, type DailyInfo } from "@/lib/daily";
import { DAILY_EVENT, readLocalDaily, type LocalDaily } from "@/lib/daily-client";

/** Daily challenge note shown on a game's start / result screen */
export function DailyBadge({ daily, where, dark = false }: { daily: DailyInfo; where: "ready" | "over"; dark?: boolean }) {
  const [local, setLocal] = useState<LocalDaily | null>(null);
  useEffect(() => {
    const read = () => setLocal(readLocalDaily(daily.day));
    read();
    window.addEventListener(DAILY_EVENT, read);
    return () => window.removeEventListener(DAILY_EVENT, read);
  }, [daily.day]);

  const box = dark ? "border-white/20 bg-white/10 text-white" : "border-brand/30 bg-brand-soft text-fg";
  const muted = dark ? "text-white/70" : "text-muted";

  return (
    <div className={`mx-auto mt-4 max-w-sm rounded-2xl border px-4 py-3 text-left text-sm ${box}`}>
      <p className="flex items-center gap-2 font-semibold">
        <CalendarDays className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        Thử thách ngày {shortDay(daily.day)}
      </p>
      {where === "ready" ? (
        <p className={`mt-1 text-xs ${muted}`}>
          {local
            ? `Bạn đã chơi hôm nay (${local.score.toLocaleString("vi-VN")}). Ván này chỉ để luyện tập.`
            : "Cả nước cùng một đề. Chỉ lần chơi đầu tiên được tính lên bảng xếp hạng ngày."}
        </p>
      ) : (
        <p className={`mt-1 text-xs ${muted}`}>
          {local ? `Kết quả thử thách của bạn: ${local.score.toLocaleString("vi-VN")}.` : "Đang lưu kết quả…"}{" "}
          <Link href="/daily" className="inline-flex items-center font-semibold text-brand hover:underline">
            Xem bảng hôm nay
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </p>
      )}
    </div>
  );
}
