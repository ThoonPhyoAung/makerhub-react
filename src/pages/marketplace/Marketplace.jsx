import { useState } from "react";
import { Loader2 } from "lucide-react";
import MarketplaceHero from "./MarketplaceHero";
import MarketplaceCategoryNav from "./MarketplaceCategoryNav";
import MarketplaceGrid from "./MarketplaceItems";

function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("all");
  
  return (
    <div>
      <MarketplaceHero />

      <MarketplaceCategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <MarketplaceGrid activeCategory={activeCategory} />
    </div>
  );
}

export default Marketplace;
