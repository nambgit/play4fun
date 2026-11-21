import { CalendarDays, Play, Share2, Timer, Trophy } from "lucide-react";
import Link from "next/link";
import { FEATURED_SLUG, GAMES, GAME_TYPES, TYPE_META } from "@/lib/games";

const LIVE = GAMES.filter((g) => g.status === "live").length;

/** Small illustration on top of each step card: shows the idea instead of a big number */
function StepArt({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="flex flex-wrap gap-1.5" aria-hidden="true">
        {GAME_TYPES.map((t) => (
          <span key={t} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_META[t].soft} ${TYPE_META[t].text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${TYPE_META[t].dot}`} />
            {TYPE_META[t].label}
          </span>
        ))}
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="font-mono text-2xl font-bold tracking-tight tabular-nums">01:00</span>
        <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
          <span className="block h-full w-2/3 rounded-full bg-gradient-to-r from-brand to-[#c04cf0]" />
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2.5" aria-hidden="true">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f5a400]/15 text-[#c98600] dark:text-[#ffc94d]">
        <Trophy className="h-4.5 w-4.5" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block text-sm font-bold">72 WPM · Top 3</span>
        <span className="block text-xs text-muted">Thử vượt qua mình xem!</span>
      </span>
    </div>
  );
}

const STEPS = [
  { title: "Chọn một game", body: "Không tải app, không đăng ký. Bấm vào là chơi, trên máy tính hay điện thoại đều mượt." },
  { title: "Chơi trong 1–5 phút", body: "Vừa đủ cho giờ giải lao, giữa hai tiết học hay lúc chờ trận. Không lo bị cuốn quá giờ." },
  { title: "Khoe kết quả", body: "Mỗi ván có ảnh kết quả riêng để chia sẻ. Rủ đồng nghiệp, bạn bè vào so điểm trên bảng xếp hạng." },
];

const ICONS = [Play, Timer, Share2];

export function HowItWorks() {
  return (
    <section aria-labelledby="cach-choi" className="container-page">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Cách chơi</p>
        <h2 id="cach-choi" className="mt-1.5 text-2xl font-extrabold tracking-tight text-balance sm:mt-2 sm:text-4xl">
          Đơn giản như mở một tab mới
        </h2>
        <p className="mt-3 text-sm text-pretty text-muted sm:text-base">
          {LIVE} game miễn phí, chơi ngay trên trình duyệt, không cần tài khoản.
        </p>
      </div>

      <ol className="relative mt-8 grid gap-4 sm:mt-12 md:grid-cols-3 md:gap-6">
        {/* Connector behind the step badges (desktop) */}
        <span aria-hidden="true" className="absolute top-7 right-[16.66%] left-[16.66%] hidden border-t-2 border-dashed border-brand/25 md:block" />
        {STEPS.map((s, i) => {
          const Icon = ICONS[i];
          return (
            <li key={s.title} className="relative flex flex-col">
              <div className="flex items-center gap-3 md:flex-col md:gap-0">
                <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-[#9b5cff] text-white shadow-[0_10px_24px_-10px_var(--brand)] ring-4 ring-bg">
                  <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="text-xs font-bold tracking-[0.18em] text-brand uppercase md:mt-3">Bước {i + 1}</span>
              </div>
              <div className="mt-3 flex flex-1 flex-col rounded-3xl border border-line bg-surface p-5 shadow-card md:mt-5 md:p-6">
                <div className="flex min-h-10 items-center *:w-full">
                  <StepArt step={i} />
                </div>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center">
        <Link href={`/games/${FEATURED_SLUG}`} className="btn-primary px-7 py-3.5 text-base">
          <Play className="h-4 w-4 fill-current" aria-hidden="true" />
          Chơi thử ngay
        </Link>
        <Link href="/daily" className="btn-ghost px-7 py-3.5 text-base">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Thử thách hôm nay
        </Link>
      </div>
    </section>
  );
}
