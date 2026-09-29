import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { getJourneyById } from "../../../api/journeysApi";
import { getLessonsByChapterId } from "../../../api/lessonsApi";

import ChapterHero from "./ChapterHero";
import LessonCardsGrid from "./LessonCardsGrid";

function ChapterDetail() {
  const { journeyId, chapterId } = useParams();

  // 1. Fetch Journey Detail (To get Chapter Metadata & Board Info)
  const fetchJourney = useCallback(
    () => getJourneyById(journeyId),
    [journeyId],
  );
  const {
    data: journey,
    loading: journeyLoading,
    error: journeyError,
  } = useFetch(fetchJourney);

  // 2. Fetch Lessons for this specific Chapter from API
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

  // Current Chapter Metadata
  const currentChapter = journey?.chapters?.find(
    (ch) => String(ch.id) === String(chapterId),
  ) || {
    id: chapterId,
    title: "Chapter Modules",
    desc: "Explore hands-on hardware modules.",
  };

  const lessons = Array.isArray(lessonsData) ? lessonsData : [];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* 1. Chapter Hero Banner */}
      <ChapterHero
        journey={journey}
        chapter={currentChapter}
        lessons={lessons}
      />

      {/* 2. Module Cards Grid with Learner/Pro Modes */}
      <div id="modulesSection">
        <LessonCardsGrid
          journey={journey}
          chapter={currentChapter}
          lessons={lessons}
        />
      </div>
    </div>
  );
}

export default ChapterDetail;
