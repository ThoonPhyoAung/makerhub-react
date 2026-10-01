import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Zap, CheckCircle2, Globe, ArrowLeft } from "lucide-react";

function LearningBreadcrumb({
  items = [],
  xp = 0,
  isCompleted = false,
  language = "en",
  onToggleLanguage,
  isPro = localStorage.getItem("userMode") === "pro" || false,
}) {
  const navigate = useNavigate();
  if (!items.length) return null;

  const parentItem = items.length > 1 ? items[items.length - 2] : null;

  return (
    <div className="sticky top-[56px] sm:top-[64px] z-30 w-full bg-[#1C2128] border-b border-white/10 py-2 sm:py-2.5">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-2 text-xs">
        
        {/* 📱 1. MOBILE ONLY: Back Button */}
        <div className="flex md:hidden items-center min-w-0">
          {parentItem?.path ? (
            <Link
              to={parentItem.path}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white font-medium py-1 text-xs"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white font-medium py-1 text-xs"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* 💻 2. DESKTOP ONLY: Full Path */}
        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto py-0.5">
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

        {/* 🚀 3. EVERY SCREEN (XP, Completed & Language Toggle) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!isPro && (
            <>
              {/* XP Badge */}
              {xp > 0 && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px] sm:text-[11px]">
                  <Zap size={11} className="fill-amber-400" /> +{xp} XP
                </span>
              )}

              {/* Completed Badge (Mobile, Tablet, Desktop အားလုံးမှာ ပေါ်မည်) */}
              {isCompleted && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] sm:text-[11px]">
                  <CheckCircle2 size={11} /> Completed
                </span>
              )}
            </>
          )}

          {/* Language Toggle Button */}
          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-semibold text-[10px] sm:text-[11px] hover:bg-white/10 transition-colors"
            >
              <Globe size={11} />
              <span>{language === "en" ? "မြန်မာ" : "English"}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default LearningBreadcrumb;