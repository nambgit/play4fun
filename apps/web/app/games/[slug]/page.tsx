import { ArrowLeft, Bell, ChevronRight, Clock, Tag, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardRail } from "@/components/card-rail";
import { GameCover } from "@/components/game-cover";
import { GameStage } from "@/components/game-stage";
import { AdSlot } from "@/components/ad-slot";
import { FaqSection, faqJsonLd } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { LeaderboardCard } from "@/components/leaderboard-card";
import { CATEGORY_SEO, SITE_URL, gameSeo } from "@/lib/seo";
import { RECORDS } from "@/lib/record-keys";
import { AUDIENCE_LABEL, GAMES, TYPE_META, getGame, relatedGames, shareImage } from "@/lib/games";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = getGame((await params).slug);
  if (!game) return {};
  const image = shareImage(game);
  const seo = gameSeo(game);
  const images = image ? [{ url: image, width: 1200, height: 750, alt: game.title }] : undefined;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/games/${game.slug}` },
    openGraph: {
      title: `${seo.title} | Play4Fun`,
      description: seo.description,
      url: `/games/${game.slug}`,
      // Preview image when the link is shared on Facebook/Zalo (resolved against metadataBase)
      images,
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: image ? [image] : undefined },
  };
}

export default async function GamePage({ params }: Props) {
  const game = getGame((await params).slug);
  if (!game) notFound();
  const meta = TYPE_META[game.type];
  const related = relatedGames(game);
  const seo = gameSeo(game);
  const category = CATEGORY_SEO[game.type];
  const url = `${SITE_URL}/games/${game.slug}`;
  const image = shareImage(game);
  const [minPlayers, maxPlayers] = (game.players.match(/\d+/g) ?? ["1"]).map(Number);
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": game.type === "quiz" ? "Quiz" : "VideoGame",
      name: game.title,
      alternateName: seo.title,
      description: seo.description,
      url,
      image: image ? SITE_URL + image : undefined,
      inLanguage: "vi",
      isAccessibleForFree: true,
      ...(game.type === "quiz"
        ? { educationalUse: "Trắc nghiệm vui", timeRequired: "PT3M" }
        : {
            genre: seo.genre,
            gamePlatform: ["Trình duyệt web", "Điện thoại", "Máy tính"],
            applicationCategory: "Game",
            operatingSystem: "Mọi hệ điều hành có trình duyệt",
            playMode: game.type === "party" ? "MultiPlayer" : "SinglePlayer",
            numberOfPlayers: { "@type": "QuantitativeValue", minValue: minPlayers, maxValue: maxPlayers ?? minPlayers },
            offers: { "@type": "Offer", price: 0, priceCurrency: "VND", availability: "https://schema.org/InStock" },
          }),
      publisher: { "@type": "Organization", name: "Play4Fun", url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL + "/" },
        { "@type": "ListItem", position: 2, name: meta.label, item: SITE_URL + category.path },
        { "@type": "ListItem", position: 3, name: game.title, item: url },
      ],
    },
    ...(seo.faq.length ? [faqJsonLd(seo.faq)] : []),
  ];

  const facts = [
    { icon: Clock, label: "Thời lượng", value: game.duration },
    { icon: Users, label: "Người chơi", value: game.players },
    { icon: Tag, label: "Dành cho", value: game.audience.map((a) => AUDIENCE_LABEL[a]).join(", ") },
  ];

  return (
    <div className="container-page pt-4 sm:pt-8">
      <JsonLd data={ld} />
      {/* Mobile: one back link; larger screens: full breadcrumb */}
      <Link href={category.path} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg sm:hidden">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Tất cả game {meta.label.toLowerCase()}
      </Link>
      <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm text-muted sm:flex">
        <Link href="/" className="hover:text-fg">
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <Link href={category.path} className="hover:text-fg">
          {meta.label}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="truncate text-fg">{game.title}</span>
      </nav>

      {/* Title row */}
      <header className="mt-3 flex flex-col gap-3 sm:mt-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div className="min-w-0">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.soft} ${meta.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
          <h1 className="mt-2 text-2xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl">{game.title}</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-pretty text-muted sm:text-base">{game.tagline}</p>
        </div>
        <ul className="flex flex-wrap gap-2 lg:shrink-0 lg:justify-end" aria-label="Thông tin game">
          {facts.map((f) => (
            <li key={f.label} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium sm:text-sm" title={f.label}>
              <f.icon className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
              <span className="sr-only">{f.label}: </span>
              {f.value}
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-4 grid gap-6 sm:mt-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        {/* Stage */}
        {game.status === "live" ? (
          <GameStage slug={game.slug} />
        ) : (
          <div className="self-start overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
            <div className="relative">
              <GameCover game={game} size="lg" />
              <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/45 to-transparent p-4 pt-16 sm:p-6 sm:pt-20">
                <div className="flex items-center gap-3 rounded-2xl bg-surface/95 px-5 py-3 shadow-lift backdrop-blur">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:hidden" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
                  </span>
                  <p className="text-sm">
                    <span className="font-semibold">Game đang được hoàn thiện.</span>{" "}
                    <span className="hidden text-muted sm:inline">Theo dõi fanpage để chơi ngay khi lên sóng.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About & rules — sticks beside the game on large screens */}
        <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-20">
          <section className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
            <h2 className="text-sm font-semibold">Giới thiệu</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{game.description}</p>

            {game.howTo ? (
              <div className="mt-5 border-t border-line pt-5">
                <h2 className="text-sm font-semibold">Cách chơi</h2>
                <ol className="mt-3 space-y-2.5">
                  {game.howTo.map((rule, i) => (
                    <li key={rule} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-[11px] font-bold text-brand">{i + 1}</span>
                      {rule}
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <button type="button" disabled className="btn-primary mt-6 w-full cursor-not-allowed opacity-60">
                <Bell className="h-4 w-4" aria-hidden="true" />
                Sắp ra mắt
              </button>
            )}
          </section>

          {game.status === "live" && RECORDS.some((r) => r.slug === game.slug && r.kind === "best") && <LeaderboardCard slug={game.slug} />}
          <AdSlot placement="sidebar" />

          <Link href="/" className="hidden items-center gap-2 text-sm font-medium text-muted hover:text-fg lg:inline-flex">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Xem tất cả game
          </Link>
        </aside>
      </div>

      <FaqSection faq={seo.faq} title={`Hỏi đáp về ${game.title}`} />

      {related.length > 0 && (
        <section aria-labelledby="lien-quan" className="mt-14 sm:mt-20">
          <h2 id="lien-quan" className="mb-4 text-xl font-extrabold tracking-tight sm:mb-6 sm:text-2xl">
            Cùng thể loại {meta.label.toLowerCase()}
          </h2>
          <CardRail games={related} label={`Cùng thể loại ${meta.label.toLowerCase()}`} />
        </section>
      )}
    </div>
  );
}
