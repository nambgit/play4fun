import type { Metadata } from "next";
import { AdSlot } from "@/components/ad-slot";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/seo";
import { DailyBanner } from "@/components/home/daily-banner";
import { GameBrowser } from "@/components/home/game-browser";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PartyBanner } from "@/components/home/party-banner";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const SITE_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Play4Fun",
    alternateName: "play4fun.io.vn",
    url: SITE_URL + "/",
    inLanguage: "vi",
    description: "Game online miễn phí trên trình duyệt: mini-game giải lao, trắc nghiệm tính cách và party game chơi nhóm.",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Play4Fun",
    url: SITE_URL + "/",
    logo: SITE_URL + "/icon.svg",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={SITE_LD} />
      <Hero />
      <div className="space-y-16 sm:space-y-24 md:space-y-28">
        <DailyBanner />
        <GameBrowser />
        <div className="container-page empty:hidden">
          <AdSlot placement="home" />
        </div>
        <PartyBanner />
        <HowItWorks />
      </div>
    </>
  );
}
