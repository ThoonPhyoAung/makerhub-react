import React, { useState } from "react";
import { Lock, Check, Search, BookOpen, Clock } from "lucide-react";
import { boardIconMap, RenderIcon } from "../../../utils/iconMaps";
import { Link } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";
import LearnerProToggle from "../components/LearnerProToggle";

// Helper: Extract safe Lesson ID
const getLessonId = (l) => {
  if (!l) return "";
  if (typeof l === "string" || typeof l === "number") return String(l);
  return String(l.id || l._id || l.lessonId || l.lesson_id || "");
};

// Helper: Extract completed sets
const getCompletedSets = (activeUser, journeyId) => {
  const completedLessonSet = new Set();
  const completedChapterSet = new Set();

  if (!activeUser) return { completedLessonSet, completedChapterSet };

  const user =
    activeUser.user || activeUser.profile || activeUser.data || activeUser;

  const addItems = (arr, set) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((item) => {
      if (!item) return;
      if (typeof item === "string" || typeof item === "number") {
        set.add(String(item));
      } else if (typeof item === "object" && item.id != null) {
        set.add(String(item.id));
      }
    });
  };

  addItems(user.completedLessons, completedLessonSet);
  addItems(user.completedChapters, completedChapterSet);

  if (user.progress && typeof user.progress === "object") {
    const jProg = user.progress[journeyId] || user.progress;
    if (jProg) {
      addItems(jProg.completedLessons || jProg.lessons, completedLessonSet);
      addItems(jProg.completedChapters || jProg.chapters, completedChapterSet);
    }
  }

  return { completedLessonSet, completedChapterSet };
};

