import { useState } from "react";
import { Loader2 } from "lucide-react";
import MarketplaceHero from "./MarketplaceHero";
import MarketplaceCategoryNav from "./MarketplaceCategoryNav";

function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("All");

  // TODO: Firebase ချိတ်ပြီးရင် ဒီ Loading state ကို real item
  // data fetch (activeCategory နဲ့ filter) နဲ့ အစားထိုးမယ်.
  const isLoading = true;

  return (
    <div>
      <MarketplaceHero />

      <MarketplaceCategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-16">
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2
              size={32}
              className="mx-auto text-primary animate-spin mb-3"
            />
            <p className="text-text-muted">Loading items from marketplace...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
            {/* TODO: item data ရလာရင် MarketplaceCard တွေ .map() နဲ့ render မယ် */}
          </div>
        )}
      </main>
    </div>
  );
}

export default Marketplace;
