import { Clock, Users } from "lucide-react";
import Link from "next/link";
import { AUDIENCE_LABEL, TYPE_META, type GameEntry } from "@/lib/games";
import { GameCover } from "./game-cover";

export function GameCard({ game }: { game: GameEntry }) {
  const meta = TYPE_META[game.type];
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lift"
    >
      <div className="relative">
        <GameCover game={game} />
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${meta.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
        {game.status === "soon" && (
          <span className="absolute top-3 right-3 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            Sắp ra mắt
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug transition-colors group-hover:text-brand">{game.title}</h3>
        <p className="mt-1.5 mb-4 line-clamp-2 text-sm leading-relaxed text-muted">{game.tagline}</p>

        <div className="mt-auto flex items-center gap-4 border-t border-line pt-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {game.duration}
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {game.players}
          </span>
          <span className="ml-auto truncate">{AUDIENCE_LABEL[game.audience[0]]}</span>
        </div>
      </div>
    </Link>
  );
}
