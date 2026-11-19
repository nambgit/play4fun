import { Play } from "lucide-react";
import Link from "next/link";
import { GAME_TYPES, TYPE_META } from "@/lib/games";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

export const NAV_LINKS = GAME_TYPES.map((t) => ({ href: `/#${TYPE_META[t].anchor}`, label: TYPE_META[t].label, dot: TYPE_META[t].dot }));

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/65">
      <div className="container-page flex h-16 items-center gap-6">
        <Logo />

        <nav aria-label="Danh mục" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${l.dot}`} />
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/games/inbox-zero" className="btn-primary hidden px-4 py-2.5 sm:inline-flex">
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            Chơi ngay
          </Link>
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
