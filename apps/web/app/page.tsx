import Link from "next/link";
import { GAMES, TYPE_META, type GameType } from "@/lib/games";

const SECTIONS: GameType[] = ["arcade", "quiz", "party"];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-brand px-6 py-10 text-white">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Chơi 5 phút, xả stress cả ngày</h1>
        <p className="mt-3 max-w-xl text-white/85">
          Mini-game giải lao, test tính cách và game chơi nhóm cho dân văn phòng, học sinh và gamer. Không cần cài
          đặt, không cần đăng ký.
        </p>
      </section>

      {SECTIONS.map((type) => {
        const meta = TYPE_META[type];
        const games = GAMES.filter((g) => g.type === type);
        return (
          <section key={type} className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{meta.label}</h2>
              <p className="text-slate-500">{meta.blurb}</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {games.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/games/${g.slug}`}
                    className="block h-full rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${meta.color}`} />
                      <span className="text-xs uppercase tracking-wide text-slate-500">{g.audience.join(" · ")}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">{g.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{g.tagline}</p>
                    {g.status === "soon" && (
                      <span className="mt-3 inline-block rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand">
                        Sắp ra mắt
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
