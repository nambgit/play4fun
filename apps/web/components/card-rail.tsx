import type { GameEntry } from "@/lib/games";
import { GameCard } from "./game-card";

/**
 * Game cards that swipe horizontally on phones (snap, next card peeking in) and become a
 * regular grid from `sm` up. Keeps long catalogues short on mobile.
 */
export function CardRail({ games, label }: { games: GameEntry[]; label?: string }) {
  return (
    <ul
      aria-label={label}
      className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-1 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
    >
      {games.map((g) => (
        <li key={g.slug} className="w-[80%] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none">
          <GameCard game={g} />
        </li>
      ))}
    </ul>
  );
}
