import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection, faqJsonLd } from "@/components/faq-section";
import { GameCard } from "@/components/game-card";
import { JsonLd } from "@/components/json-ld";
import { GAMES, GAME_TYPES, TYPE_META, type GameType } from "@/lib/games";
import { CATEGORY_SEO, SITE_URL, gameSeo } from "@/lib/seo";

/** Landing page for one category (/giai-lao, /test-vui, /choi-nhom): what people search for, then the games */

export function categoryMetadata(type: GameType): Metadata {
  const c = CATEGORY_SEO[type];
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: c.path },
    openGraph: { title: `${c.title} | Play4Fun`, description: c.description, url: c.path },
  };
}

export function CategoryPage({ type }: { type: GameType }) {
  const c = CATEGORY_SEO[type];
  const meta = TYPE_META[type];
  const games = GAMES.filter((g) => g.type === type && g.status === "live");
  const others = GAME_TYPES.filter((t) => t !== type);

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: c.h1,
      description: c.description,
      url: SITE_URL + c.path,
      inLanguage: "vi",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: games.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/games/${g.slug}`, name: gameSeo(g).title })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL + "/" },
        { "@type": "ListItem", position: 2, name: meta.label, item: SITE_URL + c.path },
      ],
    },
    faqJsonLd(c.faq),
  ];

  return (
    <div className="container-page pt-4 sm:pt-8">
      <JsonLd data={ld} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-fg">
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-fg">{meta.label}</span>
      </nav>

      <header className="mt-4 max-w-3xl sm:mt-6">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.soft} ${meta.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          {games.length} game · miễn phí
        </span>
        <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">{c.h1}</h1>
        {c.intro.map((p) => (
          <p key={p} className="mt-3 text-base leading-relaxed text-pretty text-muted sm:text-lg">
            {p}
          </p>
        ))}
      </header>

      <section aria-label={`Danh sách ${meta.heading.toLowerCase()}`} className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {games.map((g) => (
          <GameCard key={g.slug} game={g} />
        ))}
      </section>

      <FaqSection faq={c.faq} />

      <section aria-labelledby="the-loai-khac" className="mt-14 sm:mt-20">
        <h2 id="the-loai-khac" className="mb-4 text-xl font-extrabold tracking-tight sm:text-2xl">
          Thể loại khác
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {others.map((t) => (
            <Link
              key={t}
              href={CATEGORY_SEO[t].path}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card transition-colors hover:border-brand/40"
            >
              <span>
                <span className="block font-bold">{CATEGORY_SEO[t].h1}</span>
                <span className="mt-1 block text-sm text-muted">{TYPE_META[t].blurb}</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
