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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnam.variable}>
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
