import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { getJourneyById } from "../../../api/journeysApi";

import JourneyHero from "./JourneyHero";
import ChapterCardsGrid from "./ChapterCardsGrid";

function JourneyDetail() {
  const { journeyId } = useParams();

  // useCallback သုံးပြီး journeyId ပြောင်းမှသာ API function အသစ်ဖြစ်အောင် ထိန်းပါ
  const fetchSingleJourney = useCallback(
    () => getJourneyById(journeyId),
    [journeyId],
  );

  const { data: journey, loading, error } = useFetch(fetchSingleJourney);
  if (loading) {
    return (
      <div className="text-center py-20 text-text-muted">
        Loading journey...
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="text-center py-20 text-red-400">Journey not found!</div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <JourneyHero journey={journey} />

      {/* ChapterCardsGrid ဆီကို journey object ပါ တွဲပို့ပေးပါ */}
      <div id="chaptersSection">
        <ChapterCardsGrid
          journey={journey}
          chapters={journey?.chapters || []}
          primaryColor={journey?.color || "#10b981"}
        />
      </div>
    </div>
  );
}

export default JourneyDetail;
