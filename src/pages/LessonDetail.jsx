import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { journeys } from "../data/journeys";
import { getLessonsByJourney } from "../data/lessons";

function LessonDetail() {
  const { journeyId, lessonSlug } = useParams();
  const journey = journeys.find((j) => j.id === journeyId);
  const journeyLessons = getLessonsByJourney(journeyId);
  const currentIndex = journeyLessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = journeyLessons[currentIndex];

  // journeyId/lessonSlug မတွေ့ရင် (broken link, typo, or lesson removed)
  if (!journey || !lesson) {
    return (
      <section className="py-16 px-4 text-center">
        <p className="text-text-muted mb-4">Lesson not found.</p>
        <Link
          to={`/learning/${journeyId ?? ""}`}
          className="text-primary font-semibold"
        >
          Back to journey
        </Link>
      </section>
    );
  }

  const prevLesson = currentIndex > 0 ? journeyLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < journeyLessons.length - 1
      ? journeyLessons[currentIndex + 1]
      : null;

  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to={`/learning/${journeyId}`}
          className="inline-flex items-center gap-1.5 text-text-muted hover:text-primary text-sm font-semibold mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Back to {journey.title}
        </Link>

        <div className="flex items-center justify-between mb-2">
          <span className="text-text-subtle text-xs font-semibold uppercase tracking-wider">
            Lesson {currentIndex + 1} of {journeyLessons.length}
          </span>
          <span className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
            <Star size={13} /> {lesson.xpReward} XP
          </span>
        </div>

        <h1 className="text-text text-2xl md:text-3xl font-extrabold mb-6">
          {lesson.title}
        </h1>

        {/* TODO: TR ကနေ content schema ဆုံးဖြတ်ပြီးရင် block renderer
            (text/image/code/quiz) နဲ့ အစားထိုးမယ်. အခုတော့ plain text */}
        <div className="text-text-muted leading-relaxed mb-10 whitespace-pre-line">
          {lesson.content}
        </div>

        <div className="flex items-center justify-between gap-4 pt-6 border-t border-border">
          {prevLesson ? (
            <Link
              to={`/learning/${journeyId}/${prevLesson.slug}`}
              className="inline-flex items-center gap-1.5 text-text font-semibold text-sm px-4 py-2 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <ChevronLeft size={15} /> Previous
            </Link>
          ) : (
            <span />
          )}

          {nextLesson ? (
            <Link
              to={`/learning/${journeyId}/${nextLesson.slug}`}
              className="inline-flex items-center gap-1.5 bg-primary text-[#052010] font-bold text-sm px-4 py-2 rounded-lg hover:brightness-110 transition-all"
            >
              Next <ChevronRight size={15} />
            </Link>
          ) : (
            <Link
              to={`/learning/${journeyId}`}
              className="inline-flex items-center gap-1.5 bg-primary text-[#052010] font-bold text-sm px-4 py-2 rounded-lg hover:brightness-110 transition-all"
            >
              Finish Journey <ChevronRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default LessonDetail;
