import React from "react";
import { BookOpen, Clock, Play, CheckCircle2 } from "lucide-react";
import LearningBreadcrumb from "../components/LearningBreadcrumb";
import { boardIconMap, RenderIcon } from "../../../utils/iconMaps";

function ChapterHero({
  journey,
  chapter,
  lessons = [],
  activeUser,
  language = "en",
  onToggleLanguage,
}) {
  if (!chapter || !journey) return null;

  // Language Translator Helper
  const t = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field?.[language] ?? field?.en ?? "";
  };

  const activeColor = journey?.color || "#10b981";
  const totalLessons = lessons.length;

  // 📍 Real User Progress Calculation from Redux State
  const completedLessonIds = activeUser?.completedLessons || [];
  const completedCount = lessons.filter((l) =>
    completedLessonIds.includes(l.id || l._id),
  ).length;

  const progress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isCompleted = totalLessons > 0 && completedCount === totalLessons;
  const isStarted = completedCount > 0 && !isCompleted;

  const durationTotal = lessons.reduce(
    (total, lesson) => total + (lesson.durationMin || 0),
    0,
  );

  return (
    <>
      {/* 📍 Reusable Learning Breadcrumb with Language Switcher */}
      <LearningBreadcrumb
        items={[
          { label: "Learning", path: "/learning" },
          { label: t(journey.title), path: `/learning/${journey.journeyId}` },
          { label: t(chapter.title) },
        ]}
        language={language}
        onToggleLanguage={onToggleLanguage}
        isPro={activeUser?.role === "pro"}
      />

      {/* 🚀 Compact & Widescreen Chapter Hero */}
      <div className="relative w-full bg-bg-elevated/40 border-b border-border py-6 sm:py-8 px-4 overflow-hidden shadow-sm">
        {/* Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] rounded-full blur-[140px] opacity-20 dark:opacity-35 pointer-events-none"
          style={{ backgroundColor: activeColor }}
        />

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Chapter Badge */}
          <div className="mb-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm"
              style={{
                backgroundColor: `${activeColor}15`,
                color: activeColor,
                border: `1px solid ${activeColor}40`,
              }}
            >
              <RenderIcon
                iconKey={journey.iconKey || journey.id}
                map={boardIconMap}
                size={12}
              />
              {chapter.order ? `Chapter ${chapter.order}` : "Chapter View"}
            </span>
          </div>

          {/* Chapter Title (Bilingual) */}
          <h1 className="text-xl sm:text-3xl font-extrabold text-text tracking-tight mb-2">
            {t(chapter.title)}
          </h1>

          {/* Description (Bilingual) */}
          {chapter.desc && (
            <p className="text-text-muted text-xs sm:text-sm leading-relaxed max-w-4xl mb-3 font-normal">
              {t(chapter.desc)}
            </p>
          )}

          {/* Bottom Bar: Real Dynamic Stats */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-1">
            <div className="flex items-center gap-3 sm:gap-4 text-xs text-text-muted font-medium bg-bg-elevated border border-border px-4 py-2 rounded-xl shadow-sm">
              <span className="flex items-center gap-1.5">
                <BookOpen size={13} style={{ color: activeColor }} />
                {totalLessons} Lessons
              </span>
              <span className="text-text-muted/50">•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-amber-500" />
                {durationTotal} mins
              </span>
              <span className="text-text-muted/50">•</span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-500 dark:text-emerald-400">
                {completedCount}/{totalLessons} completed [{progress}%]
              </span>
            </div>

            {/* Action Button */}
            <a
              href="#modulesSection"
              className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-extrabold text-xs text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: activeColor }}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 size={15} /> Review Lessons
                </>
              ) : isStarted ? (
                <>
                  <Play size={15} fill="currentColor" /> Continue Chapter
                </>
              ) : (
                <>
                  <Play size={15} fill="currentColor" /> Start Chapter
                </>
              )}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChapterHero;
