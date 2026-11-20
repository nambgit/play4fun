import Image from "next/image";
import type { GameEntry } from "@/lib/games";
import { GameIcon } from "./game-icon";

/**
 * Cover art for a game card / page.
 * - Live games with a `thumbnail`: real in-game screenshot.
 * - Otherwise: generated art (per-game gradient + dot texture + glass icon tile),
 *   keeping the catalogue visually consistent until a screenshot exists.
 */
export function GameCover({ game, size = "md" }: { game: GameEntry; size?: "md" | "lg" }) {
  const lg = size === "lg";
  const aspect = lg ? "aspect-[16/9]" : "aspect-[16/10]";

  if (game.thumbnail) {
    return (
      <div className={`relative overflow-hidden bg-surface-2 ${aspect}`}>
        <Image
          src={game.thumbnail}
          alt={`Ảnh trong game ${game.title}`}
          fill
          // Already a compressed 1200×750 WebP: skip the runtime optimizer (no sharp needed in the container)
          unoptimized
          sizes={lg ? "(min-width: 1024px) 800px, 100vw" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Soft top shade keeps the corner badges readable on bright screenshots */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5 ring-inset" />
      </div>
    );
  }

  const [from, to] = game.cover;
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
      <div className={`grid place-items-center ${aspect}`}>
        <div
          className={`grid place-items-center rounded-2xl border border-white/30 bg-white/15 text-white shadow-[0_8px_32px_-8px_rgb(0_0_0/0.35)] backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${lg ? "h-28 w-28" : "h-16 w-16"}`}
        >
          <GameIcon name={game.icon} className={lg ? "h-14 w-14" : "h-8 w-8"} />
        </div>
      </div>
    </div>
  );
}
