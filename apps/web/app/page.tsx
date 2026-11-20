import { AdSlot } from "@/components/ad-slot";
import { DailyBanner } from "@/components/home/daily-banner";
import { GameBrowser } from "@/components/home/game-browser";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PartyBanner } from "@/components/home/party-banner";

export default function HomePage() {
  return (
    <>
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
