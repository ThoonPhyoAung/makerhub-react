import { useState } from "react";
import CommunityHero from "./CommunityHero";
import CommunityCategoryNav from "./CommunityCategoryNav";
import CommunityPosts from "./CommunityPosts";

function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div>
      <CommunityHero />
      <CommunityCategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <CommunityPosts activeCategory={activeCategory} />
    </div>
  );
}

export default CommunityPage;