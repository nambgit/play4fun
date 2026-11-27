import { Flame } from "lucide-react";
import { GameCard } from "@/components/game-card";
import { hotGames } from "@/lib/hot-games";

const RANK_STYLE = ["bg-[#f5a400] text-white", "bg-[#9aa4b2] text-white", "bg-[#c2763a] text-white"];

/** Top 6 most played games of the week (server component; the home page regenerates hourly) */
export async function HotGames() {
  const list = await hotGames(6);
  if (!list.length) return null;
  return (
    <section aria-labelledby="game-hot" className="container-page">
      <div>
        <p className="eyebrow inline-flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-[#ff6a3d]" aria-hidden="true" />
          Chơi nhiều nhất tuần này
        </p>
        <h2 id="game-hot" className="mt-1.5 text-2xl font-extrabold tracking-tight sm:mt-2 sm:text-4xl">
          Game hot
        </h2>
      </div>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {list.map(({ game }, i) => (
          <li key={game.slug} className="relative">
            <span
              className={`pointer-events-none absolute -top-2.5 -left-2.5 z-10 grid h-9 w-9 place-items-center rounded-full text-sm font-extrabold shadow-lift ${RANK_STYLE[i] ?? "bg-surface text-fg ring-1 ring-line"}`}
              aria-label={`Hạng ${i + 1}`}
            >
              {i + 1}
            </span>
            <GameCard game={game} />
          </li>
        ))}
      </ol>
    </section>
  );
}
