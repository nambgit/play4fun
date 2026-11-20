import { eq, userRecords, users } from "@play4fun/db";
import { GameImage } from "@/components/game-image";
import { Building2, CalendarDays, LayoutDashboard, Play, Trophy } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar } from "@/components/auth/account-menu";
import { DONG_NGHIEP } from "@/games/quiz/content/dong-nghiep";
import { GAMER } from "@/games/quiz/content/gamer";
import { HOC_KIEU_GI } from "@/games/quiz/content/hoc-kieu-gi";
import { isAdmin } from "@/lib/admin-stats";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getGame } from "@/lib/games";
import { RECORDS } from "@/lib/record-keys";
import { AccountActions } from "./account-actions";
import { LeaderboardToggle } from "./leaderboard-toggle";
import { DeviceRecords } from "./device-records";

export const metadata: Metadata = { title: "Tài khoản", robots: { index: false } };
export const dynamic = "force-dynamic";

/** "quiz:<slug>:<type id>" → personality type */
const QUIZ_TYPES = new Map<string, (typeof GAMER.types)[number]>(
  [DONG_NGHIEP, HOC_KIEU_GI, GAMER].flatMap((q) => q.types.map((t) => [`quiz:${q.slug}:${t.id}`, t] as [string, typeof t])),
);

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/accounts");

  const db = getDb();
  const [rows, [prefs]] = await Promise.all([
    db.select().from(userRecords).where(eq(userRecords.userId, user.id)),
    db.select({ showOnLeaderboard: users.showOnLeaderboard }).from(users).where(eq(users.id, user.id)),
  ]);
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const best = RECORDS.filter((d) => d.kind === "best");
  const quizzes = RECORDS.filter((d) => d.kind === "latest");
  const realEmail = !user.email.endsWith(".invalid");
  const joined = new Date(user.createdAt).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="container-page py-6 sm:py-10">
      {/* Profile */}
      <section className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:p-7">
        <Avatar name={user.name} image={user.image} size={72} />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">{user.name}</h1>
          {realEmail && <p className="truncate text-sm text-muted">{user.email}</p>}
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            Tham gia ngày {joined}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          {isAdmin(user.email) && (
            <Link href="/admin" className="btn-primary h-10 px-4">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Bảng điều khiển
            </Link>
          )}
          <Link href="/studio" className="btn-ghost h-10 px-4">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            Studio câu hỏi
          </Link>
          <AccountActions />
        </div>
      </section>

      <div className="mt-4">
        <LeaderboardToggle initial={prefs?.showOnLeaderboard ?? true} />
      </div>

      {/* Records */}
      <section aria-labelledby="ky-luc" className="mt-8 sm:mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="ky-luc" className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Kỷ lục của bạn
            </h2>
            <p className="mt-1 text-sm text-muted">Tự đồng bộ giữa các thiết bị bạn đăng nhập. Điểm cao nhất luôn được giữ lại.</p>
          </div>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {best.map((d) => {
            const g = getGame(d.slug);
            const row = byKey.get(d.key);
            return (
              <li key={d.key} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                  {g?.thumbnail && <GameImage src={g.thumbnail} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{d.label}</p>
                  {row ? (
                    <p className="mt-0.5 flex items-center gap-1.5 font-mono text-lg font-bold">
                      <Trophy className="h-4 w-4 text-[#f5a400]" aria-hidden="true" />
                      {row.value.toLocaleString("vi-VN")}
                      <span className="font-sans text-xs font-medium text-muted">{d.unit}</span>
                    </p>
                  ) : (
                    <p className="mt-0.5 text-sm text-muted">Chưa có kỷ lục</p>
                  )}
                </div>
                <Link href={`/games/${d.slug}`} aria-label={`Chơi ${d.label}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-brand-ink transition hover:bg-brand-strong">
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
        <DeviceRecords />
      </section>

      {/* Quiz results */}
      <section aria-labelledby="test-vui" className="mt-10">
        <h2 id="test-vui" className="text-xl font-extrabold tracking-tight sm:text-2xl">
          Kết quả test vui gần nhất
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {quizzes.map((d) => {
            const meta = byKey.get(d.key)?.meta as { result?: string } | null | undefined;
            const type = meta?.result ? QUIZ_TYPES.get(`${d.key}:${meta.result}`) : undefined;
            return (
              <li key={d.key}>
                <Link href={`/games/${d.slug}`} className="flex h-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card transition hover:border-brand/30">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface-2 text-2xl" aria-hidden="true">
                    {type?.emoji ?? "❔"}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs text-muted">{d.label}</span>
                    <span className="block truncate font-semibold">{type ? type.name : "Chưa làm — thử ngay"}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
