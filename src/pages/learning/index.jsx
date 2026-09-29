import { useFetch } from "../../hooks/useFetch";
import { getJourneys } from "../../api/journeysApi";

import LearningHeader from "./components/LearningHeader";
import JourneyCardsGrid from "./Journeys/JourneyCardsGrid";

function Learning() {
  const { data: journeys, loading, error } = useFetch(getJourneys);

  return (
    <section className="py-10 md:py-16">
      <LearningHeader />
      <JourneyCardsGrid journeys={journeys} loading={loading} error={error} />
    </section>
  );
}

export default Learning;
