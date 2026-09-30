import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Clock,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Play,
  HelpCircle,
  X,
  ShoppingBag,
  ExternalLink,
  Layers,
  Globe,
  BookOpen,
} from "lucide-react";
import { useAlert } from "../../../context/AlertContext";
import { useFetch } from "../../../hooks/useFetch";
import { getLessonBySlug } from "../../../api/lessonsApi";
import LearningBreadcrumb from "../components/LearningBreadcrumb"; // 📍 Breadcrumb Component Path ကို စစ်ဆေးပါ

const SECTION_COLORS = ["#34d399", "#a78bfa", "#fbbf24", "#38bdf8", "#fb7185"];
const CONFETTI_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#a855f7"];

function LessonDetailPage() {
  const { journeyId, chapterId, lessonSlug } = useParams();
  const navigate = useNavigate();
  const showAlert = useAlert();

  const [activeUser, setActiveUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("makerhub_active_user") || "{}");
    } catch {
      return {};
    }
  });

  const [localCompletedIds, setLocalCompletedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("completedLessonIds") || "[]");
    } catch {
      return [];
    }
  });

  const fetchFn = useMemo(
    () => () => getLessonBySlug(lessonSlug),
    [lessonSlug],
  );
  const { data: currentLesson, loading, error } = useFetch(fetchFn, [fetchFn]);

  const isAlreadyCompleted = useMemo(() => {
    if (!currentLesson) return false;
    return localCompletedIds.includes(currentLesson.id);
  }, [currentLesson, localCompletedIds]);

  const [activeSectionId, setActiveSectionId] = useState("");
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const [language, setLanguage] = useState(
    () => localStorage.getItem("lang") || "en",
  );

  const toggleLanguage = () => {
    const next = language === "en" ? "mm" : "en";
    setLanguage(next);
    localStorage.setItem("lang", next);
  };

  const t = (field) => {
    if (typeof field === "string") return field;
    return field?.[language] ?? field?.en ?? "";
  };

  const lessonSections = useMemo(() => {
    if (!currentLesson) return [];
    return (currentLesson.sections || []).map((s) => ({
      id: s.id || t(s.label)?.toLowerCase().replace(/\s+/g, "-"),
      label: s.label || "Section",
      blocks: s.blocks || [],
    }));
  }, [currentLesson, language]);

  useEffect(() => {
    if (lessonSections.length > 0 && !activeSectionId) {
      setActiveSectionId(lessonSections[0].id);
    }
  }, [lessonSections, activeSectionId]);

  const scrollToSection = (id) => {
    setActiveSectionId(id);
    const elem = document.getElementById(`section-${id}`);
    if (elem) elem.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCopy = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(idx);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const openQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setIsQuizOpen(true);
  };

  const handleVerify = () => {
    const questions = currentLesson.questions || [];
    let correct = 0;
    questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) correct++;
    });

    const allCorrect = questions.length > 0 && correct === questions.length;
    const reward = Math.round(
      (currentLesson.xpReward || 20) *
        (questions.length ? correct / questions.length : 1),
    );

    setEarnedXp(reward);
    setWasCorrect(allCorrect);
    setQuizSubmitted(true);

    if (allCorrect) {
      if (!isAlreadyCompleted) {
        const updatedUser = {
          ...activeUser,
          xp: (activeUser.xp || 0) + reward,
        };
        localStorage.setItem(
          "makerhub_active_user",
          JSON.stringify(updatedUser),
        );
        setActiveUser(updatedUser);

        const updatedCompleted = [...localCompletedIds, currentLesson.id];
        localStorage.setItem(
          "completedLessonIds",
          JSON.stringify(updatedCompleted),
        );
        setLocalCompletedIds(updatedCompleted);
      }

      setTimeout(() => {
        setIsQuizOpen(false);
        setShowConfetti(true);
        showAlert(`🎉 Correct! Earned +${reward} XP`);
        setTimeout(() => setShowConfetti(false), 3500);
      }, 900);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-gray-400 text-sm">
        Loading lesson...
      </div>
    );
  }

  if (error || !currentLesson) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-3 text-gray-400 text-sm">
        <p>Failed to load lesson: {error || "Lesson not found"}</p>
        <Link
          to={`/learning/${journeyId}/${chapterId}`}
          className="text-emerald-400 font-semibold"
        >
          ← Back to chapter
        </Link>
      </div>
    );
  }

  const simulatorUrl =
    currentLesson.simulator?.type === "wokwi"
      ? `https://wokwi.com/projects/${currentLesson.simulator.id}?embed=1`
      : null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 relative pb-16">
      {showConfetti && <ConfettiBurst />}

      {/* 📍 1. Learning Breadcrumb (XP, Language & Status On Right) */}
      <LearningBreadcrumb
        items={[
          { label: "Learning", path: "/learning" },
          {
            label: journeyId?.replace(/-/g, " "),
            path: `/learning/${journeyId}`,
          },
          {
            label: chapterId?.replace(/-/g, " "),
            path: `/learning/${journeyId}/${chapterId}`,
          },
          { label: t(currentLesson.title) },
        ]}
        xp={currentLesson.xpReward || 20}
        isCompleted={isAlreadyCompleted}
        language={language}
        onToggleLanguage={toggleLanguage}
        isPro={activeUser?.isPro} // Pro User ဖြစ်လျှင် Language Toggle သာ ပေါ်မည်
      />

      {/* 🚀 2. Simple Middle Lesson Hero Section */}
      <div className="w-full bg-[#0e1015] border-b border-white/5 py-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            {t(currentLesson.title)}
          </h1>

          {/* Description */}
          {currentLesson.description && (
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-3xl mb-6">
              {t(currentLesson.description)}
            </p>
          )}

          {/* Cover Image */}
          {currentLesson.coverImage && (
            <div className="w-full overflow-hidden rounded-2xl border border-white/10">
              <img
                src={currentLesson.coverImage}
                alt={t(currentLesson.title)}
                className="w-full h-auto object-cover max-h-[400px]"
              />
            </div>
          )}
        </div>
      </div>

      {/* 📑 3. Main Grid: Left TOC + Right Content Sections */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Sticky Navigation (TOC) */}
        <aside className="w-full lg:w-56 shrink-0 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
              Table Of Contents
            </h3>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {lessonSections.map((sec, idx) => {
                const active = activeSectionId === sec.id;
                const color = SECTION_COLORS[idx % SECTION_COLORS.length];
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`shrink-0 text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap lg:whitespace-normal ${
                      active
                        ? "font-semibold"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                    style={active ? { color } : undefined}
                  >
                    {t(sec.label)}
                  </button>
                );
              })}
              {currentLesson.questions?.length > 0 && (
                <button
                  onClick={openQuiz}
                  className="shrink-0 text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-300 whitespace-nowrap lg:whitespace-normal"
                >
                  Verify & Quiz
                </button>
              )}
            </nav>
          </div>
        </aside>

        {/* Right Content Sections */}
        <main className="flex-1 min-w-0 order-1 lg:order-2 space-y-8">
          {lessonSections.map((section, idx) => {
            const color = SECTION_COLORS[idx % SECTION_COLORS.length];
            return (
              <section
                key={section.id}
                id={`section-${section.id}`}
                className="scroll-mt-24 mb-8"
              >
                <h2
                  className="text-lg sm:text-xl font-bold mb-3"
                  style={{ color }}
                >
                  {t(section.label)}
                </h2>

                <div className="flex flex-col gap-4">
                  {section.blocks.map((block, bIdx) => {
                    if (block.type === "text") {
                      return (
                        <p
                          key={bIdx}
                          className="text-sm text-gray-300 leading-relaxed"
                        >
                          {t(block.value)}
                        </p>
                      );
                    }
                    if (block.type === "code") {
                      return (
                        <div
                          key={bIdx}
                          className="rounded-xl overflow-hidden border border-white/10 bg-[#08090b]"
                        >
                          <div className="flex items-center justify-between px-4 py-2 bg-white/5 text-xs text-gray-400 font-mono">
                            <span>{block.language || "C++"}</span>
                            <button
                              onClick={() => handleCopy(block.value, bIdx)}
                              className="flex items-center gap-1"
                            >
                              {copiedCodeIndex === bIdx ? (
                                <Check size={12} className="text-emerald-400" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto">
                            <code>{block.value}</code>
                          </pre>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-8 text-gray-700">
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                </div>
              </section>
            );
          })}

          {/* Live Simulator */}
          {simulatorUrl && (
            <section className="mb-8">
              <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-sky-400">
                <Play size={18} /> See It Work
              </h2>
              <div className="w-full h-[500px] sm:h-[650px] lg:h-[750px] rounded-2xl overflow-hidden border border-white/10 bg-[#08090b] shadow-2xl relative">
                <iframe
                  src={simulatorUrl}
                  title="Simulator"
                  className="w-full h-full border-0"
                  allow="autoplay"
                />
              </div>
            </section>
          )}

          {/* Hardware Components Section */}
          {currentLesson.hardwareComponents?.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-rose-400">
                <ShoppingBag size={18} /> Build for Real
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentLesson.hardwareComponents.map((comp, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <span className="text-xs font-semibold text-white">
                      {comp}
                    </span>
                    <Link
                      to={`/marketplace?search=${encodeURIComponent(comp)}`}
                      className="text-[11px] font-bold text-emerald-400 flex items-center gap-1"
                    >
                      Marketplace <ExternalLink size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quiz Action Button */}
          {currentLesson.questions?.length > 0 && (
            <button
              onClick={openQuiz}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 text-black font-bold text-sm"
            >
              <HelpCircle size={16} /> Verify Your Understanding
            </button>
          )}
        </main>
      </div>

      {/* Quiz Modal */}
      {isQuizOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121418] border border-white/10 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white">
                Verify & Complete
              </h3>
              <button
                onClick={() => setIsQuizOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"
              >
                <X size={16} />
              </button>
            </div>

            {!quizSubmitted ? (
              <div className="flex flex-col gap-4">
                {currentLesson.questions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3"
                  >
                    <h4 className="text-sm font-semibold text-white">
                      {qIdx + 1}. {t(q.question)}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() =>
                            setQuizAnswers({ ...quizAnswers, [q.id]: oIdx })
                          }
                          className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                            quizAnswers[q.id] === oIdx
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                              : "bg-[#181b20] border-white/10 text-gray-300"
                          }`}
                        >
                          {t(opt)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleVerify}
                  disabled={
                    Object.keys(quizAnswers).length <
                    currentLesson.questions.length
                  }
                  className="self-center px-8 py-3 rounded-xl bg-emerald-500 disabled:bg-white/10 disabled:text-gray-500 text-black font-bold text-xs transition-colors"
                >
                  Submit Answers
                </button>
              </div>
            ) : wasCorrect ? (
              <div className="py-8 text-center">
                <p className="text-2xl mb-2">🎉</p>
                <p className="text-emerald-400 font-bold text-sm">
                  All correct! +{earnedXp} XP
                </p>
                <p className="text-gray-500 text-xs mt-1">Closing...</p>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-red-400 font-bold text-sm mb-3">
                  Not quite — some answers were wrong.
                </p>
                <button
                  onClick={openQuiz}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.4,
        duration: 2.5 + Math.random() * 1.5,
        rotate: Math.random() * 360,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.4; }
        }
      `}</style>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 w-2 h-3 rounded-sm"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

export default LessonDetailPage;
