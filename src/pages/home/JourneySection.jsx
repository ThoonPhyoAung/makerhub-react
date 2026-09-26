import { Link } from "react-router-dom";
import { Loader2, BookOpen, Users, Star, ChevronRight } from "lucide-react";

// API & Custom Hooks
import { useFetch } from "../../hooks/useFetch";
import { getJourneys } from "../../api/journeysApi";
import { boardIconMap, RenderIcon } from "../../utils/iconMaps";

function JourneySection() {
  const { data: journeys, loading, error } = useFetch(getJourneys);

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

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {loading ? (
          /* Loading State */
          <div className="text-center py-16">
            <Loader2
              size={32}
              className="mx-auto text-primary animate-spin mb-3"
            />
            <p className="text-text-muted">Loading learning journeys...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-16 text-red-400">
            <p>Failed to load journeys: {error}</p>
          </div>
        ) : !journeys || journeys.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 text-text-muted">
            <p>No learning journeys available right now!</p>
          </div>
        ) : (
          /* Journey Cards Grid */
          <div className="grid lg:grid-cols-2 gap-6">
            {journeys.map((j) => (
              <div
                key={j.id}
                className="group relative overflow-hidden bg-bg-elevated border border-white/5 rounded-3xl p-4 sm:p-6 hover:-translate-y-1 hover:border-white/15 transition-all duration-300"
              >
                {/* 🚀 1. Top-Left Corner Accent Glow */}
                <div
                  className="absolute -top-16 -left-16 w-38 h-38 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: j.color }}
                />

                {/* 🚀 2. Bottom-Right Corner Accent Glow */}
                <div
                  className="absolute -bottom-16 -right-16 w-38 h-38 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: j.color }}
                />

                {/* Card Content Layer */}
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: j.colorBg, color: j.color }}
                    >
                      <RenderIcon
                        iconKey={j.iconKey || j.id}
                        map={boardIconMap}
                        size={22}
                      />
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: j.colorBg,
                        color: j.color,
                        border: `1px solid ${j.color}33`,
                      }}
                    >
                      {j.level}
                    </span>
                  </div>

                  <div className="flex justify-between items-start gap-4 mb-5">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-text text-lg sm:text-xl font-bold mb-2">
                        {j.title}
                      </h3>
                      <p className="hidden md:block text-text-muted text-sm leading-relaxed mb-3">
                        {j.desc}
                      </p>
                      <div className="flex gap-3 sm:gap-4 text-text-muted text-xs sm:text-sm">
                        <span className="flex items-center gap-1">
                          <BookOpen size={13} /> {j.totalLessons}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={13} /> {j.studentsCount}
                        </span>
                      </div>
                    </div>

                    <div className="w-[100px] h-[85px] sm:w-[140px] sm:h-[110px] rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-bg-subtle/20">
                      <img
                        src={j.boardImage}
                        alt={j.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-80 transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/300x200/18181b/ffffff?text=Microcontroller";
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-muted">Progress</span>
                      <span className="text-text-muted">{j.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-bg-subtle border border-border-muted rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${j.progress}%`,
                          backgroundColor: j.color,
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className="flex items-center gap-1 text-sm font-semibold"
                        style={{ color: j.color }}
                      >
                        <Star size={13} /> {j.totalXp} XP
                      </span>

                      <Link
                        to={`/learning/${j.link}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border transition-all duration-300 group-hover:bg-white/5"
                        style={{ borderColor: j.color, color: j.color }}
                      >
                        Continue <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default JourneySection;
