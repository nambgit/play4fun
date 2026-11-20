"use client";

import { Briefcase, Gamepad2, GraduationCap, LayoutGrid, Users, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { AUDIENCES, AUDIENCE_LABEL, GAMES, GAME_TYPES, TYPE_META, type Audience } from "@/lib/games";
import { ChevronRight } from "lucide-react";
import { CardRail } from "../card-rail";

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div>
          <p className="eyebrow">Thư viện game</p>
          <h2 id="kham-pha" className="mt-1.5 text-2xl font-extrabold tracking-tight sm:mt-2 sm:text-4xl">
            Hôm nay chơi gì?
          </h2>
        </div>

        <div role="group" aria-label="Lọc theo đối tượng" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
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

      <div className="mt-8 space-y-12 sm:mt-12 sm:space-y-16">
        {GAME_TYPES.map((type) => {
          const games = visible.filter((g) => g.type === type);
          if (games.length === 0) return null;
          const meta = TYPE_META[type];
          return (
            <div key={type} id={meta.anchor} className="scroll-mt-24">
              <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:h-11 sm:w-11 ${meta.soft}`}>
                  <span className={`h-3 w-3 rounded-full ${meta.dot}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold tracking-tight sm:text-xl">{meta.heading}</h3>
                  <p className="text-sm text-muted">{meta.blurb}</p>
                </div>
                {games.length > 1 && (
                  <span className="inline-flex shrink-0 items-center text-xs font-medium text-muted sm:hidden" aria-hidden="true">
                    Vuốt
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <CardRail games={games} label={meta.heading} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
