import React, { useState, useMemo } from "react";
import { Lock, Check, Search, BookOpen, Clock } from "lucide-react";
import { boardIconMap, RenderIcon } from "../../../utils/iconMaps";
import { Link } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";
import LearnerProToggle from "../components/LearnerProToggle";

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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-white/10"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
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
  const showAlert = useAlert();

  // 💡 localStorage မှ Mode ကို ဖတ်ယူပြီး ရွေးချယ်ထားသော Mode ကို သိမ်းဆည်းပါမည်
  const [userMode, setUserMode] = useState(() => {
    return localStorage.getItem("userMode") || "learner";
  });
  const [searchQuery, setSearchQuery] = useState("");

  const isPro = userMode === "pro";
  const activeColor = journey?.color || primaryColor;

  const handleModeChange = (newMode) => {
    setUserMode(newMode);
    localStorage.setItem("userMode", newMode);
    setSearchQuery("");
  };

  const filteredChapters = useMemo(() => {
    if (!isPro || !searchQuery.trim()) return chapters;
    return chapters.filter((chapter) =>
      (chapter.title || "").toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [chapters, isPro, searchQuery]);

  return (
    <section className="relative w-full bg-[#0a0a0b] py-8 sm:py-12 px-3 sm:px-4 min-h-screen flex flex-col items-center">
      {/* Mode Switcher & Search Bar */}
      <div className="w-full max-w-6xl flex flex-col items-center gap-4 mb-8 z-20">
        <LearnerProToggle
          mode={userMode}
          onChange={handleModeChange}
          activeColor={activeColor}
        />

        {isPro && (
          <div className="relative w-full max-w-md">
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
              style={{ borderColor: `${activeColor}40` }}
            />
          </div>
        )}
      </div>

      {/* Chapters Grid */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 justify-items-center">
        {filteredChapters.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 text-xs sm:text-sm">
            No chapters found matching "{searchQuery}"
          </div>
        ) : (
          filteredChapters.map((chapter, index) => {
            const chapterBadge = `0${index + 1}`.slice(-2);
            const isLocked = isPro ? false : index !== 0;

            const progress = chapter.progress ?? 0;
            const cardColor = chapter.color || activeColor;
            const iconKey =
              chapter.iconKey || journey?.iconKey || journey?.id || "code";

            const totalLessons =
              chapter.totalLessons ||
              chapter.lessonsCount ||
              chapter.lessons?.length ||
              0;
            const duration = chapter.duration || chapter.time || "30m";

            const CardTag = isLocked ? "div" : Link;
            const cardProps = isLocked
              ? {
                  onClick: () =>
                    showAlert({
                      message:
                        "Learner Mode မှာ ရှေ့ chapter ပြီးမှ ဖွင့်လို့ရမည်။ အကုန်ကြည့်ချင်ပါက Pro Mode သုံးပါ။",
                      type: "warning",
                    }),
                }
              : { to: `/learning/${journey?.id}/${chapter.id}` };

            return (
              <CardTag
                key={chapter.id || chapter._id || index}
                {...cardProps}
                className={`group relative z-10 w-full max-w-[170px] sm:max-w-[210px] min-h-[230px] sm:min-h-[270px] bg-[#121418] rounded-[20px] sm:rounded-3xl border flex flex-col overflow-hidden transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),10px_14px_28px_-10px_rgba(0,0,0,0.7)] ${
                  isLocked
                    ? "border-white/5 opacity-80 cursor-not-allowed"
                    : "border-white/10 cursor-pointer hover:-translate-y-1 hover:border-white/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),14px_20px_36px_-10px_rgba(0,0,0,0.8)] active:scale-[0.98]"
                }`}
              >
                {/* Lock Overlay (Learner Mode သီးသန့်) */}
                {isLocked && (
                  <div className="absolute inset-0 z-30 bg-[#0a0a0b]/75 backdrop-blur-[1px] flex flex-col items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center mb-1 border border-white/10">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Card Header */}
                <div className="w-full pt-5 sm:pt-6 pr-2.5 sm:pr-4 flex items-center justify-between">
                  <div
                    className="w-[62%] h-10 sm:h-12 rounded-r-full flex items-center justify-center shadow-lg shrink-0"
                    style={{ backgroundColor: cardColor }}
                  >
                    <div className="text-white">
                      <RenderIcon
                        iconKey={iconKey}
                        map={boardIconMap}
                        size={28}
                      />
                    </div>
                  </div>

                  {!isPro && (
                    <div className="shrink-0 min-w-[32px] min-h-[32px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center">
                      {!isLocked ? (
                        <CircularProgress
                          percentage={progress}
                          color={cardColor}
                          size={32}
                        />
                      ) : (
                        <div className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] rounded-full bg-[#1e2329] border border-white/10 flex items-center justify-center shadow-md">
                          <Lock size={14} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="px-3 sm:px-5 pt-3 sm:pt-4 pb-2 flex-1 flex flex-col items-center text-center">
                  <h3
                    className="font-extrabold uppercase text-[11px] sm:text-sm tracking-wide leading-snug line-clamp-2 mb-1.5"
                    style={{ color: cardColor }}
                  >
                    {chapter.title || `Chapter ${index + 1}`}
                  </h3>

                  {chapter.desc && (
                    <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3 mb-2">
                      {chapter.desc}
                    </p>
                  )}

                  <div className="mt-auto flex items-center gap-2 text-[9px] sm:text-[11px] text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <BookOpen size={11} className="text-gray-500" />
                      {totalLessons} Lessons
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-gray-500" /> {duration}
                    </span>
                  </div>
                </div>

                {/* Card Bottom Tag */}
                <div className="w-full flex justify-center pt-1">
                  <div
                    className="w-[52%] h-6 sm:h-7 rounded-t-xl flex items-center justify-center transition-all group-hover:brightness-110"
                    style={{
                      backgroundColor: isLocked
                        ? "rgba(255,255,255,0.05)"
                        : cardColor,
                    }}
                  >
                    <span className="font-extrabold text-[10px] sm:text-xs text-white uppercase tracking-wider whitespace-nowrap">
                      Chapter {chapterBadge}
                    </span>
                  </div>
                </div>
              </CardTag>
            );
          })
        )}
      </div>
    </section>
  );
}

export default ChapterCardsGrid;
