import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = process.env.PUBLIC_URL ?? "https://play4fun.io.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Play4Fun – Chơi 5 phút, xả stress cả ngày", template: "%s | Play4Fun" },
  description:
    "Mini-game giải lao, test vui và game chơi nhóm ngay trên trình duyệt. Không cần cài đặt, chơi được trên điện thoại.",
  openGraph: { siteName: "Play4Fun", locale: "vi_VN", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#7c3aed" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-dvh">
        <header className="border-b border-slate-200 dark:border-slate-800">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-xl font-extrabold text-brand">
              Play4Fun
            </Link>
            <span className="text-sm text-slate-500">Chơi 5 phút, xả stress cả ngày</span>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500">© {new Date().getFullYear()} play4fun.io.vn</footer>
      </body>
    </html>
  );
}
