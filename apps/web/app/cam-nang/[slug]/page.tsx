import { ChevronRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article/article-card";
import { PlayCta } from "@/components/article/parts";
import { FaqSection, faqJsonLd } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { ARTICLE_BODY } from "@/content/articles";
import { ARTICLES, formatDate, getArticle } from "@/lib/articles";
import { getGame, shareImage } from "@/lib/games";
import { SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

function coverOf(slug: string) {
  const game = getGame(slug);
  return game ? shareImage(game) : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  const image = coverOf(a.games[0]);
  const path = `/cam-nang/${a.slug}`;
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.description,
      url: path,
      publishedTime: a.published,
      modifiedTime: a.updated,
      images: image ? [{ url: image, width: 1200, height: 750, alt: a.title }] : undefined,
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.description, images: image ? [image] : undefined },
  };
}

export default async function ArticlePage({ params }: Props) {
  const a = getArticle((await params).slug);
  const Body = a ? ARTICLE_BODY[a.slug] : undefined;
  if (!a || !Body) notFound();
  const url = `${SITE_URL}/cam-nang/${a.slug}`;
  const image = coverOf(a.games[0]);
  const shares = (x: (typeof ARTICLES)[number]) => Number(x.games.some((g) => a.games.includes(g)));
  const more = ARTICLES.filter((x) => x.slug !== a.slug)
    .sort((x, y) => shares(y) - shares(x))
    .slice(0, 3);

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.description,
      image: image ? [SITE_URL + image] : undefined,
      datePublished: a.published,
      dateModified: a.updated,
      inLanguage: "vi",
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "Play4Fun", url: SITE_URL },
      publisher: { "@type": "Organization", name: "Play4Fun", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL + "/" },
        { "@type": "ListItem", position: 2, name: "Cẩm nang", item: `${SITE_URL}/cam-nang` },
        { "@type": "ListItem", position: 3, name: a.title, item: url },
      ],
    },
    ...(a.faq?.length ? [faqJsonLd(a.faq)] : []),
  ];

  return (
    <div className="container-page pt-4 sm:pt-8">
      <JsonLd data={ld} />
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="shrink-0 hover:text-fg">
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <Link href="/cam-nang" className="shrink-0 hover:text-fg">
          Cẩm nang
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate text-fg">{a.kicker}</span>
      </nav>

      <article className="mx-auto mt-5 max-w-[720px] sm:mt-8">
        <header>
          <span className="text-xs font-semibold tracking-wide text-brand uppercase">{a.kicker}</span>
          <h1 className="mt-2 text-[1.85rem] leading-tight font-extrabold tracking-tight text-balance sm:text-[2.6rem]">{a.title}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span>Play4Fun</span>
            <span aria-hidden="true">·</span>
            <time dateTime={a.updated}>Cập nhật {formatDate(a.updated)}</time>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {a.readMinutes} phút đọc
            </span>
          </p>
        </header>

        <div className="article mt-6 sm:mt-8">
          <Body />
        </div>

        {a.faq && a.faq.length > 0 && <FaqSection faq={a.faq} />}

        <section aria-labelledby="choi-thu" className="mt-12 rounded-3xl border border-line bg-surface-2/60 p-5 sm:p-6">
          <h2 id="choi-thu" className="text-lg font-extrabold tracking-tight">
            Thử ngay, miễn phí
          </h2>
          <div className="mt-4 space-y-3">
            {a.games.map((g) => (
              <PlayCta key={g} slug={g} />
            ))}
          </div>
        </section>
      </article>

      <section aria-labelledby="bai-khac" className="mt-14 sm:mt-20">
        <h2 id="bai-khac" className="mb-4 text-xl font-extrabold tracking-tight sm:mb-6 sm:text-2xl">
          Đọc thêm
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {more.map((x) => (
            <ArticleCard key={x.slug} article={x} />
          ))}
        </div>
      </section>
    </div>
  );
}
