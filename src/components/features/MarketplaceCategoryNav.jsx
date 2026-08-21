import { marketplaceCategories } from "../../data/marketplaceCategories";

// Original: .cat-btn-active { background-color: var(--neon-green); color: #000; font-weight: bold; }
// Community page ရဲ့ category nav (white text) နဲ့ မတူဘူး — Marketplace က
// dark text on green pill ဖြစ်တယ်.
function MarketplaceCategoryNav({ activeCategory, onCategoryChange }) {
  return (
    <nav className="sticky top-[64px] z-30 py-2 bg-bg-elevated border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div
          className="flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {marketplaceCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
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
      </div>
    </nav>
  );
}

export default MarketplaceCategoryNav;