// Helper: Format total duration
const formatChapterDuration = (chapterLessons = []) => {
  if (!Array.isArray(chapterLessons) || chapterLessons.length === 0)
    return "0 min";

  const totalMins = chapterLessons.reduce((sum, lesson) => {
    const d = parseInt(lesson?.durationMin || 0, 10);
    return sum + (isNaN(d) ? 0 : d);
  }, 0);

  if (totalMins <= 0) return "0 min";
  if (totalMins < 60) return `${totalMins} mins`;

  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hours`;
};

// Circular Progress Component
function CircularProgress({ percentage = 0, color = "#10b981", size = 34 }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const validPercentage = Math.min(Math.max(Number(percentage) || 0, 0), 100);
  const strokeDashoffset =
    circumference - (validPercentage / 100) * circumference;
  const isCompleted = validPercentage >= 100;

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
          <span className="text-[8px] font-bold text-white">
            {Math.round(validPercentage)}%
          </span>
        )}
      </div>
    </div>
  );
}

function ChapterCardsGrid({
  journey,
  chapters = [],
  journeyLessons = [],
  primaryColor = "#10b981",
  activeUser,
  language = "en",
}) {
  const alertContext = useAlert();
  const showAlert =
    typeof alertContext === "function"
      ? alertContext
      : alertContext?.showAlert || (({ message }) => window.alert(message));

  const [userMode, setUserMode] = useState(
    () => localStorage.getItem("userMode") || "learner",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const isPro = userMode === "pro";
  const activeColor = journey?.color || primaryColor;

  // Safe border color for search input
  const safeBorderColor =
    typeof activeColor === "string" &&
    activeColor.startsWith("#") &&
    activeColor.length === 7
      ? `${activeColor}40`
      : activeColor;

  // Translation Helper
  const t = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field?.[language] ?? field?.en ?? field?.mm ?? "";
  };

  // Handle Mode Change
  const handleModeChange = (newMode) => {
    setUserMode(newMode);
    localStorage.setItem("userMode", newMode);
    setSearchQuery("");
  };

  // 1. Sort chapters by 'order' or original array sequence
  const sortedChapters = [...chapters].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });

  // 2. add clear chapter numbers to each chapter based on sorted order
  const indexedChapters = sortedChapters.map((chapter, index) => ({
    ...chapter,
    chapterNumber: chapter.order || index + 1,
  }));

  // 3. Filter for search if in Pro mode
  const displayedChapters = indexedChapters.filter((chapter) => {
    if (!isPro || !searchQuery.trim()) return true;
    return t(chapter.title || chapter.name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  // 4. Get completed sets for the active user
  const { completedLessonSet, completedChapterSet } = getCompletedSets(
    activeUser,
    journey?.id,
  );

  const getChapterProgressData = (chapter) => {
    if (!chapter)
      return {
        totalLessons: 0,
        completedCount: 0,
        progress: 0,
        isCompleted: false,
      };

    const chId = String(chapter.id || chapter._id || "");
    const chapterLessons = journeyLessons.filter(
      (l) => String(l.chapterId) === chId,
    );

    const isExplicitlyCompleted =
      (chId && completedChapterSet.has(chId)) ||
      Boolean(chapter.isCompleted) ||
      Boolean(chapter.completed) ||
      chapter.status === "completed";

    const totalLessons =
      chapterLessons.length > 0
        ? chapterLessons.length
        : chapter.totalLessons || chapter.lessonsCount || 0;

    if (isExplicitlyCompleted) {
      return {
        totalLessons,
        completedCount: totalLessons,
        progress: 100,
        isCompleted: true,
      };
    }

    if (chapterLessons.length === 0) {
      return {
        totalLessons: 0,
        completedCount: 0,
        progress: 0,
        isCompleted: false,
      };
    }

    let completedCount = 0;
    chapterLessons.forEach((l) => {
      const lId = getLessonId(l);
      if (lId && completedLessonSet.has(lId)) {
        completedCount++;
      }
    });

    const progress =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const isCompleted =
      (progress >= 100 || completedCount >= totalLessons) && totalLessons > 0;

    return {
      totalLessons,
      completedCount,
      progress: Math.min(progress, 100),
      isCompleted,
    };
  };

  return (
    <section className="relative w-full bg-[#0a0a0b] py-8 sm:py-12 px-3 sm:px-4 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col items-center gap-4 mb-8 z-20">
        <LearnerProToggle
          mode={userMode}
          onChange={handleModeChange}
          activeColor={activeColor}
        />
        {/* search bar for pro */}
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
              style={{ borderColor: safeBorderColor }}
            />
          </div>
        )}
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 justify-items-center">
        {displayedChapters.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 text-xs sm:text-sm">
            No chapters found matching "{searchQuery}"
          </div>
        ) : (
          displayedChapters.map((chapter) => {
            const chapterNum = chapter.chapterNumber;
            const chapterBadge = `0${chapterNum}`.slice(-2);
            const chId = String(chapter.id || chapter._id || "");

            const chapterLessons = journeyLessons.filter(
              (l) => String(l.chapterId) === chId,
            );

            const { totalLessons, progress } = getChapterProgressData(chapter);

            // Unlock logic based on the sorted order position
            const prevChapter =
              chapterNum > 1
                ? indexedChapters.find(
                    (c) => c.chapterNumber === chapterNum - 1,
                  )
                : null;
            const prevChapterData = prevChapter
              ? getChapterProgressData(prevChapter)
              : null;
            const isPrevCompleted = prevChapterData
              ? prevChapterData.isCompleted
              : true;

            const isLocked = isPro
              ? false
              : chapterNum !== 1 && !isPrevCompleted;

            const cardColor = chapter.color || activeColor;
            const iconKey =
              chapter.iconKey || journey?.iconKey || journey?.id || "code";
            const duration = formatChapterDuration(chapterLessons);

            const CardTag = isLocked ? "div" : Link;
            const cardProps = isLocked
              ? {
                  onClick: () =>
                    showAlert({
                      message:
                        language === "mm"
                          ? "Learner Mode မှာ ရှေ့ chapter ပြီးမှ ဖွင့်လို့ရပါမည်။ အကုန်ကြည့်ချင်ပါက Pro Mode သုံးပါ။"
                          : "In Learner Mode, complete the previous chapter to unlock this one. Switch to Pro Mode to view all.",
                      type: "warning",
                    }),
                }
              : { to: `/learning/${journey?.id || journey?._id}/${chId}` };

            return (
              <CardTag
                key={chId || chapterNum}
                {...cardProps}
                className={`group relative z-10 w-full max-w-[170px] sm:max-w-[210px] min-h-[230px] sm:min-h-[270px] bg-[#121418] rounded-[20px] sm:rounded-3xl border flex flex-col overflow-hidden transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),10px_14px_28px_-10px_rgba(0,0,0,0.7)] ${
                  isLocked
                    ? "border-white/5 opacity-80 cursor-not-allowed"
                    : "border-white/10 cursor-pointer hover:-translate-y-1 hover:border-white/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),14px_20px_36px_-10px_rgba(0,0,0,0.8)] active:scale-[0.98]"
                }`}
              >
                {isLocked && (
                  <div className="absolute inset-0 z-30 bg-[#0a0a0b]/75 backdrop-blur-[1px] flex flex-col items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center mb-1 border border-white/10">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                  </div>
                )}

                <div className="w-full pt-7 sm:pt-8 pr-2.5 sm:pr-4 flex items-center justify-between">
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

                <div className="px-3 sm:px-5 pt-3 sm:pt-4 pb-2 flex-1 flex flex-col items-center text-center">
                  <h3
                    className="font-extrabold uppercase text-[11px] sm:text-sm tracking-wide leading-snug line-clamp-2 mb-1.5"
                    style={{ color: cardColor }}
                  >
                    {t(chapter.title || chapter.name) ||
                      `Chapter ${chapterNum}`}
                  </h3>

                  {(chapter.desc || chapter.description) && (
                    <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3 mb-2">
                      {t(chapter.desc || chapter.description)}
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
