import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
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

function JourneyHero({ journey }) {
  if (!journey) return null;

  const {
    id,
    title,
    desc,
    description,
    level = "Beginner",
    color = "#10b981",
    colorBg = "rgba(16, 185, 129, 0.1)",
    chapters = [],
    totalXp = 0,
    userXp = 0,
    studentsCount = 0,
    estimatedTime = "3-4 hours",
    progress: propProgress,
    userProgress,
    completedLessonsCount = 0,
    completedChaptersCount = 0,
    dailyStreak = 0,
    streak = 0,
    boardImage,
    iconKey,
  } = journey;

  const displayDesc = desc || description || "";
  const progressPercent = Number(propProgress ?? userProgress ?? 0);
  const currentStreak = dailyStreak || streak || 14;

  const totalChapters = journey.totalChapters || chapters?.length || 0;
  const totalLessons =
    journey.totalLessons ||
    (chapters?.length > 0
      ? chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0)
      : 0);

  const completedChapters =
    completedChaptersCount ||
    (chapters?.length > 0
      ? chapters.filter((ch) => ch.isCompleted || ch.progress === 100).length
      : Math.floor((progressPercent / 100) * totalChapters));

  const chapterProgressPercent =
    totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : progressPercent;

  const earnedXp =
    userXp || Math.round((chapterProgressPercent / 100) * totalXp);

  const isCompleted = chapterProgressPercent === 100;
  const isStarted = chapterProgressPercent > 0;

  return (
    <>
      {/* 📍 1. Sticky Sub-Nav Bar (Compact) */}
      <LearningBreadcrumb
        items={[
          { label: "Learning", path: "/learning" },
          { label: journey.title },
        ]}
      />

      {/* 🚀 2. Main Hero Section (Reduced Height) */}
      <div className="relative w-full bg-bg-elevated/30 border-b border-white/5 py-4 sm:py-6 overflow-hidden">
        {/* Glow Background */}
        <div
          className="absolute top-0 left-1/3 -translate-x-1/2 w-[400px] h-[180px] rounded-full blur-[200px] opacity-35 pointer-events-none z-0"
          style={{ backgroundColor: color }}
        />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-6 items-center">
            {/* 👈 LEFT COLUMN */}
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
                    iconKey={iconKey || id}
                    map={boardIconMap}
                    size={12}
                  />
                  {level} Level
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-bg-elevated border border-white/10 text-text-muted">
                  <CheckCircle size={12} className="text-emerald-400" />
                  {completedChapters}/{totalChapters} Chapters Done
                </span>
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-2xl font-bold text-text tracking-tight mb-1">
                {title}
              </h1>

              {/* Description */}
              <p className="text-text-muted text-xs leading-relaxed max-w-2xl mb-3 line-clamp-1 sm:line-clamp-2">
                {displayDesc}
              </p>

              {/* 📊 CHAPTER PROGRESS BAR */}
              <div className="w-full max-w-lg mb-3">
                <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                  <span className="text-text-muted">Chapter Progress</span>
                  <span className="text-text">
                    {completedChapters}/{totalChapters} Chapters (
                    {chapterProgressPercent}%)
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

              {/* 🎯 START BTN + STREAK & XP BADGES */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <Link
                  to="#chaptersSection"
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
                </Link>

                {/* Daily Streak Badge */}
                <div className="bg-bg-elevated/90 border border-amber-500/30 backdrop-blur-md rounded-lg px-2.5 py-1.5 shadow-sm flex items-center gap-2">
                  <Flame
                    size={14}
                    className="fill-amber-400 text-amber-400 animate-pulse"
                  />
                  <div>
                    <div className="text-[10px] font-bold text-text">
                      {currentStreak} Days 🔥
                    </div>
                  </div>
                </div>

                {/* Earned XP Badge */}
                <div className="bg-bg-elevated/90 border border-purple-500/30 backdrop-blur-md rounded-lg px-2.5 py-1.5 shadow-sm flex items-center gap-2">
                  <Star size={14} className="fill-purple-400 text-purple-400" />
                  <div>
                    <div className="text-[10px] font-bold text-text">
                      {earnedXp} XP
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Ribbon Info */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted py-0.5 border-t border-white/5 pt-2">
                <div className="flex items-center gap-1">
                  <BookOpen size={13} style={{ color }} />
                  <span>{totalLessons} lessons</span>
                </div>
                <span className="text-white/20">•</span>
                <div className="flex items-center gap-1">
                  <Clock size={13} className="text-amber-400" />
                  <span>{estimatedTime}</span>
                </div>
                <span className="text-white/20">•</span>
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-purple-400" />
                  <span>{totalXp} XP</span>
                </div>
                <span className="text-white/20">•</span>
                <div className="flex items-center gap-1">
                  <Users size={13} className="text-blue-400" />
                  <span>{studentsCount} learners</span>
                </div>
              </div>
            </div>

            {/* 👉 RIGHT COLUMN (COMPACT BOARD SHOWCASE) */}
            <div className="lg:col-span-4 hidden lg:flex justify-center items-center my-2 lg:my-0">
              <div className="relative w-full max-w-[260px] aspect-square flex items-center justify-center">
                {/* 🌌 Soft Backlight Glow */}

                <div
                  className="absolute w-52 h-52 rounded-full blur-3xl opacity-40 pointer-events-none"
                  style={{
                    // radial-gradient ထဲမှာ မိမိကြိုက်နှစ်သက်ရာ Color Code (သို့) dynamic ${color} ပြောင်းပေးနိုင်ပါသည်
                    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                  }}
                />

                {/* 🎯 Main Board Showcase Image */}
                <div className="relative z-10 w-40 h-40 sm:w-68 sm:h-68 flex items-center justify-center group">
                  <img
                    src={boardImage}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/200x200/18181b/ffffff?text=Board";
                    }}
                  />
                </div>

                {/* 📐 THREE FLOATING ICONS POSITIONING */}

                {/* ↖️ Top-Left Icon */}
                <div className="absolute top-6 left-2 z-20 p-2.5 rounded-xl bg-bg-elevated/80 border border-white/10 backdrop-blur-md shadow-lg text-blue-400 hover:scale-110 transition-transform">
                  <Code2 size={18} />
                </div>

                {/* ↗️ Top-Right Icon */}
                <div className="absolute top-2 right-2 z-20 p-2.5 rounded-xl bg-bg-elevated/80 border border-white/10 backdrop-blur-md shadow-lg text-emerald-400 hover:scale-110 transition-transform">
                  <Cpu size={18} />
                </div>

                {/* ↘️ Bottom-Right Icon */}
                <div className="absolute bottom-6 right-2 z-20 p-2.5 rounded-xl bg-bg-elevated/80 border border-white/10 backdrop-blur-md shadow-lg text-amber-400 hover:scale-110 transition-transform">
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
