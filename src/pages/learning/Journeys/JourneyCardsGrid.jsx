import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2, BookOpen, Users, Star, ChevronRight } from "lucide-react";
import { boardIconMap, RenderIcon } from "../../../utils/iconMaps";

// 📍 Lesson တစ်ခုအတွင်းရှိ Questions များ၏ Total XP ကို တွက်ပေးသည့် Helper
const getLessonQuestionsXp = (lesson) => {
  if (!lesson) return 0;
  if (Array.isArray(lesson.questions) && lesson.questions.length > 0) {
    return lesson.questions.reduce((sum, q) => sum + Number(q.xp || 0), 0);
  }
  return Number(lesson.xp || 0);
};

// 📍 User completed Lesson IDs များကို Set အဖြစ် ပြောင်းသည့် Helper
const getCompletedLessonSet = (activeUser) => {
  const set = new Set();
  if (!activeUser) return set;
  const user = activeUser;

  const list = user.completedLessons || [];
  if (Array.isArray(list)) {
    list.forEach((item) => {
      if (typeof item === "string" || typeof item === "number")
        set.add(String(item));
      else if (item?.id || item?._id) set.add(String(item.id || item._id));
    });
  }
  return set;
};

function JourneyCardsGrid({ journeys = [], allLessons = [], loading, error }) {
  // Redux မှ Active User ရယူခြင်း
  const activeUser = useSelector((state) => state?.auth?.user);

  const completedLessonSet = useMemo(
    () => getCompletedLessonSet(activeUser),
    [activeUser],
  );

  // 📍 METHOD 1: allLessons ပေါ် မူတည်၍ Journey တစ်ခုချင်းစီ၏ Stats များကို တွက်ချက်ခြင်း
  const enrichedJourneys = useMemo(() => {
    if (!Array.isArray(journeys)) return [];

    return journeys.map((j) => {
      const journeyId = String(j.journeyId || j.id || "");
      const journeySlug = String(j.journeyId || j.id || "");

      const journeyLessons = allLessons.filter(
        (l) =>
          String(l.journeyId || l.journey) === journeyId ||
          String(l.journeyId || l.journey) === journeySlug,
      );

      const totalChapters = j.chapters?.length || 0;
      let totalLessons = 0;
      let totalMaxXp = 0;
      let completedCount = 0;

      const uniqueLearners = new Set();

      if (journeyLessons.length > 0) {
        totalLessons = journeyLessons.length;

        journeyLessons.forEach((l) => {
          totalMaxXp += getLessonQuestionsXp(l);

          const lessonIdStr = String(l.id || l._id || "");
          if (lessonIdStr && completedLessonSet.has(lessonIdStr)) {
            completedCount++;
          }

          if (Array.isArray(l.completedUserIds)) {
            l.completedUserIds.forEach((uid) =>
              uniqueLearners.add(String(uid)),
            );
          }
        });
      } else {
        totalLessons = Number(j.totalLessons || 0);
        totalMaxXp = Number(j.totalXp || 0);
      }

      const progressPercent =
        totalLessons > 0
          ? Math.min(Math.round((completedCount / totalLessons) * 100), 100)
          : 0;

      const studentsCount = uniqueLearners.size;

      return {
        ...j,
        resolvedId: journeyId || journeySlug,
        totalChapters,
        totalLessons,
        totalXp: totalMaxXp,
        progress: progressPercent,
        studentsCount,
      };
    });
  }, [journeys, allLessons, completedLessonSet]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8" id="learningSection">
      {loading ? (
        <div className="text-center py-16">
          <Loader2
            size={32}
            className="mx-auto text-primary animate-spin mb-3"
          />
          <p className="text-text-muted">Loading learning journeys...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-400">
          <p>Failed to load journeys: {String(error)}</p>
        </div>
      ) : !enrichedJourneys || enrichedJourneys.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p>No learning journeys available right now!</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {enrichedJourneys.map((j) => (
            <div
              key={j.id || j.journeyId}
              className="group relative overflow-hidden bg-bg-elevated border border-border rounded-3xl p-4 sm:p-6 hover:-translate-y-1.5 transition-all duration-500 shadow-sm hover:shadow-2xl"
              style={{
                // 🌟 Mouse တင်လိုက်စဉ် Journey ၏ သက်ဆိုင်ရာအရောင်ဖြင့် ဖျော့တော့သော 3D Glow Border & Shadow ပေါ်လာစေရန်
                ["--journey-color"]: j.color,
              }}
            >
              {/* 🌟 Premium Atmospheric Top-Left Glow */}
              <div
                className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[70px] opacity-0 group-hover:opacity-25 dark:group-hover:opacity-35 transition-all duration-700 pointer-events-none"
                style={{ backgroundColor: j.color }}
              />

              {/* 🌟 Premium Atmospheric Bottom-Right Glow */}
              <div
                className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[70px] opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-all duration-700 pointer-events-none"
                style={{ backgroundColor: j.color }}
              />

              <div className="relative z-10">
                {/* Badge & Icon */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner"
                    style={{ backgroundColor: j.colorBg, color: j.color }}
                  >
                    <RenderIcon
                      iconKey={j.iconKey}
                      map={boardIconMap}
                      size={22}
                    />
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                    style={{
                      backgroundColor: j.colorBg,
                      color: j.color,
                      border: `1px solid ${j.color}33`,
                    }}
                  >
                    {j.level}
                  </span>
                </div>

                {/* Title, Desc & Image */}
                <div className="flex justify-between items-start gap-4 mb-5">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-text text-lg sm:text-xl font-bold mb-2">
                      {typeof j.title === "object" ? j.title.en : j.title}
                    </h3>
                    <p className="hidden md:block text-text-muted text-sm leading-relaxed mb-3 line-clamp-2">
                      {typeof j.desc === "object"
                        ? j.desc.en
                        : j.desc || j.description}
                    </p>
                    <div className="flex gap-3 sm:gap-4 text-text-muted text-xs sm:text-sm font-medium">
                      <span className="flex items-center gap-1">
                        <BookOpen size={13} className="text-primary" />{" "}
                        {j.totalChapters} chapters
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={13} className="text-primary" />{" "}
                        {j.totalLessons} lessons
                      </span>
                      <span className="flex items-center gap-1 hidden sm:flex">
                        <Users size={13} className="text-primary" />{" "}
                        {j.studentsCount} learners
                      </span>
                    </div>
                  </div>

                  <div className="w-[100px] h-[85px] sm:w-[140px] sm:h-[110px] rounded-xl overflow-hidden shrink-0 flex items-center justify-center ">
                    <img
                      src={j.boardImage || j.image || j.coverImage}
                      alt={typeof j.title === "object" ? j.title.en : j.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/300x200/18181b/ffffff?text=Microcontroller";
                      }}
                    />
                  </div>
                </div>

                {/* Progress Bar & Actions */}
                <div>
                  <div className="flex justify-between text-sm mb-1 font-semibold">
                    <span className="text-text-muted">Progress</span>
                    <span className="text-text">{j.progress}%</span>
                  </div>
                  <div className="h-2 bg-bg-subtle border border-border rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${j.progress}%`,
                        backgroundColor: j.color,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      className="flex items-center gap-1 text-sm font-bold"
                      style={{ color: j.color }}
                    >
                      <Star size={14} className="fill-current" /> {j.totalXp} XP
                    </span>

                    <Link
                      to={`/learning/${j.resolvedId}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl border transition-all duration-300 hover:bg-surface active:scale-95 shadow-sm"
                      style={{ borderColor: j.color, color: j.color }}
                    >
                      {j.progress > 0 ? "Continue" : "Start Journey"}{" "}
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JourneyCardsGrid;
