import { ArrowLeft, Bell, ChevronRight, Clock, Tag, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameCard } from "@/components/game-card";
import { GameCover } from "@/components/game-cover";
import { GameStage } from "@/components/game-stage";
import { AUDIENCE_LABEL, GAMES, TYPE_META, getGame, relatedGames } from "@/lib/games";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = getGame((await params).slug);
  if (!game) return {};
  return {
    title: game.title,
    description: game.tagline,
    openGraph: { title: `${game.title} | Play4Fun`, description: game.tagline },
  };
}

export default async function GamePage({ params }: Props) {
  const game = getGame((await params).slug);
  if (!game) notFound();
  const meta = TYPE_META[game.type];
  const related = relatedGames(game);

  const facts = [
    { icon: Clock, label: "Thời lượng", value: game.duration },
    { icon: Users, label: "Người chơi", value: game.players },
    { icon: Tag, label: "Dành cho", value: game.audience.map((a) => AUDIENCE_LABEL[a]).join(", ") },
  ];

  return (
    <div className="container-page pt-8 md:pt-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-fg">
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <Link href={`/#${meta.anchor}`} className="hover:text-fg">
          {meta.label}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="truncate text-fg">{game.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Stage */}
        {game.status === "live" ? (
          <div className="self-start rounded-3xl bg-[#0b0a12] p-2 shadow-lift sm:p-4">
            <GameStage slug={game.slug} />
          </div>
        ) : (
        <div className="self-start overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
          <div className="relative">
            <GameCover game={game} size="lg" />
            {game.status === "soon" && (
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
            )}
          </div>
        </div>
        )}

        {/* Info panel */}
        <aside className="flex flex-col gap-5">
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-card">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.soft} ${meta.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{game.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">{game.description}</p>

            <dl className="mt-6 divide-y divide-line border-y border-line">
              {facts.map((f) => (
                <div key={f.label} className="flex items-center gap-3 py-3 text-sm">
                  <f.icon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  <dt className="whitespace-nowrap text-muted">{f.label}</dt>
                  <dd className="ml-auto text-right font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>

            {game.howTo ? (
              <div className="mt-6">
                <h2 className="text-sm font-semibold">Cách chơi</h2>
                <ol className="mt-3 space-y-2.5">
                  {game.howTo.map((rule, i) => (
                    <li key={rule} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-[11px] font-bold text-brand">
                        {i + 1}
                      </span>
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
          </div>

          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-fg">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Xem tất cả game
          </Link>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="lien-quan" className="mt-20">
          <h2 id="lien-quan" className="text-2xl font-extrabold tracking-tight">
            Cùng thể loại {meta.label.toLowerCase()}
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((g) => (
              <li key={g.slug}>
                <GameCard game={g} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
