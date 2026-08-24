import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { journeys } from "../../data/journeys";
import { getLessonsByJourney } from "../../data/lessons";

function JourneyDetail() {
  const { journeyId } = useParams();
  const journey = journeys.find((j) => j.id === journeyId);
  const lessons = getLessonsByJourney(journeyId);

  // journeyId က journeys.js ထဲမှာ မရှိတဲ့ id ဖြစ်နေရင် (typo/broken link)
  if (!journey) {
    return (
      <section className="py-16 px-4 text-center">
        <p className="text-text-muted mb-4">Journey not found.</p>
        <Link to="/learning" className="text-primary font-semibold">
          Back to all journeys
        </Link>
      </section>
    );
  }

  const Icon = journey.icon;

  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/learning"
          className="inline-flex items-center gap-1.5 text-text-muted hover:text-primary text-sm font-semibold mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> All journeys
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: journey.colorBg, color: journey.color }}
          >
            <Icon size={26} />
          </div>
          <div className="min-w-0">
            <h1 className="text-text text-2xl md:text-3xl font-extrabold">
              {journey.title}
            </h1>
            <p className="text-text-muted text-sm">{journey.desc}</p>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-16 bg-bg-elevated border border-border rounded-2xl">
            <BookOpen size={32} className="mx-auto text-text-subtle mb-3" />
            <p className="text-text-muted">
              Lessons for this journey are coming soon.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {lessons.map((lesson, i) => (
              <Link
                key={lesson.id}
                to={`/learning/${journeyId}/${lesson.slug}`}
                className="flex items-center justify-between gap-4 bg-bg-elevated border border-border rounded-xl px-5 py-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      backgroundColor: journey.colorBg,
                      color: journey.color,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-text font-semibold truncate">
                    {lesson.title}
                  </span>
                </div>
                <ArrowRight size={16} className="text-text-subtle shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default JourneyDetail;
