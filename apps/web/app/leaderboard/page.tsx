import { CalendarDays, Play, Trophy } from "lucide-react";
import { GameImage } from "@/components/game-image";
import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { Avatar } from "@/components/auth/account-menu";
import { currentUser } from "@/lib/auth";
import { getGame } from "@/lib/games";
import { myRank, topRecords } from "@/lib/leaderboard";
import { RECORDS, RECORD_BY_KEY } from "@/lib/record-keys";

export const metadata: Metadata = {
  title: "Bảng xếp hạng",
  description: "Kỷ lục cao nhất của người chơi Play4Fun ở từng mini-game.",
  alternates: { canonical: "/leaderboard" },
};
export const dynamic = "force-dynamic";

const BOARDS = RECORDS.filter((r) => r.kind === "best");
const MEDAL = ["🥇", "🥈", "🥉"];

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function LeaderboardPage({ searchParams }: Props) {
  const raw = (await searchParams).game;
  const key = typeof raw === "string" && RECORD_BY_KEY.get(raw)?.kind === "best" ? raw : BOARDS[0].key;
  const def = RECORD_BY_KEY.get(key)!;
  const game = getGame(def.slug);
  const [rows, user] = await Promise.all([topRecords(key, 50), currentUser()]);
  const me = user ? await myRank(key, user.id) : null;

  return (
    <div className="container-page py-6 sm:py-10">
      <p className="eyebrow">Xếp hạng</p>
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-4xl">Bảng xếp hạng</h1>
      <p className="mt-1.5 text-sm text-muted sm:text-base">Kỷ lục cao nhất của người chơi đã đăng nhập. Muốn thi đấu cùng một đề mỗi ngày? Xem thử thách hôm nay.</p>
      <Link href="/daily" className="btn-ghost mt-4 h-10 px-4 text-sm">
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        Thử thách hôm nay
      </Link>

      <nav aria-label="Chọn game" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {BOARDS.map((b) => (
          <Link
            key={b.key}
            href={`/leaderboard?game=${encodeURIComponent(b.key)}`}
            aria-current={b.key === key ? "page" : undefined}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${b.key === key ? "border-fg bg-fg text-bg" : "border-line bg-surface text-muted hover:text-fg"}`}
          >
            {b.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-3xl border border-line bg-surface p-4 shadow-card sm:p-6" aria-label={`Bảng xếp hạng ${def.label}`}>
          {rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">Chưa có kỷ lục nào. Hãy là người đầu tiên!</p>
          ) : (
            <ol className="divide-y divide-line">
              {rows.map((r) => (
                <li key={r.userId} className={`flex items-center gap-3 px-1 py-2.5 ${r.userId === user?.id ? "-mx-1 rounded-xl bg-brand-soft px-2" : ""}`}>
                  <span className="w-8 text-center font-mono text-sm font-bold text-muted">{MEDAL[r.rank - 1] ?? r.rank}</span>
                  <Avatar name={r.name} image={r.image} size={32} />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {r.name}
                    {r.userId === user?.id && <span className="ml-1 text-xs text-muted">(bạn)</span>}
                  </span>
                  <span className="font-mono text-base font-bold tabular-nums">{r.value.toLocaleString("vi-VN")}</span>
                  <span className="hidden w-16 text-xs text-muted sm:inline">{def.unit}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-20">
          {game && (
            <Link href={`/games/${game.slug}`} className="group overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
              {game.thumbnail && (
                <div className="relative aspect-[16/10]">
                  <GameImage src={game.thumbnail} className="transition-transform duration-500 group-hover:scale-105" />
                </div>
              )}
              <div className="flex items-center gap-3 p-4">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold">{game.title}</span>
                  <span className="block text-xs text-muted">{me ? `Hạng của bạn: #${me.rank} · ${me.value.toLocaleString("vi-VN")} ${def.unit}` : "Chơi để ghi tên lên bảng"}</span>
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-brand-ink">
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                </span>
              </div>
            </Link>
          )}
          <p className="flex gap-2 px-1 text-xs leading-relaxed text-muted">
            <Trophy className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Chỉ tính người chơi đã đăng nhập. Không muốn hiện tên? Tắt trong trang Tài khoản. Kỷ lục bất thường sẽ bị gỡ.
          </p>
          <AdSlot placement="sidebar" />
        </aside>
      </div>
    </div>
  );
}
