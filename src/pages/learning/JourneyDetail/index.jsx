import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetch } from "../../../hooks/useFetch";
import { getJourneyById } from "../../../api/journeysApi";
import { getLessonsByJourneyId } from "../../../api/lessonsApi";

import JourneyHero from "./JourneyHero";
import ChapterCardsGrid from "./ChapterCardsGrid";

function JourneyDetail() {
  const { journeyId } = useParams();
  const activeUser = useSelector((state) => state?.auth?.user);

  // Language Toggle State
  const [language, setLanguage] = useState(
    () => localStorage.getItem("lang") || "en",
  );

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "mm" : "en";
    setLanguage(nextLang);
    localStorage.setItem("lang", nextLang);
  };

  //  1. Journey Data Fetching
  const journeyFetchFn = useCallback(
    () => getJourneyById(journeyId),
    [journeyId],
  );
  const {
    data: journey,
    loading: journeyLoading,
    error: journeyError,
  } = useFetch(journeyFetchFn);

  //  2. Journey ID အလိုက် Lessons Data Fetching (/lessons?journeyId=...)
  const lessonsFetchFn = useCallback(
    () =>  getLessonsByJourneyId(journeyId),
    [journeyId],
  );
  const { data: lessonsData, loading: lessonsLoading } =
    useFetch(lessonsFetchFn);

  const journeyLessons = Array.isArray(lessonsData) ? lessonsData : [];

  if (journeyLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-gray-400 text-sm">
        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading Journey & Lessons...
      </div>
    );
  }

  if (journeyError || !journey) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-red-400 text-sm">
        Journey not found!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* 📍 Hero ထံ သက်ဆိုင်ရာ Lessons Array ကို ပေးပို့ခြင်း */}
      <JourneyHero
        journey={journey}
        journeyLessons={journeyLessons}
        activeUser={activeUser}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* 📍 Chapter Cards ထံ သက်ဆိုင်ရာ Lessons Array ကို ပေးပို့ခြင်း */}
      <div id="chaptersSection">
        <ChapterCardsGrid
          journey={journey}
          chapters={journey?.chapters || []}
          journeyLessons={journeyLessons}
          primaryColor={journey?.color || "#10b981"}
          activeUser={activeUser}
          language={language}
        />
      </div>
    </div>
  );
}

export default JourneyDetail;
