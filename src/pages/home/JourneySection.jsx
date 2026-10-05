import { useFetch } from "../../hooks/useFetch";
import { getJourneys } from "../../api/journeysApi";
import { getLessons } from "../../api/lessonsApi"; 
import JourneyCardsGrid from "../Learning/Journeys/JourneyCardsGrid";

function JourneySection() {
  const {
    data: journeys,
    loading: journeysLoading,
    error: journeysError,
  } = useFetch(getJourneys);

  const {
    data: lessonsData,
    loading: lessonsLoading,
    error: lessonsError,
  } = useFetch(getLessons);

  const allLessons = Array.isArray(lessonsData) ? lessonsData : [];
  const isLoading = journeysLoading || lessonsLoading;
  const hasError = journeysError || lessonsError;

  return (
    <section id="journeys" className="py-10 md:py-16">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-text text-3xl font-extrabold mb-3">
          Choose your learning journey
        </h2>
        <p className="text-text-muted text-lg max-w-xl mx-auto">
          Select your path and start building. Progress and XP await!
        </p>
      </div>

      <JourneyCardsGrid
        journeys={journeys}
        allLessons={allLessons}
        loading={isLoading}
        error={hasError}
      />
    </section>
  );
}

export default JourneySection;
