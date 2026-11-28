import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { GAMES, GAME_TYPES, TYPE_META } from "@/lib/games";
import { categoryHref } from "@/lib/seo";
import { SOCIAL } from "@/lib/site";
import { InstallButton } from "./install-app";
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

const SOCIAL_LINKS = [
  { href: SOCIAL.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: SOCIAL.tiktok, label: "TikTok", Icon: TikTokIcon },
].filter((s) => s.href);

const EXPLORE = [
  { href: "/daily", label: "Thử thách hôm nay" },
  { href: "/leaderboard", label: "Bảng xếp hạng" },
  { href: "/cam-nang", label: "Cẩm nang" },
  { href: "/studio", label: "Studio câu hỏi" },
];

const PERKS = ["Miễn phí", "Không cần cài đặt", "Chơi trên điện thoại"];

const linkClass = "text-[13px] leading-snug text-muted transition-colors hover:text-fg sm:text-sm";

function Column({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">
        {href ? (
          <Link href={href} className="group inline-flex items-center gap-1 hover:text-brand">
            {title}
            <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
          </Link>
        ) : (
          title
        )}
      </h3>
      <ul className="mt-3 space-y-2.5 sm:mt-4">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface sm:mt-24">
      <div className="container-page grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,3fr)] lg:gap-14">
        {/* Brand */}
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Play4Fun – Trang chủ">
            <LogoMark />
            <span className="text-lg font-extrabold tracking-tight">
              Play<span className="text-brand">4</span>Fun
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted">Mini-game giải lao, test vui và game chơi nhóm ngay trên trình duyệt. Chơi 5 phút, xả stress cả ngày.</p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-muted">
            {PERKS.map((p) => (
              <li key={p} className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-party" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-4 empty:hidden">
            <InstallButton className="btn-ghost h-10 px-4 text-sm" label="Cài play4fun lên màn hình chính" />
          </div>
          {SOCIAL_LINKS.length > 0 && (
            <div className="mt-5 flex gap-2">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-brand/40 hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Links: 2 columns on phones, 4 on desktop */}
        <nav aria-label="Liên kết cuối trang" className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4 sm:gap-x-8">
          {GAME_TYPES.map((t) => (
            <Column key={t} title={TYPE_META[t].label} href={categoryHref(t)}>
              {GAMES.filter((g) => g.type === t && g.status === "live").map((g) => (
                <li key={g.slug}>
                  <Link href={`/games/${g.slug}`} className={linkClass}>
                    {g.title}
                  </Link>
                </li>
              ))}
            </Column>
          ))}
          <Column title="Khám phá">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} play4fun.io.vn · Mọi game đều miễn phí</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-fg">
              Quyền riêng tư
            </Link>
            <span>Làm tại Việt Nam với ☕ và rất nhiều deadline</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
