import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MarketplaceHero from "./MarketplaceHero";
import MarketplaceCategoryNav from "./MarketplaceCategoryNav";
import MarketplaceGrid from "./MarketplaceItems";
// API & Hooks
import { useFetch } from "../../hooks/useFetch";
import { getMarketplaceItems } from "../../api/marketplaceApi";

function Marketplace() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); //Search Input Bar ထဲမှာ ပေါ်နေမယ့် စာသား

  const { data: items } = useFetch(getMarketplaceItems);
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    if (items) {
      setItemList(items);
    }
  }, [items]);

  // Community Post ကနေ ရောက်လာရင် state ထဲက initialSearch ကို ယူပြီး Search Bar ထဲ ထည့်မည်
  useEffect(() => {
    if (location.state?.initialSearch) {
      setSearchQuery(location.state.initialSearch);

      // (Optional) စာမျက်နှာကို Refresh ပြန်လုပ်ရင် မူလအတိုင်း ပြန်ဖြစ်အောင် history state ကို clean ပြန်လုပ်ထားနိုင်ပါတယ်
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Date အလိုက် Sorting ပြုလုပ်ပြီး နောက်ဆုံး ၃ ခုကို ယူခြင်း
  const latestThreeItems = itemList.length
    ? [...itemList]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
    : [];

  // Category switch လုပ်သည့်အခါ Search Bar ကို Clear လုပ်ပေးမည်
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchQuery(""); // Nav tab နှိပ်လိုက်ရင် search bar ပါ တန်းပြီး clear ဖြစ်သွားမယ်
  };

  return (
    <div>
      {/* Latest Items 3 ခုကို Hero Component ထံ Prop အဖြစ် လွှဲပေးမည် */}
      <MarketplaceHero items={latestThreeItems} />

      {/* Pass searchQuery and onSearchChange props */}
      <MarketplaceCategoryNav
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
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
