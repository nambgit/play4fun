import type { GameEntry } from "@/lib/games";
import { GameIcon } from "./game-icon";

/**
 * Generated cover art: per-game gradient + dot texture + glass icon tile.
 * Keeps the catalogue visually consistent until real artwork exists.
 */
export function GameCover({ game, size = "md" }: { game: GameEntry; size?: "md" | "lg" }) {
  const [from, to] = game.cover;
  const lg = size === "lg";
  return (
    <div
      className="relative isolate overflow-hidden"
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <div className="bg-dots absolute inset-0 -z-10 opacity-60" />
      <div
        className={`absolute -z-10 rounded-full bg-white/15 blur-2xl ${lg ? "-top-16 -right-10 h-72 w-72" : "-top-10 -right-8 h-40 w-40"}`}
      />
      <div className={`absolute -z-10 rounded-full bg-black/10 ${lg ? "-bottom-24 -left-16 h-72 w-72" : "-bottom-14 -left-10 h-36 w-36"}`} />
      <div className={`grid place-items-center ${lg ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        <div
          className={`grid place-items-center rounded-2xl border border-white/30 bg-white/15 text-white shadow-[0_8px_32px_-8px_rgb(0_0_0/0.35)] backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${lg ? "h-28 w-28" : "h-16 w-16"}`}
        >
          <GameIcon name={game.icon} className={lg ? "h-14 w-14" : "h-8 w-8"} />
        </div>
      </div>
    </div>
  );
}
