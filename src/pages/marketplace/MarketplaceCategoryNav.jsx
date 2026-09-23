import { Search, X } from "lucide-react";
import { marketplaceCategories } from "../../data/marketplaceCategories";

// Original: .cat-btn-active { background-color: var(--neon-green); color: #000; font-weight: bold; }
// Community page ရဲ့ category nav (white text) နဲ့ မတူဘူး — Marketplace က
// dark text on green pill ဖြစ်တယ်.
function MarketplaceCategoryNav({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) {
  // Reusable Search Box Component
  const renderSearchInput = () => (
    <div className="relative w-full">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search items, components..."
        className="w-full bg-surface border border-border rounded-full pl-9 pr-8 py-1.5 text-xs sm:text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary/60 transition-all"
      />
      {searchQuery && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-0.5"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* 1. Category & Search Nav */}
      <nav className="sticky top-[64px] z-40 py-2.5 bg-bg-elevated border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Category Buttons List */}
          <div
            className="flex gap-2 overflow-x-auto w-full md:w-auto py-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {marketplaceCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryChange(cat.id);
                    onSearchChange(""); // Category ပြောင်းတာနဲ့ Search Bar ကို Clear ပြုလုပ်ပေးမည်
                  }}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary text-black font-bold"
                      : "bg-transparent text-text-muted hover:text-text border border-border"
                  }`}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box (Desktop Only) */}
          <div className="hidden md:block w-64 shrink-0">
            {renderSearchInput()}
          </div>
        </div>
      </nav>

      {/* 2. Mobile Only Search Bar (Under Category Nav with Different BG) */}
      <nav className="sticky top-[112px] z-20 py-2 bg-bg border-b border-border block md:hidden">
        <div className="max-w-7xl mx-auto px-4">{renderSearchInput()}</div>
      </nav>
    </>
  );
}

export default MarketplaceCategoryNav;
