import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function LearningBreadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="sticky top-[64px] z-30 w-full bg-[#1C2128] border-b border-white/10 py-2.5">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-1.5 text-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={index} className="flex items-center gap-1.5">
              {/* ၁ ထက်ကြီးတဲ့ Item တိုင်းရဲ့ ရှေ့မှာ မြှားပြမည် */}
              {index > 0 && (
                <ChevronRight size={13} className="text-gray-600 shrink-0" />
              )}

              {/* Path ပါပြီး နောက်ဆုံးမဟုတျရင် Link၊ နောက်ဆုံးဆိုရင် ရိုးရိုး Text */}
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-white font-semibold">{item.label}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LearningBreadcrumb;
