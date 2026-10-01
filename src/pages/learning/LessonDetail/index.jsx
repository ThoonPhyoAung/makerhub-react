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
  Image as ImageIcon,
  Video as VideoIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAlert } from "../../../context/AlertContext";
import { useFetch } from "../../../hooks/useFetch";
import { getLessonBySlug } from "../../../api/lessonsApi";
import { getJourneyById } from "../../../api/journeysApi";
import LearningBreadcrumb from "../components/LearningBreadcrumb";

const CONFETTI_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#a855f7"];

// 💡 Helper function to convert standard YouTube links to Embed format
function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
}

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

  // 📍 1. Fetch Journey Data to get journey.color
  const journeyFetchFn = useMemo(
    () => () => getJourneyById(journeyId),
    [journeyId],
  );
  const { data: journey } = useFetch(journeyFetchFn, [journeyFetchFn]);
  const journeyColor = journey?.color || "#10b981";

  // Fetch Lesson Data
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

  // 📍 2. Single Question Quiz States
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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
    setCurrentQuestionIndex(0);
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

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 relative pb-16">
      {showConfetti && <ConfettiBurst />}

      {/* 📍 Breadcrumb */}
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
        isPro={activeUser?.isPro}
      />

      {/* 📑 Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Table Of Contents (TOC) - Desktop (lg) ရောက်မှသာ ပေါ်မည် + Journey Color သုံးထားသည် */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
              Table Of Contents
            </h3>
            <nav className="flex flex-col gap-1">
              {lessonSections.map((sec) => {
                const active = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 font-medium ${
                      active
                        ? "shadow-sm font-semibold"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                    }`}
                    style={
                      active
                        ? {
                            color: journeyColor,
                            backgroundColor: `${journeyColor}18`,
                            borderLeft: `3px solid ${journeyColor}`,
                          }
                        : undefined
                    }
                  >
                    {t(sec.label)}
                  </button>
                );
              })}

              {currentLesson.questions?.length > 0 && (
                <button
                  onClick={openQuiz}
                  className="text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all mt-2 flex items-center justify-between"
                  style={{
                    color: journeyColor,
                    backgroundColor: `${journeyColor}15`,
                    border: `1px solid ${journeyColor}40`,
                  }}
                >
                  <span>Verify & Quiz</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10">
                    {currentLesson.questions.length}
                  </span>
                </button>
              )}
            </nav>
          </div>
        </aside>

        {/* Right Content Sections */}
        <main className="flex-1 min-w-0 order-1 lg:order-2 space-y-8">
          {/* Hero Section */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              {t(currentLesson.title)}
            </h1>
            <p className="text-gray-300 text-sm mb-6">
              {t(currentLesson.description)}
            </p>
            {currentLesson.coverImage && (
              <div className="overflow-hidden">
                <img
                  src={currentLesson.coverImage}
                  className="w-full h-auto object-contain object-left max-h-[400px]"
                />
              </div>
            )}
          </div>

          {/* Dynamic Blocks inside Sections */}
          {lessonSections.map((section) => {
            return (
              <section
                key={section.id}
                id={`section-${section.id}`}
                className="scroll-mt-24 mb-8"
              >
                <h2
                  className="text-lg sm:text-xl font-bold mb-3"
                  style={{ color: journeyColor }}
                >
                  {t(section.label)}
                </h2>

                <div className="flex flex-col gap-5">
                  {section.blocks.map((block, bIdx) => {
                    // 1. Text Block
                    if (block.type === "text") {
                      return (
                        <p
                          key={bIdx}
                          className="text-sm text-gray-300 leading-relaxed whitespace-pre-line"
                        >
                          {t(block.value)}
                        </p>
                      );
                    }

                    // 2. Code Block
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
                              className="flex items-center gap-1 hover:text-white"
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

                    // 3. Image Block
                    if (block.type === "image") {
                      return (
                        <div key={bIdx} className="my-2">
                          <div className="rounded-xl overflow-hidden bg-black/20">
                            <img
                              src={block.url}
                              alt={t(block.caption) || "Lesson detail image"}
                              className="w-full h-auto max-h-[500px] object-contain"
                            />
                          </div>
                          {block.caption && (
                            <p className="text-xs text-gray-400 mt-1.5 text-center italic">
                              {t(block.caption)}
                            </p>
                          )}
                        </div>
                      );
                    }

                    // 4. Video Block
                    if (block.type === "video") {
                      const embedUrl = getYouTubeEmbedUrl(block.url);
                      return (
                        <div
                          key={bIdx}
                          className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 my-2 bg-black/40"
                        >
                          <iframe
                            src={embedUrl}
                            title="Lesson Video"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      );
                    }

                    // 5. Wokwi Simulator Block
                    if (block.type === "simulator") {
                      const simUrl = `https://wokwi.com/projects/${block.id}?embed=1`;
                      return (
                        <div key={bIdx} className="my-3">
                          <div className="flex items-center gap-2 mb-2 text-sky-400 font-semibold text-xs">
                            <Play size={14} /> Interactive Simulator
                          </div>
                          <div className="w-full h-[500px] sm:h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-[#08090b] shadow-2xl">
                            <iframe
                              src={simUrl}
                              title="Wokwi Simulator"
                              className="w-full h-full border-0"
                              allow="autoplay"
                            />
                          </div>
                        </div>
                      );
                    }

                    // 6. Hardware Components Block
                    if (block.type === "hardware") {
                      return (
                        <div
                          key={bIdx}
                          className="my-4 p-5 rounded-2xl bg-white/5 border border-white/10"
                        >
                          {block.title && (
                            <h3 className="text-base font-bold text-rose-400 mb-4 flex items-center gap-2">
                              <ShoppingBag size={18} /> {t(block.title)}
                            </h3>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {(block.components || []).map((comp, cIdx) => (
                              <div
                                key={cIdx}
                                className="p-3.5 rounded-xl bg-[#08090b] border border-white/10 flex items-center justify-between hover:border-rose-500/30 transition-all"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {comp.qty && (
                                    <span className="text-[11px] text-rose-400 font-mono font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 shrink-0">
                                      {comp.qty}
                                    </span>
                                  )}
                                  <span className="text-xs font-semibold text-white truncate">
                                    {comp.name}
                                  </span>
                                </div>

                                <Link
                                  to={`/marketplace?search=${encodeURIComponent(
                                    comp.name,
                                  )}`}
                                  className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 hover:underline shrink-0 ml-2"
                                >
                                  Buy <ExternalLink size={12} />
                                </Link>
                              </div>
                            ))}
                          </div>
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

          {/* Quiz Action Button */}
          {currentLesson.questions?.length > 0 && (
            <button
              onClick={openQuiz}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl text-black font-bold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: journeyColor }}
            >
              <HelpCircle size={16} /> Verify Your Understanding
            </button>
          )}
        </main>
      </div>

      {/* 📍 Single Question Quiz Modal */}
      {isQuizOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121418] border border-white/10 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle size={16} style={{ color: journeyColor }} /> Verify
                & Complete
              </h3>
              <button
                onClick={() => setIsQuizOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {!quizSubmitted ? (
              <div className="flex flex-col gap-4">
                {(() => {
                  const questions = currentLesson.questions || [];
                  const q = questions[currentQuestionIndex];
                  if (!q) return null;

                  const isLast = currentQuestionIndex === questions.length - 1;
                  const selectedOpt = quizAnswers[q.id];

                  return (
                    <>
                      {/* Step / Progress Header */}
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                          style={{
                            color: journeyColor,
                            backgroundColor: `${journeyColor}20`,
                          }}
                        >
                          Question {currentQuestionIndex + 1} of{" "}
                          {questions.length}
                        </span>

                        {/* Progress Dots */}
                        <div className="flex items-center gap-1.5">
                          {questions.map((_, idx) => (
                            <div
                              key={idx}
                              className="h-1.5 rounded-full transition-all duration-300"
                              style={{
                                width:
                                  idx === currentQuestionIndex ? "18px" : "6px",
                                backgroundColor:
                                  idx === currentQuestionIndex
                                    ? journeyColor
                                    : "rgba(255,255,255,0.2)",
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Single Question Box */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
                        <h4 className="text-sm font-semibold text-white leading-snug">
                          {t(q.question)}
                        </h4>

                        {/* Options */}
                        <div className="flex flex-col gap-2 mt-1">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedOpt === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() =>
                                  setQuizAnswers({
                                    ...quizAnswers,
                                    [q.id]: oIdx,
                                  })
                                }
                                className="p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between"
                                style={
                                  isSelected
                                    ? {
                                        borderColor: journeyColor,
                                        backgroundColor: `${journeyColor}20`,
                                        color: "#ffffff",
                                        fontWeight: "600",
                                      }
                                    : {
                                        borderColor: "rgba(255, 255, 255, 0.1)",
                                        backgroundColor:
                                          "rgba(24, 27, 32, 0.8)",
                                        color: "#d1d5db",
                                      }
                                }
                              >
                                <span>{t(opt)}</span>
                                {isSelected && (
                                  <CheckCircle2
                                    size={16}
                                    style={{ color: journeyColor }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom Navigation Buttons */}
                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/10">
                        <button
                          onClick={() =>
                            setCurrentQuestionIndex((prev) =>
                              Math.max(0, prev - 1),
                            )
                          }
                          disabled={currentQuestionIndex === 0}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft size={16} /> Previous
                        </button>

                        {isLast ? (
                          <button
                            onClick={handleVerify}
                            disabled={selectedOpt === undefined}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ backgroundColor: journeyColor }}
                          >
                            <span>Submit Answers</span>
                            <CheckCircle2 size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setCurrentQuestionIndex((prev) =>
                                Math.min(questions.length - 1, prev + 1),
                              )
                            }
                            disabled={selectedOpt === undefined}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ backgroundColor: journeyColor }}
                          >
                            <span>Next Question</span>
                            <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : wasCorrect ? (
              <div className="py-8 text-center">
                <p className="text-3xl mb-2">🎉</p>
                <p
                  className="font-bold text-sm"
                  style={{ color: journeyColor }}
                >
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
