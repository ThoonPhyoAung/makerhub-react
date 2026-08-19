import HeroSection from "../components/features/HeroSection";
import StatsRibbon from "../components/features/StatsRibbon";
import JourneySection from "../components/features/JourneySection";
import HowItWorks from "../components/features/HowItWorks";
import CommunityShowcase from "../components/features/CommunityShowcase";
import MarketplacePreview from "../components/features/MarketplacePreview";
import Newsletter from "../components/features/Newsletter";

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
