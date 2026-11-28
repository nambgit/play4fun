import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article/article-card";
import { ARTICLES } from "@/lib/articles";

/**
 * Newest Cẩm nang guides on the home page: the strongest internal links on the site point at
 * the articles, which helps them get crawled and ranked.
 */
export function LatestArticles() {
  const latest = [...ARTICLES].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 6);
  return (
    <section aria-labelledby="cam-nang-moi" className="container-page">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Cẩm nang</p>
          <h2 id="cam-nang-moi" className="mt-1.5 text-2xl font-extrabold tracking-tight sm:mt-2 sm:text-4xl">
            Mẹo hay, luật chơi, câu hỏi vui
          </h2>
        </div>
        <Link href="/cam-nang" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:underline">
          Xem tất cả {ARTICLES.length} bài
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {latest.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  );
}
