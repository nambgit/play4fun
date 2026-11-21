import { Lightbulb, Play } from "lucide-react";
import Link from "next/link";
import { GameImage } from "@/components/game-image";
import { getGame } from "@/lib/games";

/** Building blocks for articles in content/articles/*.tsx (all render inside `.article`) */

/** Highlighted tip box */
export function Tip({ children, title = "Mẹo nhỏ" }: { children: React.ReactNode; title?: string }) {
  return (
    <aside className="not-prose flex gap-3 rounded-2xl border border-brand/20 bg-brand-soft p-4 text-[0.98rem] sm:p-5">
      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
      <div className="leading-relaxed">
        <p className="font-bold text-fg">{title}</p>
        <div className="mt-1 text-fg/85">{children}</div>
      </div>
    </aside>
  );
}

/** Card that leads from the article into a game */
export function PlayCta({ slug, text }: { slug: string; text?: string }) {
  const game = getGame(slug);
  if (!game) return null;
  return (
    <Link
      href={`/games/${slug}`}
      className="not-article group flex items-center gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-3 no-underline shadow-card transition-colors hover:border-brand/40 sm:p-4"
    >
      {game.thumbnail && (
        <span className="relative block aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:w-36">
          <GameImage src={game.thumbnail} alt="" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-fg">{game.title}</span>
        <span className="mt-0.5 block text-sm leading-snug text-muted">{text ?? game.tagline}</span>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          Chơi miễn phí
        </span>
      </span>
    </Link>
  );
}

/** Table that scrolls sideways on narrow phones instead of squeezing */
export function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Word list laid out in columns (keyword lists) */
export function WordGrid({ words }: { words: string[] }) {
  return (
    <ul className="not-article grid grid-cols-2 gap-x-6 gap-y-1.5 pl-0! sm:grid-cols-3" style={{ listStyle: "none" }}>
      {words.map((w) => (
        <li key={w} className="m-0! text-fg/85">
          {w}
        </li>
      ))}
    </ul>
  );
}
