import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  ExternalLink,
  Cpu,
} from "lucide-react";
import { journeys } from "../../data/journeys";
import { getLessonsByJourney } from "../../data/lessons";

function LessonDetail() {
  const { journeyId, lessonSlug } = useParams();
  const journey = journeys.find((j) => j.id === journeyId);
  const journeyLessons = getLessonsByJourney(journeyId);
  const currentIndex = journeyLessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = journeyLessons[currentIndex];

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

  // 🚀 Dual Simulator URL & Link Configuration Helper
  const getSimulatorDetails = (sim) => {
    if (!sim || !sim.id) return null;

    if (sim.type === "wokwi") {
      const cleanId = String(sim.id)
        .replace("https://wokwi.com/projects/", "")
        .replace("https://wokwi.com/wokwi-embed.html?id=", "")
        .split("?")[0]
        .trim();

      return {
        name: "Wokwi Simulator",
        embedUrl: `https://wokwi.com/projects/${cleanId}?embed=1&nav=0`,
        fullEditorUrl: `https://wokwi.com/projects/${cleanId}`,
      };
    }

    if (sim.type === "velxio") {
      // URL ထဲမှာ embed ID တစ်ခုတည်း သီးသန့်ခွဲထုတ်ခြင်း
      const cleanId = String(sim.id)
        .replace("https://velxio.dev/embed/", "")
        .replace("https://velxio.dev/", "")
        .trim();

      return {
        name: "Velxio Simulator",
        embedUrl: `https://velxio.dev/embed/${cleanId}`,
        fullEditorUrl: sim.shareUrl || `https://velxio.dev/embed/${cleanId}`,
      };
    }

    return null;
  };

  const simConfig = getSimulatorDetails(lesson.simulator);

  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-4xl mx-auto">
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

        <div className="text-text-muted leading-relaxed mb-8 whitespace-pre-line">
          {lesson.content}
        </div>

        {/* 🚀 Dynamic Hardware Simulator Embed (Wokwi or Velxio) */}
        {simConfig && (
          <div className="mb-10 border border-border rounded-2xl overflow-hidden bg-[#18181b] shadow-2xl">
            {/* Simulator Header */}
            <div className="bg-[#09090b] px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-2">
                <Cpu size={15} /> {simConfig.name}
              </span>

              <a
                href={simConfig.fullEditorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-text-subtle hover:text-primary font-medium transition-colors"
              >
                Open full editor <ExternalLink size={12} />
              </a>
            </div>

            {/* Viewport Frame */}
            <div className="relative w-full h-[450px] sm:h-[550px] bg-[#000000]">
              <iframe
                title={`${lesson.title} - Hardware Simulation`}
                src={simConfig.embedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                // Hardware communication & full performance ရရှိရန် allow attribute
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking; serial; autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Navigation Footer */}
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
