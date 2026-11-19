import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GAMES, TYPE_META, getGame } from "@/lib/games";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = getGame((await params).slug);
  if (!game) return {};
  return { title: game.title, description: game.tagline };
}

export default async function GamePage({ params }: Props) {
  const game = getGame((await params).slug);
  if (!game) notFound();
  const meta = TYPE_META[game.type];

  return (
    <article className="space-y-6">
      <Link href="/" className="text-sm text-brand hover:underline">
        ← Tất cả game
      </Link>
      <header>
        <span className="text-sm text-slate-500">{meta.label}</span>
        <h1 className="text-3xl font-extrabold">{game.title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{game.tagline}</p>
      </header>
      <div className="grid aspect-video place-items-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 dark:border-slate-700">
        Game đang được phát triển — quay lại sớm nhé!
      </div>
    </article>
  );
}
