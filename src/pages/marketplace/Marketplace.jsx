import { useState } from "react";
import { Loader2 } from "lucide-react";
import MarketplaceHero from "./MarketplaceHero";
import MarketplaceCategoryNav from "./MarketplaceCategoryNav";
import MarketplaceGrid from "./MarketplaceItems";

function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <MarketplaceHero />

      {/* Pass searchQuery and onSearchChange props */}
      <MarketplaceCategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Pass searchQuery prop to grid */}
      <MarketplaceGrid
        activeCategory={activeCategory}
        searchQuery={searchQuery}
      />
    </div>
  );
}

export default Marketplace;
