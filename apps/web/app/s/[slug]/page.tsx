import { Play } from "lucide-react";
import { GameImage } from "@/components/game-image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dayOf } from "@/lib/daily";
import { quizTypes } from "@/lib/quiz-types";
import { parseShare } from "@/lib/share";

/** Landing page for a shared result; its link preview shows the result image (/og/result) */

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

async function load({ params, searchParams }: Props) {
  const [{ slug }, raw] = await Promise.all([params, searchParams]);
  return parseShare(slug, raw, quizTypes);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const c = await load(props);
  if (!c) return {};
  const title = c.game.type === "quiz" ? `Mình là ${c.headline} — ${c.game.title}` : `Mình đạt ${c.headline} ${c.unit} ở ${c.game.title}`;
  const image = `/og/result?slug=${c.game.slug}&${c.query}`;
  return {
    title,
    description: c.subtitle,
    robots: { index: false },
    openGraph: { title, description: c.subtitle, images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description: c.subtitle, images: [image] },
  };
}

export default async function SharedResult(props: Props) {
  const c = await load(props);
  if (!c) notFound();
  const playHref = c.daily === dayOf() ? `/games/${c.game.slug}?daily=1` : `/games/${c.game.slug}`;
  const quiz = c.game.type === "quiz";

  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-8 sm:py-14">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
        <div className="relative p-6 text-white sm:p-8" style={{ backgroundImage: `linear-gradient(135deg, ${c.game.cover[0]}, ${c.game.cover[1]})` }}>
          <p className="text-sm font-semibold text-white/85">{c.game.title}</p>
          <p className="mt-3 text-sm text-white/85">{quiz ? "Bạn bè của bạn là" : "Bạn bè của bạn đạt"}</p>
          <p className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {quiz && c.quizEmoji ? `${c.quizEmoji} ` : ""}
            {c.headline}
            {!quiz && <span className="ml-2 text-xl font-bold text-white/85">{c.unit}</span>}
          </p>
          <p className="mt-3 text-white/90">{c.subtitle}</p>
        </div>
        {c.game.thumbnail && (
          <div className="relative aspect-[16/8] border-y border-line">
            <GameImage src={c.game.thumbnail} className="object-top" />
          </div>
        )}
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm text-muted">{quiz ? "Làm thử xem bạn thuộc kiểu nào nhé!" : "Chơi ngay trên trình duyệt, không cần cài đặt."}</p>
          <Link href={playHref} className="btn-primary px-6 py-3">
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            {quiz ? "Làm bài test" : "Thử vượt qua"}
          </Link>
        </div>
      </div>
    </div>
  );
}
