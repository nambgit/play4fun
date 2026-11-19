import { GameBrowser } from "@/components/home/game-browser";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PartyBanner } from "@/components/home/party-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="space-y-24 md:space-y-32">
        <GameBrowser />
        <HowItWorks />
        <PartyBanner />
      </div>
    </>
  );
}
