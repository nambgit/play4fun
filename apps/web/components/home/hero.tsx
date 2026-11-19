import { ArrowRight, Check, Flame, Play, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { FEATURED_SLUG } from "@/lib/games";

const PERKS = ["Không cần cài đặt", "Không cần đăng ký", "Mượt trên điện thoại"];

// Result grid shown on the "daily challenge" preview card (1 = correct, 0 = wrong, 2 = combo)
const RESULT_ROWS = [
  [1, 1, 1, 0, 1, 1],
  [1, 2, 2, 2, 1, 0],
  [1, 1, 2, 2, 2, 2],
];
const CELL = ["bg-rose-400", "bg-emerald-400", "bg-amber-400"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background: faint grid + two soft color blooms */}
      <div className="bg-grid-faint absolute inset-0 -z-10" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />
      <div className="absolute top-40 -right-40 -z-10 h-72 w-72 rounded-full bg-arcade/20 blur-[100px]" />

      <div className="container-page grid items-center gap-14 pt-14 pb-20 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28">
        <div>
          <Link
            href="/games/inbox-zero"
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 py-1 pr-3 pl-1 text-xs font-medium shadow-card backdrop-blur"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-brand-ink">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Mới
            </span>
            Thử thách Inbox Zero hằng ngày đã có
            <ArrowRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>

          <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Chơi 5 phút,{" "}
            <span className="bg-gradient-to-r from-brand via-[#c04cf0] to-arcade bg-clip-text text-transparent">
              xả stress
            </span>{" "}
            cả ngày.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted">
            Mini-game giải lao, test tính cách và party game chơi nhóm — dành cho dân văn phòng, học sinh và gamer. Mở
            trình duyệt là chơi.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/games/${FEATURED_SLUG}`} className="btn-primary px-6 py-3.5 text-base">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Chơi ngay — miễn phí
            </Link>
            <Link href="/#choi-nhom" className="btn-ghost px-6 py-3.5 text-base">
              <Users className="h-4 w-4" aria-hidden="true" />
              Chơi cùng nhóm
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {PERKS.map((p) => (
              <li key={p} className="inline-flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-party-soft text-party">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
      {/* Back card: party room */}
      <div className="absolute -top-6 -right-2 hidden w-[62%] rotate-6 sm:block rounded-3xl border border-line bg-surface p-5 shadow-card sm:-right-6">
        <p className="text-[11px] font-semibold tracking-wider text-party uppercase">Phòng chơi nhóm</p>
        <p className="mt-1 font-mono text-2xl font-bold tracking-[0.2em]">K7QX2</p>
        <div className="mt-3 flex -space-x-2">
          {["bg-brand", "bg-arcade", "bg-quiz", "bg-party", "bg-amber-400"].map((c, i) => (
            <span key={c} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-surface text-[11px] font-bold text-white ${c}`}>
              {"MLHTA"[i]}
            </span>
          ))}
          <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-surface bg-surface-2 text-[11px] font-semibold text-muted">
            +4
          </span>
        </div>
      </div>

      {/* Front card: daily challenge result */}
      <div className="relative w-full -rotate-1 sm:mt-32 sm:w-[88%] sm:-rotate-2 rounded-3xl border border-line bg-surface p-6 shadow-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Thử thách hôm nay</p>
            <p className="mt-1 text-xl font-bold">Inbox Zero #001</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full whitespace-nowrap bg-arcade-soft px-2.5 py-1 text-xs font-bold text-arcade">
            <Flame className="h-3.5 w-3.5" />
            Combo ×5
          </span>
        </div>

        <div className="mt-5 space-y-1.5">
          {RESULT_ROWS.map((row, r) => (
            <div key={r} className="flex gap-1.5">
              {row.map((v, c) => (
                <span key={c} className={`h-7 flex-1 rounded-md ${CELL[v]}`} />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="text-3xl font-extrabold tracking-tight">
              42<span className="text-base font-semibold text-muted"> email / 60s</span>
            </p>
            <p className="mt-0.5 text-xs text-muted">Hơn 87% người chơi hôm nay</p>
          </div>
          <span className="shrink-0 rounded-xl bg-brand px-3 py-2 text-xs font-semibold whitespace-nowrap text-brand-ink">Khoe kết quả</span>
        </div>
      </div>

      {/* Floating badge — sits in the empty space above the front card */}
      <div className="animate-float absolute top-6 left-0 hidden rounded-2xl sm:block border border-line bg-surface px-4 py-3 shadow-card sm:-left-4">
        <p className="text-[11px] text-muted">Danh hiệu mới</p>
        <p className="text-sm font-bold">🏆 Trợ lý ảo đời thật</p>
      </div>
    </div>
  );
}
