import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import { RecordSync } from "@/components/auth/record-sync";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const siteUrl = process.env.PUBLIC_URL ?? "https://play4fun.io.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Play4Fun – Game online miễn phí: giải lao, trắc nghiệm, chơi nhóm", template: "%s | Play4Fun" },
  description:
    "Game online miễn phí trên trình duyệt: gõ phím tiếng Việt, tính nhẩm, trắc nghiệm tính cách, Ai là gián điệp, vẽ đoán chữ, đố vui team building. Không cần cài.",
  applicationName: "Play4Fun",
  openGraph: { siteName: "Play4Fun", locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a12" },
  ],
};

/** Runs before first paint: apply the visitor's saved light/dark choice (no flash of the other theme) */
const THEME_SCRIPT = `try{var t=localStorage.getItem("p4f:theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set by THEME_SCRIPT before React loads
    <html lang="vi" className={beVietnam.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col font-sans">
        <a
          href="#noi-dung"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-brand-solid focus:px-4 focus:py-2 focus:text-brand-ink"
        >
          Bỏ qua tới nội dung
        </a>
        <SiteHeader />
        <main id="noi-dung" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <RecordSync />
        {/* Self-hosted, cookie-free analytics (Umami) via our own /stats proxy; empty script when not configured */}
        <Script src="/stats/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
