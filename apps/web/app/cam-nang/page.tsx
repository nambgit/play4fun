import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/article/article-card";
import { JsonLd } from "@/components/json-ld";
import { ARTICLES } from "@/lib/articles";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Cẩm nang: mẹo gõ phím, tính nhẩm, trò chơi team building";
const DESCRIPTION =
  "Bài viết hữu ích: luyện gõ 10 ngón, tốc độ gõ phím WPM, mẹo tính nhẩm, trò chơi team building, câu hỏi đố vui, luật Ai là gián điệp và từ khóa vẽ đoán chữ.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/cam-nang" },
  openGraph: { title: `${TITLE} | Play4Fun`, description: DESCRIPTION, url: "/cam-nang" },
};

export default function ArticlesIndex() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cẩm nang Play4Fun",
    description: DESCRIPTION,
    url: `${SITE_URL}/cam-nang`,
    inLanguage: "vi",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: ARTICLES.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/cam-nang/${a.slug}`, name: a.title })),
    },
  };
  return (
    <div className="container-page pt-4 sm:pt-8">
      <JsonLd data={ld} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-fg">
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-fg">Cẩm nang</span>
      </nav>
      <header className="mt-4 max-w-3xl sm:mt-6">
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">Cẩm nang</h1>
        <p className="mt-3 text-base leading-relaxed text-pretty text-muted sm:text-lg">
          Mẹo gõ phím và tính nhẩm, ý tưởng trò chơi cho buổi team building, luật chơi và từ khóa cho các game nhóm. Mỗi bài đều có game để bạn thử ngay.
        </p>
      </header>
      <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {ARTICLES.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  );
}
