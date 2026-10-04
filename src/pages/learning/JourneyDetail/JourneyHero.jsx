import React, { useMemo } from "react";
import {
  BookOpen,
  Clock,
  Users,
  Play,
  CheckCircle2,
  Flame,
  CheckCircle,
  Code2,
  Cpu,
  Lightbulb,
  Star,
} from "lucide-react";
import { boardIconMap, RenderIcon } from "../../../utils/iconMaps";
import LearningBreadcrumb from "../components/LearningBreadcrumb";

// Total Minutes ကို Format ပြုလုပ်ပေးသည့် Helper
const formatTotalDuration = (totalMinutes) => {
  if (!totalMinutes || totalMinutes <= 0) return "0 mins";
  if (totalMinutes < 60) return `${totalMinutes} mins`;

  const hrs = Math.floor(totalMinutes / 60); // Hours ကို တွက်ချက်ခြင်း , round is not used to avoid rounding up if over .5
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hours`;
};

// Lesson တစ်ခုအတွင်းရှိ Question များ၏ XP စုစုပေါင်းကို တွက်ချက်ခြင်း
const getLessonAllQuestionsXp = (lesson) => {
  if (!lesson) return 0;
  if (Array.isArray(lesson.questions) && lesson.questions.length > 0) {
    return lesson.questions.reduce((sum, q) => sum + Number(q.xp || 0), 0);
  }
  return Number(lesson.xp || 0);
};

// Completed Lesson Set ကို ရယူခြင်း
const getCompletedLessonSet = (activeUser) => {
  const set = new Set(); // protected Set ကို အသုံးပြု၍ Duplicate Lesson or ID များကို ရှောင်ကြဉ်နိုင်ရန်, .has, .add, .size
  if (!activeUser) return set;

  const list = activeUser.completedLessons || [];

  if (Array.isArray(list)) {
    list.forEach((item) => {
      if (typeof item === "string" || typeof item === "number") {
        set.add(String(item));
      } else if (item?.id || item?._id) {
        // if saved as object with id or _id
        set.add(String(item.id || item._id));
      }
    });
  }
  return set;
};

function JourneyHero({
  journey,
  journeyLessons = [], // 📍 API မှ ရောက်ရှိလာသော Lessons Array
  activeUser,
  language = "en",
  onToggleLanguage,
}) {
  if (!journey) return null;

  // Language Translation Helper
  const t = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field?.[language] ?? field?.en ?? ""; // Fallback to English if the desired language is not available
  };

  // Destructuring Journey Data
  const {
    id,
    level = "Beginner", // Default Level
    color = "#10b981",
    colorBg = "rgba(16, 185, 129, 0.1)",
    chapters = [],
    dailyStreak = 0,
    streak = 0,
    boardImage,
    image,
    coverImage,
    iconKey,
  } = journey;

  const journeyId = id;
  const completedLessonSet = useMemo(
    () => getCompletedLessonSet(activeUser),
    [activeUser],
  );

  // 📍 Journey Lessons API Data မှ အချက်အလက်များကို Dynamic ပေါင်းတွက်ခြင်း
  const journeyStats = useMemo(() => {
    let totalLessonsCount = 0;
    let totalMaxQuestionXp = 0;
    let totalEarnedXp = 0;
    let totalDurationMins = 0;
    let completedLessonsCount = 0;

    if (journeyLessons.length > 0) {
      totalLessonsCount = journeyLessons.length;

      journeyLessons.forEach((lesson) => {
        // ၁။ Question တိုင်း၏ XP ကို ပေါင်းယူမည်
        const lessonXp = getLessonAllQuestionsXp(lesson);
        totalMaxQuestionXp += lessonXp;

        // ၂။ Lesson တိုင်း၏ Duration (Minutes) ကို ပေါင်းယူမည်
        const duration = Number(
          lesson.durationMin || lesson.duration || lesson.time || 0,
        );
        totalDurationMins += duration;

        // ၃။ User ဖြေပြီးသား Lesson ဖြစ်ပါက Earned XP ပေါင်းမည်
        const lessonIdStr = String(lesson.id || lesson._id || "");
        if (lessonIdStr && completedLessonSet.has(lessonIdStr)) {
          completedLessonsCount++;
          totalEarnedXp += lessonXp;
        }
      });
    } else {
      // Fallback: API မှ lesson မရောက်သေးပါက Static Journey Data ကို ခေတ္တပြသမည်
      totalLessonsCount = Number(journey.totalLessons || 0);
      totalMaxQuestionXp = Number(journey.totalXp || 0);
    }

    // ၄။ Chapter Completeness တွက်ချက်ခြင်း
    let completedChaptersCount = 0;
    chapters.forEach((ch) => {
      const chId = String(ch.id || ch._id);
      const chLessons = journeyLessons.filter(
        (l) => String(l.chapterId) === chId,
      );

      if (chLessons.length > 0) {
        const isChapterFinished = chLessons.every((l) =>
          completedLessonSet.has(String(l.id || l._id)),
        );
        if (isChapterFinished) completedChaptersCount++;
      }
    });

    return {
      totalLessonsCount,
      completedLessonsCount,
      completedChaptersCount,
      totalMaxQuestionXp,
      totalEarnedXp,
      formattedDuration: formatTotalDuration(totalDurationMins),
    };
  }, [journeyLessons, chapters, completedLessonSet, journey]);

  const totalChapters = chapters?.length || 0;
  const chapterProgressPercent =
    totalChapters > 0
      ? Math.round((journeyStats.completedChaptersCount / totalChapters) * 100)
      : 0;

  const isCompleted = chapterProgressPercent === 100;
  const isStarted =
    chapterProgressPercent > 0 || journeyStats.completedLessonsCount > 0;

  // First Lesson ရဲ့ completedUserIds အရေအတွက်ကို စစ်ဆေးခြင်း
  const firstLessonUserIds = journeyLessons[0]?.completedUserIds;
  const learnersCount = Array.isArray(firstLessonUserIds)
    ? firstLessonUserIds.length
    : 0;

  const currentStreak =
    activeUser?.streak || activeUser?.dailyStreak || dailyStreak || streak || 0;

  const displayImage =
    boardImage ||
    image ||
    coverImage ||
    "https://placehold.co/200x200/18181b/ffffff?text=Board";

  const isProUser =
    activeUser?.role === "pro" ||
    Boolean(activeUser?.isPro) ||
    localStorage.getItem("userMode") === "pro";

  return (
    <>
      <LearningBreadcrumb
        items={[
          { label: "Learning", path: "/learning" },
          { label: t(journey.title) },
        ]}
        language={language}
        onToggleLanguage={onToggleLanguage}
        isPro={isProUser}
      />

      <div className="relative w-full bg-bg-elevated/30 border-b border-white/5 py-4 sm:py-6 overflow-hidden">
        <div
          className="absolute top-0 left-1/3 -translate-x-1/2 w-[400px] h-[180px] rounded-full blur-[200px] opacity-35 pointer-events-none z-0"
          style={{ backgroundColor: color }}
        />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 flex flex-col justify-center">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{
                    backgroundColor: colorBg,
                    color: color,
                    border: `1px solid ${color}33`,
                  }}
                >
                  <RenderIcon
                    iconKey={iconKey || journeyId}
                    map={boardIconMap}
                    size={12}
                  />
                  {t(level)} Level
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-bg-elevated border border-white/10 text-text-muted">
                  <CheckCircle size={12} className="text-emerald-400" />
                  {journeyStats.completedChaptersCount}/{totalChapters} Chapters
                  Done
                </span>
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-2xl font-bold text-text tracking-tight mb-1">
                {t(journey.title)}
              </h1>

              {/* Description */}
              <p className="text-text-muted text-xs leading-relaxed max-w-2xl mb-3 line-clamp-1 sm:line-clamp-2">
                {t(journey.desc || journey.description)}
              </p>

              {/* Overall Progress Bar */}
              <div className="w-full max-w-lg mb-3">
                <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                  <span className="text-text-muted">Overall Progress</span>
                  <span className="text-text">
                    {journeyStats.completedChaptersCount}/{totalChapters}{" "}
                    Chapters ({chapterProgressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(Math.max(chapterProgressPercent, 0), 100)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons & Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <a
                  href="#chaptersSection"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg font-bold text-xs text-white shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 4px 14px -3px ${color}88`,
                  }}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 size={16} /> Review Course
                    </>
                  ) : isStarted ? (
                    <>
                      <Play size={16} fill="currentColor" /> Continue Journey
                    </>
                  ) : (
                    <>
                      <Play size={16} fill="currentColor" /> Start Journey
                    </>
                  )}
                </a>

                {/* Daily Streak */}
                <div className="bg-bg-elevated/90 border border-amber-500/30 backdrop-blur-md rounded-lg px-2.5 py-1.5 shadow-sm flex items-center gap-2">
                  <Flame
                    size={14}
                    className="fill-amber-400 text-amber-400 animate-pulse"
                  />
                  <div className="text-[10px] font-bold text-text">
                    {currentStreak} Days 🔥
                  </div>
                </div>

                {/* Earned XP / Total Questions XP */}
                <div className="bg-bg-elevated/90 border border-purple-500/30 backdrop-blur-md rounded-lg px-2.5 py-1.5 shadow-sm flex items-center gap-2">
                  <Star size={14} className="fill-purple-400 text-purple-400" />
                  <div className="text-[10px] font-bold text-text">
                    {journeyStats.totalEarnedXp} /{" "}
                    {journeyStats.totalMaxQuestionXp} XP
                  </div>
                </div>
              </div>

              {/* Dynamic Bottom Info Bar */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted py-0.5 border-t border-white/5 pt-2">
                <div className="flex items-center gap-1">
                  <BookOpen size={13} style={{ color }} />
                  <span>{journeyStats.totalLessonsCount} lessons</span>
                </div>
                <span className="text-white/20">•</span>
                <div className="flex items-center gap-1">
                  <Clock size={13} className="text-amber-400" />
                  <span>{journeyStats.formattedDuration}</span>
                </div>
                <span className="text-white/20">•</span>
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-purple-400" />
                  <span>{journeyStats.totalMaxQuestionXp} Total XP</span>
                </div>
                <span className="text-white/20">•</span>
                <div className="flex items-center gap-1">
                  <Users size={13} className="text-blue-400" />
                  <span>{learnersCount} learners</span>
                </div>
              </div>
            </div>

            {/* Right Column Image */}
            <div className="lg:col-span-4 hidden lg:flex justify-center items-center my-2 lg:my-0">
              <div className="relative w-full max-w-[260px] aspect-square flex items-center justify-center">
                <div
                  className="absolute w-52 h-52 rounded-full blur-3xl opacity-40 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 w-40 h-40 sm:w-68 sm:h-68 flex items-center justify-center group">
                  <img
                    src={displayImage}
                    alt={t(journey.title)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/200x200/18181b/ffffff?text=Board";
                    }}
                  />
                </div>

                <div className="absolute top-6 left-2 z-20 p-2.5 rounded-xl bg-bg-elevated/80 border border-white/10 backdrop-blur-md shadow-lg text-blue-400">
                  <Code2 size={18} />
                </div>
                <div className="absolute top-2 right-2 z-20 p-2.5 rounded-xl bg-bg-elevated/80 border border-white/10 backdrop-blur-md shadow-lg text-emerald-400">
                  <Cpu size={18} />
                </div>
                <div className="absolute bottom-6 right-2 z-20 p-2.5 rounded-xl bg-bg-elevated/80 border border-white/10 backdrop-blur-md shadow-lg text-amber-400">
                  <Lightbulb size={18} className="fill-amber-400/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JourneyHero;
