import { useState } from "react";
import { Loader2 } from "lucide-react";
import CommunityHero from "../components/features/CommunityHero";
import CommunityCategoryNav from "../components/features/CommunityCategoryNav";

function Community() {
  const [activeCategory, setActiveCategory] = useState("all");

  // TODO: Firebase ချိတ်ပြီးရင် ဒီ Loading state ကို real project
  // data fetch (activeCategory နဲ့ filter) နဲ့ အစားထိုးမယ်.
  const isLoading = true;

  return (
    <div>
      <CommunityHero />

      <CommunityCategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div
        className="max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-16"
        id="projectsSection"
      >
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2
              size={32}
              className="mx-auto text-primary animate-spin mb-3"
            />
            <p className="text-text-muted">Loading project details...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TODO: project data ရလာရင် ProjectCard တွေ .map() နဲ့ render မယ် */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;
