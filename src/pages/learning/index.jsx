import { useFetch } from "../../hooks/useFetch";
import { getJourneys } from "../../api/journeysApi";
import { getLessons } from "../../api/lessonsApi";
import LearningHeader from "./components/LearningHeader";
import JourneyCardsGrid from "./Journeys/JourneyCardsGrid";

function Learning() {
  // 📍 1. Get Journeys Data
  const {
    data: journeys,
    loading: journeysLoading,
    error: journeysError,
  } = useFetch(getJourneys);

  // 📍 2. Get All Lessons Data (Method 1)
  const {
    data: lessonsData,
    loading: lessonsLoading,
    error: lessonsError,
  } = useFetch(getLessons);

  const allLessons = Array.isArray(lessonsData) ? lessonsData : [];
  const isLoading = journeysLoading || lessonsLoading;
  const hasError = journeysError || lessonsError;

  return (
    <section className="py-10 md:py-16">
      <LearningHeader />
      <JourneyCardsGrid
        journeys={journeys}
        allLessons={allLessons}
        loading={isLoading}
        error={hasError}
      />
    </section>
  );
}

export default Learning;
