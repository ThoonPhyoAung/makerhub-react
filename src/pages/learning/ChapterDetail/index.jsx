import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetch } from "../../../hooks/useFetch";
import { getJourneyById } from "../../../api/journeysApi";
import { getLessonsByChapterId } from "../../../api/lessonsApi";

import ChapterHero from "./ChapterHero";
import LessonCardsGrid from "./LessonCardsGrid";

function ChapterDetail() {
  const { journeyId, chapterId } = useParams();

  // 📍 1. Redux Store မှ Active User ကို ယူခြင်း
  const activeUser = useSelector((state) => state.auth.user);

  // 📍 2. Global Language State & Toggle
  const [language, setLanguage] = useState(
    () => localStorage.getItem("lang") || "en",
  );

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "mm" : "en";
    setLanguage(nextLang);
    localStorage.setItem("lang", nextLang);
  };

  // 📍 3. Fetch Journey Details
  const fetchJourney = useCallback(
    () => getJourneyById(journeyId),
    [journeyId],
  );
  const {
    data: journey,
    loading: journeyLoading,
    error: journeyError,
  } = useFetch(fetchJourney);

  // 📍 4. Fetch Lessons for this Chapter
  const fetchLessons = useCallback(
    () => getLessonsByChapterId(chapterId),
    [chapterId],
  );
  const {
    data: lessonsData,
    loading: lessonsLoading,
    error: lessonsError,
  } = useFetch(fetchLessons);

  if (journeyLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-gray-400 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          Loading Chapter Modules...
        </div>
      </div>
    );
  }

  if (journeyError || !journey) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-red-400 text-sm">
        Chapter or Journey not found!
      </div>
    );
  }

  const currentChapter = journey?.chapters?.find(
    (ch) => String(ch.id) === String(chapterId),
  ) || {
    id: chapterId,
    title: { en: "Chapter Modules", mm: "Chapter သင်ခန်းစာများ" },
    desc: {
      en: "Explore hands-on hardware modules.",
      mm: "လက်တွေ့ စမ်းသပ်လေ့လာနိုင်သော Module များကို စတင်လိုက်ပါ။",
    },
  };

  const lessons = Array.isArray(lessonsData) ? lessonsData : [];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* 1. Chapter Hero Banner */}
      <ChapterHero
        journey={journey}
        chapter={currentChapter}
        lessons={lessons}
        activeUser={activeUser}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* 2. Module Cards Grid */}
      <div id="modulesSection">
        <LessonCardsGrid
          journey={journey}
          chapter={currentChapter}
          lessons={lessons}
          activeUser={activeUser}
          language={language}
        />
      </div>
    </div>
  );
}

export default ChapterDetail;
