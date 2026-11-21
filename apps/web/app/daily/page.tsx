import { CalendarDays, Flame, LogIn, Play, Users } from "lucide-react";
import { GameImage } from "@/components/game-image";
import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { Avatar } from "@/components/auth/account-menu";
import { currentUser } from "@/lib/auth";
import { DAILY_RECORD_KEY, dailyGame, dayOf, shortDay } from "@/lib/daily";
import { dailyBoard } from "@/lib/daily-server";
import { getGame } from "@/lib/games";
import { RECORD_BY_KEY } from "@/lib/record-keys";
import { Countdown, LocalResult } from "./daily-client";

export const metadata: Metadata = {
  title: "Thử thách hôm nay",
  description: "Mỗi ngày một mini-game, cả nước chơi cùng một đề. Ai đứng đầu bảng hôm nay?",
  alternates: { canonical: "/daily" },
};
export const dynamic = "force-dynamic";

const MEDAL = ["🥇", "🥈", "🥉"];

export default async function DailyPage() {
  const user = await currentUser();
  const today = dayOf();
  const board = await dailyBoard(today, user?.id, 20);
  const game = getGame(board.game)!;
  const unit = RECORD_BY_KEY.get(DAILY_RECORD_KEY[board.game])?.unit ?? "điểm";
  const upcoming = [1, 2, 3, 4].map((n) => {
    const d = dayOf(new Date(Date.now() + n * 86_400_000));
    return { day: d, game: getGame(dailyGame(d))! };
  });

  return (
    <div className="container-page py-6 sm:py-10">
      {/* Today's challenge */}
      <section
        className="relative isolate overflow-hidden rounded-3xl p-5 text-white shadow-lift sm:p-8"
        style={{ backgroundImage: `linear-gradient(135deg, ${game.cover[0]}, ${game.cover[1]})` }}
      >
        <div className="bg-dots absolute inset-0 -z-10 opacity-30" aria-hidden="true" />
        <div className="grid items-center gap-6 md:grid-cols-[1fr_minmax(0,360px)]">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-xs font-semibold backdrop-blur">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Thử thách ngày {shortDay(today)}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">{game.title}</h1>
            <p className="mt-2 max-w-lg text-white/90">Cả nước chơi cùng một đề. Chỉ lần chơi đầu tiên trong ngày được tính lên bảng.</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href={`/games/${game.slug}?daily=1`} className="btn bg-white px-6 py-3.5 text-base text-[#15131f] hover:bg-white/90">
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                {board.me ? "Chơi lại (luyện tập)" : "Chơi thử thách"}
              </Link>
              <Countdown />
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/80">
              <Users className="h-4 w-4" aria-hidden="true" />
              {board.players.toLocaleString("vi-VN")} người đã chơi hôm nay
            </p>
          </div>
          {game.thumbnail && (
            <div className="relative hidden aspect-[16/10] overflow-hidden rounded-2xl border border-white/20 shadow-lift md:block">
              <GameImage src={game.thumbnail} />
            </div>
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Today's board */}
        <section className="rounded-3xl border border-line bg-surface p-4 shadow-card sm:p-6" aria-labelledby="bang-ngay">
          <h2 id="bang-ngay" className="font-bold">
            Bảng xếp hạng hôm nay
          </h2>
          {board.top.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Chưa ai chơi hôm nay. Vào đứng đầu bảng ngay!</p>
          ) : (
            <ol className="mt-3 divide-y divide-line">
              {board.top.map((r) => (
                <li key={r.userId} className={`flex items-center gap-3 py-2.5 ${r.userId === user?.id ? "-mx-2 rounded-xl bg-brand-soft px-2" : ""}`}>
                  <span className="w-8 text-center font-mono text-sm font-bold text-muted">{MEDAL[r.rank - 1] ?? r.rank}</span>
                  <Avatar name={r.name} image={r.image} size={32} />
                  <span className="min-w-0 flex-1 truncate font-medium">{r.name}</span>
                  <span className="font-mono font-bold tabular-nums">{r.score.toLocaleString("vi-VN")}</span>
                  <span className="hidden w-16 text-xs text-muted sm:inline">{unit}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <aside className="flex flex-col gap-4 self-start">
          {/* Me */}
          <section className="rounded-3xl border border-line bg-surface p-5 shadow-card">
            <h2 className="text-sm font-semibold">Kết quả của bạn</h2>
            {user ? (
              <>
                {board.me ? (
                  <p className="mt-2 text-sm">
                    <b className="font-mono text-2xl">{board.me.score.toLocaleString("vi-VN")}</b> {unit} · hạng <b>#{board.me.rank}</b>
                    <span className="block text-xs text-muted">
                      {board.me.attempts > 1 ? `Đã chơi ${board.me.attempts} lần, lần đầu được tính.` : "Lần chơi đầu đã được ghi nhận."}
                    </span>
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-muted">Bạn chưa chơi thử thách hôm nay.</p>
                )}
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-arcade-soft px-3 py-1 text-sm font-semibold text-arcade">
                  <Flame className="h-4 w-4" aria-hidden="true" />
                  Chuỗi {board.streak} ngày
                </p>
              </>
            ) : (
              <>
                <LocalResult day={today} unit={unit} />
                <p className="mt-2 text-sm text-muted">Khách vẫn chơi được thử thách. Đăng nhập để có tên trên bảng và giữ chuỗi ngày chơi.</p>
                <Link href="/login?next=%2Fdaily" className="btn-ghost mt-3 h-10 px-4 text-sm">
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Đăng nhập
                </Link>
              </>
            )}
          </section>

          {/* Upcoming */}
          <section className="rounded-3xl border border-line bg-surface p-5 shadow-card">
            <h2 className="text-sm font-semibold">Những ngày tới</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {upcoming.map((u) => (
                <li key={u.day} className="flex items-center justify-between gap-3">
                  <span className="font-mono text-muted">{shortDay(u.day)}</span>
                  <span className="truncate font-medium">{u.game.title}</span>
                </li>
              ))}
            </ul>
            <Link href="/leaderboard" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
              Bảng xếp hạng mọi thời đại →
            </Link>
          </section>
          <AdSlot placement="sidebar" />
        </aside>
      </div>
    </div>
  );
}
