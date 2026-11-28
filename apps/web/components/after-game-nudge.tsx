"use client";

import { CalendarDays, LogIn, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GAME_END_EVENT } from "@/lib/analytics";
import { useSession } from "@/lib/auth-client";
import { currentStreak, untilTomorrow } from "@/lib/streak";
import { loginHref } from "./auth/account-menu";
import { InstallButton } from "./install-app";

/**
 * Under the game, after a finished round: the streak, a reason to come back tomorrow (the daily
 * challenge changes at midnight), and the two things that make coming back easy: the app on the
 * home screen, and an account that keeps the streak on every device. Dismissible for the visit.
 */
export function AfterGameNudge({ slug }: { slug: string }) {
  const [shown, setShown] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [info, setInfo] = useState<{ current: number; best: number; h: number; m: number } | null>(null);
  const { data, isPending } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const onEnd = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== slug) return;
      const s = currentStreak();
      const t = untilTomorrow();
      setInfo({ current: s.current, best: s.best, h: t.hours, m: t.minutes });
      setShown(true);
    };
    window.addEventListener(GAME_END_EVENT, onEnd);
    return () => window.removeEventListener(GAME_END_EVENT, onEnd);
  }, [slug]);

  if (!shown || hidden || !info) return null;
  const first = info.current <= 1;
  return (
    <div className="mt-4 rounded-2xl border border-[#ff6a3d]/25 bg-surface p-4 shadow-card sm:p-5" role="status">
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden="true">
          🔥
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold">{first ? "Bạn vừa bắt đầu chuỗi ngày chơi!" : `Chuỗi ${info.current} ngày liên tiếp!`}</p>
          <p className="mt-0.5 text-sm text-muted">
            Quay lại ngày mai để giữ chuỗi{info.best > info.current ? ` (kỷ lục của bạn: ${info.best} ngày)` : ""}. Thử thách hằng ngày có đề mới sau {info.h > 0 ? `${info.h} giờ ` : ""}
            {info.m} phút.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/daily" className="btn-ghost h-10 px-4 text-sm">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Thử thách hôm nay
            </Link>
            <InstallButton className="btn-ghost h-10 px-4 text-sm" />
            {!isPending && !data?.user && (
              <Link href={loginHref(pathname)} className="btn-ghost h-10 px-4 text-sm">
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Đăng nhập để giữ chuỗi trên mọi máy
              </Link>
            )}
          </div>
        </div>
        <button type="button" onClick={() => setHidden(true)} className="rounded-lg p-1 text-muted hover:bg-surface-2 hover:text-fg" aria-label="Ẩn lời nhắc">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
