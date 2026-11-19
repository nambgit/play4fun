"use client";

import { Briefcase, Gamepad2, GraduationCap, LayoutGrid, Users, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { AUDIENCES, AUDIENCE_LABEL, GAMES, GAME_TYPES, TYPE_META, type Audience } from "@/lib/games";
import { GameCard } from "../game-card";

type Filter = Audience | "all";

const FILTER_ICON: Record<Filter, LucideIcon> = {
  all: LayoutGrid,
  office: Briefcase,
  student: GraduationCap,
  gamer: Gamepad2,
  group: Users,
};

export function GameBrowser() {
  const [filter, setFilter] = useState<Filter>("all");
  const filters: Filter[] = ["all", ...AUDIENCES];
  const visible = filter === "all" ? GAMES : GAMES.filter((g) => g.audience.includes(filter));

  return (
    <section aria-labelledby="kham-pha" className="container-page">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Thư viện game</p>
          <h2 id="kham-pha" className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hôm nay chơi gì?
          </h2>
        </div>

        <div role="group" aria-label="Lọc theo đối tượng" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
          {filters.map((f) => {
            const Icon = FILTER_ICON[f];
            const active = filter === f;
            const count = f === "all" ? GAMES.length : GAMES.filter((g) => g.audience.includes(f)).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-fg bg-fg text-bg"
                    : "border-line bg-surface text-muted hover:border-fg/30 hover:text-fg"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {f === "all" ? "Tất cả" : AUDIENCE_LABEL[f]}
                <span className={`text-xs ${active ? "text-bg/60" : "text-muted/70"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-12 space-y-16">
        {GAME_TYPES.map((type) => {
          const games = visible.filter((g) => g.type === type);
          if (games.length === 0) return null;
          const meta = TYPE_META[type];
          return (
            <div key={type} id={meta.anchor} className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-4">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${meta.soft}`}>
                  <span className={`h-3 w-3 rounded-full ${meta.dot}`} />
                </span>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{meta.heading}</h3>
                  <p className="text-sm text-muted">{meta.blurb}</p>
                </div>
              </div>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {games.map((g) => (
                  <li key={g.slug}>
                    <GameCard game={g} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
