import React from "react";
import { BookOpen, Clock, Lightbulb, Play, CheckCircle2 } from "lucide-react";
import LearningBreadcrumb from "../components/LearningBreadcrumb";
import { boardIconMap, RenderIcon } from "../../../utils/iconMaps";

function ChapterHero({ journey, chapter, lessons = [] }) {
  if (!chapter || !journey) return null;
  console.log("hero lessons", lessons.length);

  // Live Data Fields from JSON
  const {
    title,
    desc,
    duration = "25m",
    progress = 0,
    order,
  } = chapter;

  const activeColor = journey?.color || "#10b981";
  const totalLessons = lessons.length;
  const isCompleted = progress === 100;
  const isStarted = progress > 0;

  return (
    <>
      {/* 📍 Reusable Learning Breadcrumb */}
      <LearningBreadcrumb
        items={[
          { label: "Learning", path: "/learning" },
          { label: journey.title, path: `/learning/${journey.id}` },
          { label: title },
        ]}
      />

      {/* 🚀 Compact & Widescreen Chapter Hero */}
      <div className="relative w-full bg-[#0e1015] border-b border-white/5 py-6 sm:py-8 px-4 overflow-hidden">
        {/* Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] rounded-full blur-[140px] opacity-15 pointer-events-none"
          style={{ backgroundColor: activeColor }}
        />

        {/* ⚡ Expanded to max-w-5xl for Horizontal Stretch */}
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Chapter Badge */}
          <div className="mb-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold"
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
              {order ? `Chapter ${order}` : "Chapter View"}
            </span>
          </div>

          {/* Chapter Title */}
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            {title}
          </h1>

          {/* Description (Stretched Horizontally to max-w-4xl) */}
          {desc && (
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-4xl mb-3 font-normal">
              {desc}
            </p>
          )}

          {/* Bottom Bar: Stats + Action Button Side-by-Side to save vertical space */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-1">
            {/* Live Data Stats Bar */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-300 font-medium bg-[#13161f] border border-white/10 px-4 py-2 rounded-xl">
              <span className="flex items-center gap-1.5">
                <BookOpen size={13} style={{ color: activeColor }} />
                {totalLessons} Lessons
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-amber-400" />
                {duration}
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                {progress}%
              </span>
            </div>

            {/* Start / Continue Button */}
            <a
              href="#modulesSection"
              className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-extrabold text-xs text-black shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
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
