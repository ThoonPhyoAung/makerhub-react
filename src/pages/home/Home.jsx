import HeroSection from "./HeroSection";
import StatsRibbon from "./StatsRibbon";
import JourneySection from "./JourneySection";
import HowItWorks from "./HowItWorks";
import CommunityShowcase from "./CommunityShowcase";
import MarketplacePreview from "./MarketplacePreview";
import Newsletter from "./Newsletter";

function Home() {
  return (
    <div>
      <HeroSection />
      <StatsRibbon />
      <JourneySection />
      <HowItWorks />
      <CommunityShowcase />
      <MarketplacePreview />
      <Newsletter />
    </div>
  );
}

export default Home;
