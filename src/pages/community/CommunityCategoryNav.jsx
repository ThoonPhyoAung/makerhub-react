import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { communityCategories } from "../../data/communityCategories";

// Original vanilla JS ရဲ့ filterCategory(id, el) function ကို
// activeCategory useState တစ်ခုတည်းနဲ့ အစားထိုးထားတယ်.
// Real project grid ချိတ်တဲ့အခါ activeCategory ကို parent
// (Community.jsx) ဆီ prop အနေနဲ့ ပို့ပြီး filter လုပ်နိုင်တယ်.
function CommunityCategoryNav({ activeCategory, onCategoryChange }) {
  const trackRef = useRef(null);

  const scrollByAmount = (amount) => {
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div
      id="categoryNavBar"
      className="sticky top-[64px] z-30 bg-bg-elevated border-y border-border-muted"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center relative">
          <button
            onClick={() => scrollByAmount(-200)}
            aria-label="Scroll categories left"
            className="hidden md:flex shrink-0 w-9 h-9 rounded-full items-center justify-center bg-bg-elevated border border-border text-text hover:bg-surface hover:text-primary hover:border-border-accent transition-all mr-2"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={trackRef}
            className="flex flex-nowrap gap-6 md:gap-8 overflow-x-auto py-4 text-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {communityCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`shrink-0 min-w-[85px] md:min-w-[110px] flex flex-col items-center gap-1 pb-1.5 border-b-2 transition-colors ${
                    isActive
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-text-muted hover:text-primary"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-primary" : "text-text-subtle"}
                  />
                  <small className="text-[11px] md:text-xs whitespace-nowrap">
                    {cat.label}
                  </small>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollByAmount(200)}
            aria-label="Scroll categories right"
            className="hidden md:flex shrink-0 w-9 h-9 rounded-full items-center justify-center bg-bg-elevated border border-border text-text hover:bg-surface hover:text-primary hover:border-border-accent transition-all ml-2"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunityCategoryNav;
