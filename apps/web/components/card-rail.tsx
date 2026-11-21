"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GameEntry } from "@/lib/games";
import { GameCard } from "./game-card";

/**
 * Game cards in a horizontal rail.
 *
 * - default: swipes on phones (snap, next card peeking in), regular grid from `sm` up.
 * - `paged`: also scrolls sideways on larger screens, two rows at a time (2 columns on
 *   tablets, 3 on desktop → 6 cards in view); the rest is one swipe / arrow click away.
 */
export function CardRail({ games, label, paged = false }: { games: GameEntry[]; label?: string; paged?: boolean }) {
  if (!paged) {
    return (
      <ul
        aria-label={label}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-1 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
      >
        {games.map((g) => (
          <li key={g.slug} className="w-[80%] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none">
            <GameCard game={g} />
          </li>
        ))}
      </ul>
    );
  }
  return <PagedRail games={games} label={label} />;
}

const AUTOPLAY_MS = 3500;

function PagedRail({ games, label }: { games: GameEntry[]; label?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, games]);

  const page = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth, behavior: "smooth" });

  // ---------------------------------------------------------------- autoplay
  // Slides one column every AUTOPLAY_MS and loops. Pauses while hovered, touched, focused,
  // off screen or in a hidden tab; never runs with prefers-reduced-motion.
  const paused = useRef({ hover: false, focus: false, offscreen: true, until: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (paused.current.offscreen = !e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const id = window.setInterval(() => {
      const p = paused.current;
      if (p.hover || p.focus || p.offscreen || document.hidden || Date.now() < p.until) return;
      if (el.scrollWidth <= el.clientWidth + 4) return; // everything already in view
      const items = el.querySelectorAll("li");
      // one column: distance between the first and the next card in another column
      const first = items[0] as HTMLElement | undefined;
      const next = [...items].find((li) => (li as HTMLElement).offsetLeft > (first?.offsetLeft ?? 0) + 4) as HTMLElement | undefined;
      const step = first && next ? next.offsetLeft - first.offsetLeft : el.clientWidth;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, AUTOPLAY_MS);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [games]);
  /** After the visitor touches or clicks the rail, leave it alone for a while */
  const hold = () => (paused.current.until = Date.now() + 8000);

  return (
    <div
      className="group/rail relative"
      onMouseEnter={() => (paused.current.hover = true)}
      onMouseLeave={() => (paused.current.hover = false)}
      onFocus={() => (paused.current.focus = true)}
      onBlur={() => (paused.current.focus = false)}
      onPointerDown={hold}
      onWheel={hold}
    >
      <ul
        ref={ref}
        aria-label={label}
        onScroll={measure}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-1 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:auto-cols-[calc((100%-1.25rem)/2)] sm:grid-flow-col sm:grid-rows-2 sm:gap-5 sm:scroll-px-0 sm:px-0 lg:auto-cols-[calc((100%-2.5rem)/3)] [&::-webkit-scrollbar]:hidden"
      >
        {games.map((g) => (
          <li key={g.slug} className="w-[80%] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none">
            <GameCard game={g} />
          </li>
        ))}
      </ul>
      {/* Arrows (tablet / desktop): only when there is more to see in that direction */}
      {(
        [
          [-1, edges.start, "left-0 -translate-x-1/2", ChevronLeft, "Xem các game trước"],
          [1, edges.end, "right-0 translate-x-1/2", ChevronRight, "Xem thêm game"],
        ] as const
      ).map(([dir, hidden, pos, Icon, text]) => (
        <button
          key={dir}
          type="button"
          onClick={() => page(dir)}
          aria-label={text}
          tabIndex={hidden ? -1 : 0}
          className={`absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-fg shadow-lift transition-opacity hover:border-brand/40 hover:text-brand sm:grid ${pos} ${
            hidden ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
