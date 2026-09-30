import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Zap, CheckCircle2, Globe } from "lucide-react";

function LearningBreadcrumb({
  items = [],
  xp = 0,
  isCompleted = false,
  language = "en",
  onToggleLanguage,
  isPro = localStorage.getItem("userMode") === "pro" || false,
}) {
  if (!items.length) return null;

  return (
    <div className="sticky top-[64px] z-30 w-full bg-[#1C2128] border-b border-white/10 py-2.5">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-4 text-xs">
        {/* 📍 ဘယ်ဘက်ခြမ်း: Breadcrumb Links */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <div key={index} className="flex items-center gap-1.5 shrink-0">
                {index > 0 && (
                  <ChevronRight size={13} className="text-gray-600 shrink-0" />
                )}

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

        {/* 🚀 ညာဘက်ခြမ်း: XP, Completed Badge & Language Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Pro မဟုတ်မှသာ XP နဲ့ Completed Badge များကို ပြမည် */}
          {!isPro && (
            <>
              {/* XP Badge */}
              {xp > 0 && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[11px]">
                  <Zap size={11} className="fill-amber-400" /> +{xp} XP
                </span>
              )}

              {/* Completed Badge */}
              {isCompleted && (
                <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                  <CheckCircle2 size={11} /> Completed
                </span>
              )}
            </>
          )}

          {/* Language Toggle Button (Pro ရော Normal ပါ မြင်ရမည်) */}
          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-semibold text-[11px] hover:bg-white/10 transition-colors"
            >
              <Globe size={11} />
              {language === "en" ? "မြန်မာ" : "English"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LearningBreadcrumb;
