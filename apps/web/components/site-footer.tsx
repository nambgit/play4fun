import Link from "next/link";
import { GAMES, GAME_TYPES, TYPE_META } from "@/lib/games";
import { categoryHref } from "@/lib/seo";
import { LogoMark } from "./logo";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface sm:mt-24">
      <div className="container-page grid grid-cols-3 gap-x-4 gap-y-8 py-10 sm:py-14 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-10">
        <div className="col-span-3 max-w-xs md:col-span-1">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-lg font-extrabold tracking-tight">
              Play<span className="text-brand">4</span>Fun
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Mini-game giải lao, test vui và game chơi nhóm ngay trên trình duyệt. Chơi 5 phút, xả stress cả ngày.
          </p>
          <div className="mt-5 flex gap-2">
            {/* TODO: thay bằng link fanpage / kênh TikTok thật */}
            <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-brand/40 hover:text-brand">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="TikTok" className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-brand/40 hover:text-brand">
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {GAME_TYPES.map((t) => (
          <div key={t}>
            <h3 className="text-sm font-semibold">
              <Link href={categoryHref(t)} className="hover:text-brand">
                {TYPE_META[t].label}
              </Link>
            </h3>
            <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
              {GAMES.filter((g) => g.type === t)
                .slice(0, 5)
                .map((g) => (
                  <li key={g.slug}>
                    <Link href={`/games/${g.slug}`} className="text-[13px] leading-snug text-muted transition-colors hover:text-fg sm:text-sm">
                      {g.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} play4fun.io.vn — Mọi game đều miễn phí. ·{" "}
            <Link href="/cam-nang" className="hover:text-fg hover:underline">
              Cẩm nang
            </Link>{" "}
            ·{" "}
            <Link href="/privacy" className="hover:text-fg hover:underline">
              Quyền riêng tư
            </Link>
          </p>
          <p>Làm tại Việt Nam với ☕ và rất nhiều deadline.</p>
        </div>
      </div>
    </footer>
  );
}
