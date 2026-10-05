import React, { useState, useMemo } from "react";
import { Lock, Search, Clock, FileText, Zap, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";
import LearnerProToggle from "../components/LearnerProToggle";

// Lesson တစ်ခုအတွင်းရှိ Question များ၏ XP စုစုပေါင်းကို တွက်ချက်ခြင်း
const getLessonAllQuestionsXp = (lesson) => {
  if (!lesson) return 0;
  if (Array.isArray(lesson.questions) && lesson.questions.length > 0) {
    return lesson.questions.reduce((sum, q) => sum + Number(q.xp || 0), 0);
  }
  return lesson.xp || 0;
};

function LessonCardsGrid({
  journey,
  chapter,
  lessons = [],
  activeUser,
  language = "en",
}) {
  const alertContext = useAlert();
  const showAlert =
    typeof alertContext === "function"
      ? alertContext
      : alertContext?.showAlert || (({ message }) => window.alert(message));

  const [userMode, setUserMode] = useState(() => {
    return localStorage.getItem("userMode") || "learner";
  });
  const [searchQuery, setSearchQuery] = useState("");

  const isPro = userMode === "pro";
  const activeColor = journey?.color || "#10b981";

  const t = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field?.[language] ?? field?.en ?? field?.mm ?? "";
  };

  // Sorting lessons by order before logic checks
  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => {
      const orderA = a.order ?? a.lessonNumber ?? 999;
      const orderB = b.order ?? b.lessonNumber ?? 999;
      return orderA - orderB;
    });
  }, [lessons]);

  const checkIsCompleted = (lessonItem) => {
    if (!lessonItem) return false;
    const lessonId = String(lessonItem.id || lessonItem._id || "");

    const userCompletedList = (activeUser?.completedLessons || []).map(String);
    const isCompletedInRedux = userCompletedList.includes(lessonId);

    const currentUserId = String(activeUser?.id || activeUser?._id || "");
    const isCompletedInApi =
      Array.isArray(lessonItem.completedUserIds) && currentUserId
        ? lessonItem.completedUserIds.map(String).includes(currentUserId)
        : false;

    return (
      isCompletedInRedux || isCompletedInApi || Boolean(lessonItem.isCompleted)
    );
  };

  const handleModeChange = (newMode) => {
    setUserMode(newMode);
    localStorage.setItem("userMode", newMode);
    setSearchQuery("");
  };

  const filteredLessons = useMemo(() => {
    if (!isPro || !searchQuery.trim()) return sortedLessons;
    return sortedLessons.filter((lesson) =>
      t(lesson.title).toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [sortedLessons, isPro, searchQuery, language]);

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
              placeholder="Search lessons by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#121418] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-all shadow-inner"
              style={{ borderColor: `${activeColor}40` }}
            />
          </div>
        )}
      </div>

      {/* Lessons Grid */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 justify-items-center">
        {filteredLessons.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 text-xs sm:text-sm">
            No lessons found matching "{searchQuery}"
          </div>
        ) : (
          filteredLessons.map((lesson, index) => {
            const isCompleted = checkIsCompleted(lesson);

            const originalIndex = sortedLessons.findIndex(
              (l) => (l.id || l._id) === (lesson.id || lesson._id),
            );
            const actualIndex = originalIndex !== -1 ? originalIndex : index;

            const prevLesson =
              actualIndex > 0 ? sortedLessons[actualIndex - 1] : null;
            const isPrevCompleted = prevLesson
              ? checkIsCompleted(prevLesson)
              : true;

            const isLocked = isPro
              ? false
              : actualIndex !== 0 && !isPrevCompleted;

            const lessonNumber = lesson.order || actualIndex + 1;
            const duration =
              lesson.durationText ||
              lesson.duration ||
              `${lesson.durationMin || 10}m`;
            const xpReward =
              getLessonAllQuestionsXp(lesson) || lesson.xpReward || 20;

            const CardTag = isLocked ? "div" : Link;
            const lessonUrl = lesson.id || lesson._id || lesson.lessonUrlParam;

            const cardProps = isLocked
              ? {
                  onClick: () =>
                    showAlert({
                      message:
                        language === "mm"
                          ? "Learner Mode မှာ ရှေ့ lesson ပြီးမှ ဖွင့်လို့ရပါမည်။ အကုန်ကြည့်ချင်ပါက Pro Mode သုံးပါ။"
                          : "In Learner Mode, complete previous lessons to unlock. Switch to Pro Mode to unlock all.",
                      type: "warning",
                    }),
                }
              : {
                  to: `/learning/${journey?.id || lesson.journeyId}/${chapter?.id || lesson.chapterId}/${lessonUrl}`,
                };

            return (
              <CardTag
                key={lessonUrl || index}
                {...cardProps}
                className={`group relative w-full min-w-0 rounded-2xl sm:rounded-2xl  flex flex-col overflow-hidden transition-all duration-300 outline-none  ${
                  //focus-visible:ring-2 focus-visible:ring-white/40   shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_25px_-10px_rgba(0,0,0,0.7)]
                  isLocked
                    ? "border-white/5 opacity-75 cursor-not-allowed"
                    : !isPro && isCompleted
                      ? "border-emerald-500/30 hover:border-emerald-500/50 hover:-translate-y-1 active:scale-[0.99]"
                      : "border-white/10 cursor-pointer hover:-translate-y-1 hover:border-white/20 active:scale-[0.99]"
                }`}
              >
                {/* 🔒 Lock Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 z-30 bg-[#0a0a0b]/85 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center mb-1 border border-white/10 shadow-inner">
                      <Lock size={15} className="text-gray-400" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Locked
                    </span>
                  </div>
                )}

                {/* 1. Cover Image With Badges & Tilt Animation === sm:-rotate-2 sm:group-hover:rotate-0           */}
                <div className="relative z-0 w-full aspect-[16/10] rounded-t-2xl overflow-hidden shadow-md transition-transform duration-500 ease-out shrink-0 translate-y-3 group-hover:translate-y-0">
                  {" "}
                  {/* ⚡ XP Badge */}
                  {!isPro && (
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-400 text-[9px] sm:text-[10px] font-bold shadow-sm">
                      <Zap
                        size={10}
                        className="fill-amber-400 text-amber-400 shrink-0"
                      />
                      <span>+{xpReward} XP</span>
                    </div>
                  )}
                  {/* ✅ Completed Status Overlay */}
                  {!isPro && isCompleted && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[9px] sm:text-[10px] font-bold shadow-sm">
                      <CheckCircle2
                        size={11}
                        className="text-emerald-400 shrink-0"
                      />
                      <span>Done</span>
                    </div>
                  )}
                  {lesson.coverImage ? (
                    <img
                      src={lesson.coverImage}
                      alt={t(lesson.title)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 "
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: `${activeColor}12` }}
                    >
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${activeColor}20`,
                          color: activeColor,
                        }}
                      >
                        {lesson.type || "Interactive"}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Folder-tab Panel */}
                <div
                  className="relative z-10 flex-1 -mt-3 sm:-mt-4 rounded-xl px-2.5 sm:px-3.5 pt-3.5 sm:pt-5 pb-2.5 flex flex-col justify-between border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_25px_-10px_rgba(0,0,0,0.7)]"
                  style={{
                    backgroundColor: "#121418",
                    backgroundImage: `linear-gradient(${activeColor}1f, ${activeColor}1f)`,
                    clipPath:
                      "polygon(0 0, 48% 0, calc(48% + 10px) 12px, 100.5% 12px, 100.5% 100%, 0 100%)",
                  }}
                >
                  <div>
                    {/* Title */}
                    <h4
                      className="text-xs sm:text-base font-bold leading-snug line-clamp-2 tracking-tight"
                      style={{ color: activeColor }}
                    >
                      {t(lesson.title) || `Lesson ${lessonNumber}`}
                    </h4>

                    <div
                      className="w-full h-px my-1.5 opacity-20"
                      style={{ backgroundColor: activeColor }}
                    />

                    {/* Description */}
                    {(lesson.description || lesson.desc) && (
                      <p className="text-gray-300 text-[10px] sm:text-xs leading-relaxed line-clamp-2 opacity-90">
                        {t(lesson.description || lesson.desc)}
                      </p>
                    )}
                  </div>

                  {/* Footer Row */}
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] sm:text-[11px] text-gray-400">
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock size={10} className="text-gray-400" />
                      {duration}
                    </span>

                    <span
                      className={`flex items-center gap-1 truncate max-w-[55%] font-medium ${
                        !isPro && isCompleted
                          ? "text-emerald-400"
                          : "text-gray-400"
                      }`}
                    >
                      {!isPro && isCompleted ? (
                        <>
                          <CheckCircle2
                            size={10}
                            className="text-emerald-400 shrink-0"
                          />
                          <span className="truncate">Completed</span>
                        </>
                      ) : (
                        <>
                          <FileText
                            size={10}
                            className="text-gray-400 shrink-0"
                          />
                          <span className="truncate">
                            {lesson.type || "Interactive"}
                          </span>
                        </>
                      )}
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

export default LessonCardsGrid;
