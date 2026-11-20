"use client";

import { ChevronRight, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, loginHref } from "@/components/auth/account-menu";
import { useSession } from "@/lib/auth-client";
import { RECORDS } from "@/lib/record-keys";

type Row = { rank: number; name: string; image: string | null; value: number; me: boolean };
type Data = { top: Row[]; me: { rank: number; value: number } | null };

const MEDAL = ["🥇", "🥈", "🥉"];

/** Top 5 for a game, loaded in the browser so game pages stay static */
export function LeaderboardCard({ slug }: { slug: string }) {
  const defs = RECORDS.filter((r) => r.slug === slug && r.kind === "best");
  const [key, setKey] = useState(defs[0]?.key);
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (!key) return;
    let alive = true;
    setData(null);
    fetch(`/api/leaderboard?key=${encodeURIComponent(key)}&limit=5`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Data) => alive && setData(d))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [key, session?.user?.id]);

  if (!key || failed) return null;
  const def = defs.find((d) => d.key === key)!;

  return (
    <section className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6" aria-labelledby={`bxh-${slug}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 id={`bxh-${slug}`} className="flex items-center gap-2 text-sm font-semibold">
          <Trophy className="h-4 w-4 text-[#f5a400]" aria-hidden="true" />
          Bảng xếp hạng
        </h2>
        {defs.length > 1 && (
          <div role="tablist" className="inline-flex rounded-full border border-line p-0.5 text-xs">
            {defs.map((d) => (
              <button
                key={d.key}
                type="button"
                role="tab"
                aria-selected={d.key === key}
                onClick={() => setKey(d.key)}
                className={`rounded-full px-2.5 py-1 font-semibold ${d.key === key ? "bg-fg text-bg" : "text-muted"}`}
              >
                {d.label.split("· ")[1] ?? d.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {!data ? (
        <ul className="mt-4 space-y-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="h-8 animate-pulse rounded-lg bg-surface-2" />
          ))}
        </ul>
      ) : data.top.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Chưa có ai trên bảng. Đăng nhập và chơi một ván để đứng đầu!</p>
      ) : (
        <ol className="mt-3 space-y-1">
          {data.top.map((r) => (
            <li key={r.rank} className={`flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm ${r.me ? "bg-brand-soft" : ""}`}>
              <span className="w-6 text-center text-xs font-bold text-muted">{MEDAL[r.rank - 1] ?? r.rank}</span>
              <Avatar name={r.name} image={r.image} size={24} />
              <span className="min-w-0 flex-1 truncate">{r.name}</span>
              <span className="font-mono font-semibold tabular-nums">{r.value.toLocaleString("vi-VN")}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-3 border-t border-line pt-3 text-xs text-muted">
        {session?.user ? (
          data?.me ? (
            <p>
              Hạng của bạn: <b className="text-fg">#{data.me.rank}</b> · {data.me.value.toLocaleString("vi-VN")} {def.unit}
            </p>
          ) : (
            <p>Chơi một ván để có tên trên bảng.</p>
          )
        ) : (
          <Link href={loginHref(pathname)} className="hover:text-fg hover:underline">
            Đăng nhập để có tên trên bảng xếp hạng
          </Link>
        )}
        <Link href={`/leaderboard?game=${encodeURIComponent(key)}`} className="mt-2 inline-flex items-center font-semibold text-brand hover:underline">
          Xem bảng đầy đủ
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
