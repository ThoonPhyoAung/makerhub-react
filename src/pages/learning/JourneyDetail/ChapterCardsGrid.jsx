import React, { useState, useMemo } from "react";
import { Lock, Play, Check, Search, BookOpen, Clock } from "lucide-react";
import { boardIconMap, RenderIcon } from "../../../utils/iconMaps";

/**
 * ⭕ Circular Progress Circle Component
 * Primary Color အလိုက် အဝိုင်း Progress Bar အရောင် ပြောင်းသွားမည်
 */
function CircularProgress({ percentage = 0, color = "#f97316", size = 34 }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isCompleted = percentage >= 100;

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0 bg-transparent rounded-full"
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full -rotate-90 transform">
        {/* နောက်ခံ Track လိုင်း */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-white/10"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress လိုင်း (Primary Color သုံးထားသည်) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isCompleted ? "#22c55e" : color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {isCompleted ? (
          <Check size={11} strokeWidth={3.5} className="text-green-500" />
        ) : (
          <span className="text-[8px] font-bold text-white">{percentage}%</span>
        )}
      </div>
    </div>
  );
}

function ChapterCardsGrid({
  journey,
  chapters = [],
  primaryColor = "#10b981",
}) {
  // 🎛️ User Mode State ("learner" သို့မဟုတ် "pro")
  const [userMode, setUserMode] = useState("learner");
  // 🔎 Pro Mode အတွက် Search Input State
  const [searchQuery, setSearchQuery] = useState("");

  const isPro = userMode === "pro";

  // 🎨 Active Primary Color (Chapter or Journey or Prop Color)
  const activeColor = journey?.color || primaryColor;

  // 🔍 Pro Mode မှာ Chapter Title အလိုက် Real-time Search ပြုလုပ်ခြင်း
  const filteredChapters = useMemo(() => {
    if (!isPro || !searchQuery.trim()) return chapters;
    return chapters.filter((chapter) =>
      (chapter.title || "").toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [chapters, isPro, searchQuery]);

  return (
    <section className="relative w-full bg-[#0a0a0b] py-8 sm:py-12 px-3 sm:px-4 min-h-screen flex flex-col items-center">
      {/* 🎚️ Mode Switcher & Search Bar Header */}
      <div className="w-full max-w-6xl flex flex-col items-center gap-4 mb-8 z-20">
        {/* Mode Toggle Buttons - Dynamic Primary Color သုံးထားပါသည် */}
        <div className="flex bg-[#1a1d24] p-1.5 rounded-full border border-white/10">
          {/* Learner Button */}
          <button
            onClick={() => {
              setUserMode("learner");
              setSearchQuery(""); // Mode ပြောင်းလျှင် Search သန့်ရှင်းရန်
            }}
            className={`px-5 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all ${
              !isPro ? "text-black shadow-md" : "text-gray-400 hover:text-white"
            }`}
            style={{
              backgroundColor: !isPro ? activeColor : "transparent",
            }}
          >
            Learner Mode
          </button>

          {/* Pro Button (ယခု Primary Color သို့ ပြောင်းထားပါသည်) */}
          <button
            onClick={() => setUserMode("pro")}
            className={`px-5 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all ${
              isPro ? "text-black shadow-md" : "text-gray-400 hover:text-white"
            }`}
            style={{
              backgroundColor: isPro ? activeColor : "transparent",
            }}
          >
            Pro Mode
          </button>
        </div>

        {/* 🔎 Search Bar (Pro Mode ရောက်မှသာ ပေါ်မည်) */}
        {isPro && (
          <div className="relative w-full max-w-md animate-fadeIn">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search chapters by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#121418] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-all shadow-inner"
              style={{
                borderColor: `${activeColor}40`,
              }}
            />
          </div>
        )}
      </div>

      {/* 📱 Mobile Responsive Cards Grid */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 justify-items-center">
        {filteredChapters.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 text-xs sm:text-sm">
            No chapters found matching "{searchQuery}"
          </div>
        ) : (
          filteredChapters.map((chapter, index) => {
            const chapterBadge = `0${index + 1}`.slice(-2);

            // 🔓 LOCK LOGIC:
            // 1. Pro Mode ဆိုလျှင် အကုန် Unlock ဖြစ်မည်။
            // 2. Learner Mode ဆိုလျှင် ပထမဆုံး Chapter 1 (index === 0) သာ Unlock ဖြစ်ပြီး ကျန်တာ Lock ဖြစ်မည်။
            const isLocked = isPro ? false : index !== 0;

            // API Data & Color Config
            const progress = chapter.progress ?? 0;
            const cardColor = chapter.color || activeColor;
            const iconKey =
              chapter.iconKey || journey?.iconKey || journey?.id || "code";

            // Lesson Count & Duration Info
            const totalLessons =
              chapter.totalLessons ||
              chapter.lessonsCount ||
              chapter.lessons?.length ||
              0;
            const duration = chapter.duration || chapter.time || "30m";

            return (
              <div
                key={chapter.id || chapter._id || index}
                className={`relative z-10 w-full max-w-[170px] sm:max-w-[210px] min-h-[210px] sm:min-h-[250px] bg-[#121418] rounded-xl sm:rounded-2xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300 ${
                  isLocked
                    ? "border-white/5 opacity-80"
                    : "border-white/10 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
                }`}
              >
                {/* 🔒 Lock Overlay (Learner Mode တွင် Chapter 1 မဟုတ်ပါက ပေါ်မည်) */}
                {isLocked && (
                  <div className="absolute inset-0 z-30 bg-[#0a0a0b]/75 backdrop-blur-[1px] flex flex-col items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center mb-1 border border-white/10">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                  </div>
                )}

                {/* 🔝 Top Header Section */}
                <div className="relative w-full pt-3 sm:pt-4 px-2.5 sm:px-4 flex items-start justify-between min-h-[40px] sm:min-h-[48px]">
                  {/* Left Pill (Pro Mode မှာ Icon | Learner Mode မှာ Step Badge) */}
                  <div
                    className="w-16 sm:w-22 h-8 sm:h-9 rounded-r-full flex items-center justify-center shadow-lg -ml-2.5 sm:-ml-4"
                    style={{ backgroundColor: cardColor }}
                  >
                    {isPro ? (
                      /* Pro Mode: Render Dynamic API Icon */
                      <div className="ml-1 sm:ml-2 text-white">
                        <RenderIcon
                          iconKey={iconKey}
                          map={boardIconMap}
                          size={16}
                        />
                      </div>
                    ) : (
                      /* Learner Mode: Step Badge Text */
                      <span className="text-white font-black text-[10px] sm:text-xs tracking-wide ml-1 sm:ml-2">
                        {chapterBadge} STEP
                      </span>
                    )}
                  </div>

                  {/* Right Top Area (Learner Mode တွင်သာ Progress Circle သို့မဟုတ် Lock Icon ပြမည်) */}
                  <div className="flex-shrink-0 z-10 min-w-[32px] sm:min-w-[38px] min-h-[32px] sm:min-h-[38px] flex items-center justify-end">
                    {!isPro && !isLocked && (
                      <CircularProgress
                        percentage={progress}
                        color={cardColor}
                        size={32}
                      />
                    )}
                    {!isPro && isLocked && (
                      <div className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] rounded-full bg-[#1e2329] border border-white/10 flex items-center justify-center shadow-md">
                        <Lock size={14} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 📝 Content Body */}
                <div className="px-2.5 sm:px-4 py-2 sm:py-3 flex-1 flex flex-col items-center justify-center text-center">
                  {!isPro && (
                    <span
                      className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest mb-1"
                      style={{ color: cardColor }}
                    >
                      OPTIONS {chapterBadge}
                    </span>
                  )}

                  {/* Chapter Title */}
                  <h3 className="font-bold text-gray-100 text-xs sm:text-sm uppercase leading-snug line-clamp-2 mb-2">
                    {chapter.title || `Chapter ${index + 1}`}
                  </h3>

                  {/* 📚 Lessons & Duration (Learner & Pro Mode နှစ်ခုလုံးတွင် မပျောက်ဘဲ ပြသထားပါသည်) */}
                  <div className="flex items-center gap-2 text-[9px] sm:text-[11px] text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <BookOpen size={11} className="text-gray-500" />{" "}
                      {totalLessons} Lessons
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-gray-500" /> {duration}
                    </span>
                  </div>
                </div>

                {/* 🔻 Bottom Rounded Tab */}
                <div className="relative w-full h-7 sm:h-8 flex justify-center mt-auto">
                  <div
                    className="w-16 sm:w-20 h-4 sm:h-5 rounded-t-xl transition-all"
                    style={{
                      backgroundColor: isLocked
                        ? "rgba(255,255,255,0.05)"
                        : cardColor,
                    }}
                  />

                  {/* Unlocked ဖြစ်ပါက Play Button ပြမည် */}
                  {!isLocked && (
                    <button
                      className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 p-1 sm:p-1.5 bg-[#1a1d24] rounded-lg border border-white/10 text-white transition-colors shadow-md z-20 hover:scale-105 active:scale-95"
                      style={{
                        hoverBackgroundColor: cardColor,
                      }}
                    >
                      <Play size={10} fill="currentColor" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default ChapterCardsGrid;
