import { ArrowRight, Check, Play, Sparkles, Users } from "lucide-react";
import { GameImage } from "../game-image";
import Link from "next/link";
import { FEATURED_SLUG, GAMES, TYPE_META, getGame, type GameEntry } from "@/lib/games";

const PERKS = ["Không cần cài đặt", "Không cần đăng ký", "Mượt trên điện thoại"];

/** Real screenshots shown in the hero collage: one per category */
const COLLAGE = ["do-vui-team-building", "deadline-dash", "ban-hoc-kieu-gi"]
  .map((slug) => getGame(slug))
  .filter((g): g is GameEntry => !!g?.thumbnail);

const NEWEST = getGame("ai-la-gian-diep");
const LIVE_COUNT = GAMES.filter((g) => g.status === "live").length;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background: faint grid + two soft color blooms */}
      <div className="bg-grid-faint absolute inset-0 -z-10" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px] dark:bg-brand/25" />
      {/* warm bloom in light mode; in dark mode orange over black turns brown, so use a cool one */}
      <div className="absolute top-40 -right-40 -z-10 h-72 w-72 rounded-full bg-arcade/20 blur-[100px] dark:bg-quiz/15" />
      {/* Painted after the blooms: fade them into the page so the section has no visible bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-bg" />

      <div className="container-page grid items-center gap-10 pt-8 pb-12 sm:pt-14 sm:pb-16 md:pt-20 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:pb-24">
        <div>
          {NEWEST && (
            <Link
              href={`/games/${NEWEST.slug}`}
              className="group inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-surface/80 py-1 pr-3 pl-1 text-xs font-medium shadow-card backdrop-blur"
            >
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-brand-ink">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Mới
              </span>
              <span className="truncate">Chơi nhóm realtime: {NEWEST.title}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          )}

          <h1 className="mt-5 text-[2.5rem] leading-[1.05] font-extrabold tracking-tight text-balance sm:mt-6 sm:text-5xl lg:text-6xl">
            Chơi 5 phút,{" "}
            <span className="bg-gradient-to-r from-brand via-[#c04cf0] to-arcade bg-clip-text text-transparent">xả stress</span> cả ngày.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted sm:mt-5 sm:text-lg">
            Mini-game giải lao, test tính cách và party game chơi nhóm cho dân văn phòng, học sinh và gamer. Mở trình duyệt là chơi.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:flex">
            <Link href={`/games/${FEATURED_SLUG}`} className="btn-primary px-4 py-3.5 text-base sm:px-6">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Chơi ngay
            </Link>
            <Link href="/#choi-nhom" className="btn-ghost px-4 py-3.5 text-base sm:px-6">
              <Users className="h-4 w-4" aria-hidden="true" />
              Chơi nhóm
            </Link>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted sm:mt-8">
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

        <HeroCollage />
      </div>
    </section>
  );
}

/**
 * Real game screenshots: one large tile over two small ones, all at their native 16:10.
 * Hidden on phones, where the swipe rails right below show the same screenshots.
 */
function HeroCollage() {
  const [big, ...small] = COLLAGE;
  if (!big) return null;
  return (
    <div className="relative mx-auto hidden w-full max-w-xl sm:block lg:max-w-none" aria-hidden="true">
      <div className="absolute inset-[8%] -z-10 rounded-full bg-gradient-to-tr from-brand/25 via-[#c04cf0]/15 to-arcade/25 blur-3xl" />
      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        <Tile game={big} className="col-span-2" large priority />
        {small.map((g) => (
          <Tile key={g.slug} game={g} />
        ))}
      </div>
      <div className="animate-float absolute -top-4 -right-2 rounded-2xl border border-line bg-surface px-3.5 py-2 shadow-lift lg:-right-4">
        <p className="text-sm font-bold">🎮 {LIVE_COUNT} game miễn phí</p>
      </div>
    </div>
  );
}

function Tile({ game, className = "", large = false, priority = false }: { game: GameEntry; className?: string; large?: boolean; priority?: boolean }) {
  const meta = TYPE_META[game.type];
  return (
    <div className={`group overflow-hidden rounded-2xl border border-line bg-surface shadow-lift ${className}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <GameImage src={game.thumbnail!} priority={priority} className="transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className={`flex items-center gap-2 border-t border-line ${large ? "px-4 py-2.5" : "px-3 py-2"}`}>
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
        <span className={`truncate font-semibold ${large ? "text-sm" : "text-xs"}`}>{game.title}</span>
        <span className={`ml-auto shrink-0 text-[11px] font-semibold ${meta.text}`}>{meta.label}</span>
      </div>
    </div>
  );
}
