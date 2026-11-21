"use client";
import { GameImage } from "@/components/game-image";

import { CalendarDays, ChevronRight, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { dailyInfo, shortDay, type DailyInfo } from "@/lib/daily";
import { readLocalDaily } from "@/lib/daily-client";
import { getGame } from "@/lib/games";

/** Today's challenge on the (static) home page: the game is computed in the browser */
export function DailyBanner() {
  const [info, setInfo] = useState<DailyInfo | null>(null);
  const [players, setPlayers] = useState<number | null>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const i = dailyInfo();
    setInfo(i);
    setPlayed(!!readLocalDaily(i.day));
    fetch("/api/daily")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && typeof d.players === "number" && setPlayers(d.players))
      .catch(() => {});
  }, []);

  if (!info) return <div className="container-page"><div className="h-[88px] rounded-3xl bg-surface-2" aria-hidden="true" /></div>;
  const game = getGame(info.game)!;

  return (
    <section className="container-page" aria-label="Thử thách hôm nay">
      <Link
        href="/daily"
        className="group flex items-center gap-4 overflow-hidden rounded-3xl p-3 pr-4 text-white shadow-lift transition hover:-translate-y-0.5 sm:p-4 sm:pr-6"
        style={{ backgroundImage: `linear-gradient(135deg, ${game.cover[0]}, ${game.cover[1]})` }}
      >
        {game.thumbnail && (
          <span className="relative hidden aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-xl border border-white/25 sm:block">
            <GameImage src={game.thumbnail} sizes="120px" />
          </span>
        )}
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-black/20 sm:hidden" aria-hidden="true">
          <CalendarDays className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-white/80">Thử thách ngày {shortDay(info.day)}</span>
          <span className="block truncate text-lg font-extrabold sm:text-xl">{game.title}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-white/85">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {players === null ? "Cả nước cùng một đề" : `${players.toLocaleString("vi-VN")} người đã chơi`}
            {played && " · bạn đã chơi"}
          </span>
        </span>
        <span className="hidden shrink-0 items-center gap-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#15131f] sm:inline-flex">
          {played ? "Xem bảng" : "Chơi ngay"}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 sm:hidden" aria-hidden="true" />
      </Link>
    </section>
  );
}
