import { Clock } from "lucide-react";
import Link from "next/link";
import { GameImage } from "@/components/game-image";
import type { ArticleMeta } from "@/lib/articles";
import { getGame } from "@/lib/games";

/** Card linking to a Cẩm nang article (cover = screenshot of the game it leads to) */
export function ArticleCard({ article, compact = false }: { article: ArticleMeta; compact?: boolean }) {
  const thumb = getGame(article.games[0])?.thumbnail;
  return (
    <Link
      href={`/cam-nang/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift dark:hover:border-brand/50"
    >
      {!compact && thumb && (
        <span className="relative block aspect-[16/9] overflow-hidden bg-surface-2">
          <GameImage src={thumb} alt="" className="transition-transform duration-500 group-hover:scale-105" />
        </span>
      )}
      <span className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold tracking-wide text-brand uppercase">{article.kicker}</span>
        <span className="mt-1.5 text-base leading-snug font-bold text-balance text-fg group-hover:text-brand">{article.title}</span>
        {!compact && <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{article.description}</span>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs text-muted">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {article.readMinutes} phút đọc
        </span>
      </span>
    </Link>
  );
}
