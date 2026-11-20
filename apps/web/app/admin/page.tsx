import { Activity, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RANGES, accountStats, analyticsConfigured, isAdmin, liveRooms, traffic, type Range } from "@/lib/admin-stats";
import { currentUser } from "@/lib/auth";
import { GAMES, getGame } from "@/lib/games";
import { RECORD_BY_KEY } from "@/lib/record-keys";
import { BarList, Columns, Stat, fmtDuration, fmtNumber } from "./charts";
import { ExcludeMe } from "./exclude-me";
import { RemoveRecord } from "./remove-record";

export const metadata: Metadata = { title: "Quản trị", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const RANGE_LABEL: Record<Range, string> = { 1: "Hôm nay", 7: "7 ngày", 30: "30 ngày" };
// Umami splits computers into "laptop"/"desktop" by screen size; the query merges them
const DEVICE_LABEL: Record<string, string> = { mobile: "Điện thoại", desktop: "Máy tính", tablet: "Máy tính bảng" };
const PROVIDER_LABEL: Record<string, string> = { google: "Google", facebook: "Facebook", credential: "Email (chỉ dev)" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminPage({ searchParams }: Props) {
  const user = await currentUser();
  // Not an admin (or not signed in): behave as if the page did not exist
  if (!user || !isAdmin(user.email)) notFound();

  const raw = Number((await searchParams).range);
  const range: Range = RANGES.includes(raw as Range) ? (raw as Range) : 7;

  const [t, acc, live] = await Promise.all([traffic(range).catch(() => null), accountStats(range), liveRooms()]);
  const configured = analyticsConfigured();

  const plays = t?.games.reduce((a, g) => a + g.starts, 0) ?? 0;
  const playSeconds = t?.games.reduce((a, g) => a + g.seconds, 0) ?? 0;
  const statsBy = new Map(t?.games.map((g) => [g.game, g]) ?? []);
  const soloGames = GAMES.filter((g) => g.type !== "party" && g.status === "live")
    .map((g) => ({ g, s: statsBy.get(g.slug) }))
    .sort((a, b) => (b.s?.starts ?? 0) - (a.s?.starts ?? 0));
  const maxStarts = Math.max(1, ...soloGames.map((x) => x.s?.starts ?? 0));
  const partyGames = GAMES.filter((g) => g.type === "party");
  const partyBy = new Map(t?.party.map((p) => [p.game, p]) ?? []);

  return (
    <div className="container-page py-6 sm:py-10">
      {/* Header + range filter (one row above all charts) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Quản trị</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Bảng điều khiển</h1>
          {t && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-party opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-party" />
              </span>
              {fmtNumber(t.online)} người đang online (5 phút qua)
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav aria-label="Khoảng thời gian" className="inline-flex rounded-full border border-line bg-surface p-1">
            {RANGES.map((r) => (
              <Link
                key={r}
                href={`/admin?range=${r}`}
                aria-current={r === range ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${r === range ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
              >
                {RANGE_LABEL[r]}
              </Link>
            ))}
          </nav>
          <ExcludeMe />
        </div>
      </div>

      {!configured && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-[#f5a400]/40 bg-[#ffb547]/10 p-4 text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#b77900]" aria-hidden="true" />
          <p>
            Chưa bật thống kê truy cập. Cần chạy container <b>umami</b> và đặt <code>UMAMI_WEBSITE_ID</code> trong <code>.env</code> (README → “Thống kê &amp; trang admin”). Phần
            tài khoản và phòng chơi bên dưới vẫn hoạt động.
          </p>
        </div>
      )}
      {configured && !t && <p className="mt-6 rounded-2xl bg-[#e5484d]/10 p-4 text-sm text-[#e5484d]">Không đọc được dữ liệu Umami. Kiểm tra container umami và UMAMI_DATABASE_URL.</p>}

      {/* Headline numbers */}
      <section aria-label="Chỉ số chính" className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-6">
        <Stat label="Người truy cập" value={t ? fmtNumber(t.visitors) : "—"} sub={t ? `${fmtNumber(t.visits)} lượt ghé` : undefined} />
        <Stat label="Lượt xem trang" value={t ? fmtNumber(t.pageviews) : "—"} />
        <Stat label="Lượt chơi game" value={t ? fmtNumber(plays) : "—"} sub="game 1 người & test vui" />
        <Stat label="Tổng thời gian chơi" value={t ? fmtDuration(playSeconds) : "—"} sub={plays ? `TB ${fmtDuration(playSeconds / plays)}/ván` : undefined} />
        <Stat label="Tài khoản" value={fmtNumber(acc.total)} sub={`+${fmtNumber(acc.fresh)} trong ${RANGE_LABEL[range].toLowerCase()}`} />
        <Stat label="Đang chơi nhóm" value={live ? fmtNumber(live.players) : "—"} sub={live ? `${fmtNumber(live.rooms)} phòng đang mở` : "realtime không phản hồi"} />
      </section>

      {/* Traffic over time */}
      {t && (
        <section className="mt-6 rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <h2 className="font-bold">Người truy cập {t.unit === "hour" ? "theo giờ hôm nay" : `theo ngày · ${RANGE_LABEL[range].toLowerCase()}`}</h2>
          <div className="mt-6">
            <Columns
              caption="Số người truy cập theo thời gian"
              data={t.series.map((s) => ({ label: s.label, value: s.visitors, detail: `${fmtNumber(s.visitors)} người · ${fmtNumber(s.pageviews)} lượt xem` }))}
            />
          </div>
        </section>
      )}

      {t && (
        <div className="mt-6 grid gap-6 md:grid-cols-2 [&>*]:min-w-0">
          <section className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
            <h2 className="font-bold">Nguồn truy cập</h2>
            <p className="mt-0.5 text-xs text-muted">Theo lượt ghé, nhận diện Facebook/TikTok qua link click và UTM.</p>
            <div className="mt-4">
              <BarList rows={t.sources.map((s) => ({ label: s.name, value: s.visits }))} />
            </div>
          </section>
          <section className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
            <h2 className="font-bold">Thiết bị</h2>
            <p className="mt-0.5 text-xs text-muted">Theo số người truy cập.</p>
            <div className="mt-4">
              <BarList rows={t.devices.map((d) => ({ label: DEVICE_LABEL[d.name] ?? d.name, value: d.visitors }))} />
            </div>
          </section>
        </div>
      )}

      {/* Games */}
      {t && (
        <section className="mt-6 rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <h2 className="font-bold">Game được chơi</h2>
          <p className="mt-0.5 text-xs text-muted">
            “Chơi hết” là ván kết thúc tới màn kết quả; ván bị đóng tab hay chuyển trang giữa chừng tính là bỏ dở. Thời gian là gần đúng (tối đa 30 phút/ván).
          </p>
          {/* Phones: one card per game */}
          <ul className="mt-4 divide-y divide-line sm:hidden">
            {soloGames.map(({ g, s }) => {
              const finished = s ? s.ends + s.quits : 0;
              return (
                <li key={g.slug} className="py-3">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <Link href={`/games/${g.slug}`} className="min-w-0 truncate font-medium">
                      {g.title}
                    </Link>
                    <span className="shrink-0 font-mono font-semibold tabular-nums">{fmtNumber(s?.starts ?? 0)} lượt</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${((s?.starts ?? 0) / maxStarts) * 100}%` }} />
                  </div>
                  {s && s.starts > 0 && (
                    <p className="mt-1.5 text-xs text-muted">
                      {fmtNumber(s.players)} người · chơi hết {Math.round((s.ends / s.starts) * 100)}% · TB {finished ? fmtDuration(s.seconds / finished) : "—"}/ván · tổng {fmtDuration(s.seconds)}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-4 hidden sm:block">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted">
                <tr className="border-b border-line">
                  <th className="py-2 font-medium">Game</th>
                  <th className="py-2 font-medium">Lượt chơi</th>
                  <th className="py-2 text-right font-medium">Người chơi</th>
                  <th className="py-2 text-right font-medium">Chơi hết</th>
                  <th className="py-2 text-right font-medium">TB / ván</th>
                  <th className="py-2 text-right font-medium">Tổng thời gian</th>
                </tr>
              </thead>
              <tbody>
                {soloGames.map(({ g, s }) => {
                  const finished = s ? s.ends + s.quits : 0;
                  return (
                    <tr key={g.slug} className="border-b border-line last:border-0">
                      <td className="py-2.5 pr-3">
                        <Link href={`/games/${g.slug}`} className="font-medium hover:text-brand">
                          {g.title}
                        </Link>
                      </td>
                      <td className="w-[28%] py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                            <div className="h-full rounded-full bg-brand" style={{ width: `${((s?.starts ?? 0) / maxStarts) * 100}%` }} />
                          </div>
                          <span className="w-10 text-right font-mono font-semibold tabular-nums">{fmtNumber(s?.starts ?? 0)}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums">{fmtNumber(s?.players ?? 0)}</td>
                      <td className="py-2.5 text-right font-mono tabular-nums">{s && s.starts ? `${Math.round((s.ends / s.starts) * 100)}%` : "—"}</td>
                      <td className="py-2.5 text-right font-mono tabular-nums">{s && finished ? fmtDuration(s.seconds / finished) : "—"}</td>
                      <td className="py-2.5 text-right font-mono tabular-nums">{s ? fmtDuration(s.seconds) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        {/* Party games */}
        <section className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <Activity className="h-4 w-4 text-party" aria-hidden="true" />
            Chơi nhóm
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {partyGames.map((g) => {
              const p = partyBy.get(g.slug);
              const now = live?.byGame[g.slug];
              return (
                <li key={g.slug} className="py-3 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate font-medium">{g.title}</span>
                    <span className={`shrink-0 text-xs ${now?.players ? "font-semibold text-party" : "text-muted"}`}>
                      {now ? `Đang chơi: ${now.players} người · ${now.rooms} phòng` : "Không có phòng"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-muted">
                    <b className="font-mono text-fg">{fmtNumber(p?.games ?? 0)}</b> ván{p ? ` · TB ${p.avgPlayers.toFixed(1)} người/ván` : ""}
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-muted">Số ván trong {RANGE_LABEL[range].toLowerCase()}; cột phải là số liệu ngay lúc này.</p>
        </section>

        {/* Accounts & records */}
        <section className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <h2 className="font-bold">Tài khoản & kỷ lục</h2>
          <div className="mt-4">
            <BarList rows={acc.providers.map((p) => ({ label: PROVIDER_LABEL[p.provider] ?? p.provider, value: p.n }))} empty="Chưa có ai đăng nhập" />
          </div>
          <h3 className="mt-5 text-sm font-semibold">Kỷ lục cao nhất</h3>
          {acc.records.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Chưa có kỷ lục nào được lưu lên tài khoản.</p>
          ) : (
            <ul className="mt-2 divide-y divide-line text-sm">
              {acc.records.map((r) => {
                const def = RECORD_BY_KEY.get(r.key);
                return (
                  <li key={r.key} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 py-2">
                    <span className="w-full truncate sm:w-auto sm:min-w-0 sm:flex-1">{def?.label ?? getGame(r.key)?.title ?? r.key}</span>
                    <span className="min-w-0 flex-1 truncate text-muted sm:flex-none">{r.name}</span>
                    <span className="shrink-0 text-right font-mono font-semibold tabular-nums sm:w-24">
                      {fmtNumber(r.value)} <span className="font-sans text-xs font-normal text-muted">{def?.unit}</span>
                    </span>
                    <RemoveRecord userId={r.userId} recordKey={r.key} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
