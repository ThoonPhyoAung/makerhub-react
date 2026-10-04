import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Play,
  HelpCircle,
  X,
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Lock,
  LogIn,
} from "lucide-react";

import { useAlert } from "../../../context/AlertContext";
import { useFetch } from "../../../hooks/useFetch";
import { getLessonBySlug } from "../../../api/lessonsApi";
import { getJourneyById } from "../../../api/journeysApi";
import LearningBreadcrumb from "../components/LearningBreadcrumb";

// Redux & Service Functions
import { updateUserProgress } from "../../../features/auth/authSlice";
import { completeLessonLogic } from "../../../api/userService";

const CONFETTI_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#a855f7"];

function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
}

// 📍 Code Block အတွက် သီးသန့် Sub-Component (PostDetails.jsx ပုံစံအတိုင်း ရေးသားထားပါသည်)
function CodeBlock({ codeValue, language, bIdx, copiedCodeIndex, handleCopy }) {
  const codeRef = useRef(null);

  useEffect(() => {
    if (window.hljs && codeRef.current && codeValue) {
      const result = window.hljs.highlightAuto(codeValue);
      codeRef.current.innerHTML = result.value;
    }
  }, [codeValue]);

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#08090b]">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 text-xs text-gray-400 font-mono">
        <span>{language || "C++"}</span>
        <button
          onClick={() => handleCopy(codeValue, bIdx)}
          className="flex items-center gap-1 hover:text-white"
        >
          {copiedCodeIndex === bIdx ? (
            <Check size={12} className="text-emerald-400" />
          ) : (
            <Copy size={12} />
          )}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
        <code ref={codeRef} className="hljs" />
      </pre>
    </div>
  );
}

function LessonDetailPage() {
  const { journeyId, chapterId, lessonSlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 📍 Marketplace သို့ တိုက်ရိုက် ရှာဖွေနိုင်ရန် Route Navigation
  const handleMarketplaceSearch = (itemName) => {
    navigate("/marketplace", {
      state: { initialSearch: itemName },
    });
  };

  // 📍 Safe Alert Context Call
  const alertContext = useAlert();
  const showAlert = (message, type = "info") => {
    if (typeof alertContext === "function") {
      alertContext(message);
    } else if (alertContext?.showAlert) {
      alertContext.showAlert({ message, type });
    } else {
      window.alert(message);
    }
  };

  // 📍 1. Redux Store & User State
  const activeUser = useSelector((state) => state.auth.user);

  // User Mode (Learner vs Pro)
  const [userMode] = useState(() => {
    return localStorage.getItem("userMode") || "learner";
  });
  const isPro = userMode === "pro";

  // 📍 2. Fetch Journey & Lesson Data
  const journeyFetchFn = useMemo(
    () => () => getJourneyById(journeyId),
    [journeyId],
  );
  const { data: journey } = useFetch(journeyFetchFn, [journeyFetchFn]);
  const journeyColor = journey?.color || "#10b981";

  const fetchFn = useMemo(
    () => () => getLessonBySlug(lessonSlug),
    [lessonSlug],
  );
  const { data: currentLesson, loading, error } = useFetch(fetchFn, [fetchFn]);

  // 📍 3. Lesson Total XP Calculation
  const totalLessonXp = useMemo(() => {
    if (!currentLesson?.questions || currentLesson.questions.length === 0) {
      return currentLesson?.xpReward || currentLesson?.xp || 20;
    }
    return currentLesson.questions.reduce(
      (sum, q) => sum + Number(q.xp || q.xpReward || 10),
      0,
    );
  }, [currentLesson]);

  // 📍 Dynamic ID Check for Completed Status
  const isAlreadyCompleted = useMemo(() => {
    if (!currentLesson || !activeUser) return false;
    const currentLessonId = String(currentLesson.id || currentLesson._id || "");
    const completedList = (activeUser.completedLessons || []).map((item) =>
      String(typeof item === "object" ? item.id || item._id : item),
    );
    return completedList.includes(currentLessonId);
  }, [currentLesson, activeUser]);

  const [activeSectionId, setActiveSectionId] = useState("");
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  // 📍 Quiz Modal States
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
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
    if (!field) return "";
    if (typeof field === "string") return field;
    return field?.[language] ?? field?.en ?? field?.mm ?? "";
  };

  const lessonSections = useMemo(() => {
    if (!currentLesson) return [];
    return (currentLesson.sections || []).map((s, idx) => ({
      id: s.id || `section-${idx}`,
      label: s.label || `Section ${idx + 1}`,
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
    if (isPro) {
      showAlert(
        "Pro Mode တွင် လေ့လာကြည့်ခွင့်သာ ရပါမည်။ Quiz ဖြေဆိုပြီး XP ရယူရန် Learner Mode သို့ ပြောင်းပါ။",
        "warning",
      );
      return;
    }

    if (!activeUser) {
      showAlert(
        "⚠️ Quiz ဖြေဆိုပြီး XP ရယူရန် ကျေးဇူးပြု၍ Login ဝင်ပေးပါ!",
        "warning",
      );
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    if (isAlreadyCompleted) {
      showAlert("✅ သင်သည် ဤ Lesson ၏ Quiz ကို ဖြေဆိုပြီးဖြစ်ပါသည်!", "info");
      return;
    }

    setQuizAnswers({});
    setQuizSubmitted(false);
    setCurrentQuestionIndex(0);
    setEarnedXp(0);
    setCorrectCount(0);
    setIsQuizOpen(true);
  };

  const handleVerify = () => {
    const questions = currentLesson.questions || [];
    let calculatedXp = 0;
    let correct = 0;

    questions.forEach((q, index) => {
      const qKey = q.id || `q_${index}`;
      const selectedOption = quizAnswers[qKey];

      if (selectedOption === q.correctIndex) {
        correct++;
        calculatedXp += Number(q.xp || q.xpReward || 10);
      }
    });

    setEarnedXp(calculatedXp);
    setCorrectCount(correct);
    setQuizSubmitted(true);

    const lessonId = currentLesson.id || currentLesson._id;

    if (calculatedXp > 0 && activeUser && !isAlreadyCompleted && !isPro) {
      const updatedUserData = completeLessonLogic({
        currentUser: activeUser,
        lessonId: lessonId,
        chapterId: chapterId,
        journeyId: journeyId,
        earnedXp: calculatedXp,
      });

      if (updatedUserData) {
        dispatch(updateUserProgress(updatedUserData));
      }

      setShowConfetti(true);
      showAlert(`🎉 Great job! Earned +${calculatedXp} XP`, "success");
      setTimeout(() => setShowConfetti(false), 3500);
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
        xp={totalLessonXp}
        isCompleted={isAlreadyCompleted}
        language={language}
        onToggleLanguage={toggleLanguage}
        isPro={isPro}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
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
                  disabled={isAlreadyCompleted || isPro}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all mt-2 flex items-center justify-between ${
                    isAlreadyCompleted || isPro
                      ? "opacity-60 cursor-not-allowed bg-white/5 border border-white/10 text-gray-400"
                      : ""
                  }`}
                  style={
                    !isAlreadyCompleted && !isPro
                      ? {
                          color: journeyColor,
                          backgroundColor: `${journeyColor}15`,
                          border: `1px solid ${journeyColor}40`,
                        }
                      : undefined
                  }
                >
                  <span className="flex items-center gap-1.5">
                    {isAlreadyCompleted ? (
                      <CheckCircle2 size={13} className="text-emerald-400" />
                    ) : isPro ? (
                      <Lock size={13} className="text-amber-400" />
                    ) : !activeUser ? (
                      <Lock size={13} />
                    ) : (
                      <HelpCircle size={13} />
                    )}
                    {isAlreadyCompleted
                      ? "Quiz Completed"
                      : isPro
                        ? "Pro Mode (Read Only)"
                        : !activeUser
                          ? "Login to Quiz"
                          : "Verify & Quiz"}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10">
                    {currentLesson.questions.length}
                  </span>
                </button>
              )}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0 order-1 lg:order-2 space-y-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              {t(currentLesson.title)}
            </h1>
            <p className="text-gray-300 text-sm mb-6">
              {t(currentLesson.description)}
            </p>
            {currentLesson.coverImage && (
              <div className="overflow-hidden mb-6">
                <img
                  src={currentLesson.coverImage}
                  alt={t(currentLesson.title)}
                  className="w-full h-auto object-contain object-left max-h-[400px]"
                />
              </div>
            )}
          </div>

          {lessonSections.map((section) => (
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

                  // 📍code with color
                  if (block.type === "code") {
                    return (
                      <CodeBlock
                        key={bIdx}
                        codeValue={block.value}
                        language={block.language}
                        bIdx={bIdx}
                        copiedCodeIndex={copiedCodeIndex}
                        handleCopy={handleCopy}
                      />
                    );
                  }

                  if (block.type === "image") {
                    return (
                      <div key={bIdx} className="my-2">
                        <div className="rounded-xl overflow-hidden bg-black/20">
                          <img
                            src={block.url}
                            alt={t(block.caption) || "Lesson detail"}
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

                  // 📍 Marketplace Component Block
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
                              className="p-3 rounded-xl bg-[#08090b] border border-white/10 flex items-center justify-between hover:border-rose-500/30 transition-all gap-3"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Component Image ရှိပါက ပြသမည် */}
                                {comp.image && (
                                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                    <img
                                      src={comp.image}
                                      alt={comp.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}

                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-semibold text-white truncate">
                                    {comp.name}
                                  </span>
                                  {comp.qty && (
                                    <span className="text-[10px] text-rose-400 font-mono font-bold mt-0.5">
                                      {comp.qty}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() =>
                                  handleMarketplaceSearch(comp.name)
                                }
                                className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 hover:underline shrink-0 ml-2 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-lg transition-colors"
                                title={`Find ${comp.name} in Marketplace`}
                              >
                                Buy <ExternalLink size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </section>
          ))}

          {currentLesson.questions?.length > 0 && (
            <button
              onClick={openQuiz}
              disabled={isAlreadyCompleted}
              className={`flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                isAlreadyCompleted
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                  : isPro
                    ? "bg-white/10 text-gray-400 border border-white/10 cursor-not-allowed"
                    : "text-black hover:opacity-90"
              }`}
              style={
                !isAlreadyCompleted && !isPro
                  ? { backgroundColor: journeyColor }
                  : undefined
              }
            >
              {isAlreadyCompleted ? (
                <>
                  <CheckCircle2 size={16} /> Completed (Quiz Locked)
                </>
              ) : isPro ? (
                <>
                  <Lock size={16} /> Pro Mode (Read Only Mode)
                </>
              ) : !activeUser ? (
                <>
                  <LogIn size={16} /> Log in to Answer Questions
                </>
              ) : (
                <>
                  <HelpCircle size={16} /> Verify Your Understanding
                </>
              )}
            </button>
          )}
        </main>
      </div>

      {/* Quiz Modal */}
      {isQuizOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121418] border border-white/10 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl">
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

                  const qKey = q.id || `q_${currentQuestionIndex}`;
                  const isLast = currentQuestionIndex === questions.length - 1;
                  const selectedOpt = quizAnswers[qKey];
                  const questionXp = q.xp || q.xpReward || 10;

                  return (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                          style={{
                            color: journeyColor,
                            backgroundColor: `${journeyColor}20`,
                          }}
                        >
                          Question {currentQuestionIndex + 1} of{" "}
                          {questions.length}
                        </span>

                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          <Zap size={11} className="fill-amber-400" /> +
                          {questionXp} XP
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
                        <h4 className="text-sm font-semibold text-white leading-snug">
                          {t(q.question)}
                        </h4>

                        <div className="flex flex-col gap-2 mt-1">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedOpt === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() =>
                                  setQuizAnswers({
                                    ...quizAnswers,
                                    [qKey]: oIdx,
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
            ) : (
              <div className="py-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    Quiz Completed!
                  </h4>
                  <p className="text-gray-400 text-xs mt-1">
                    You answered {correctCount} of{" "}
                    {currentLesson.questions?.length} correctly.
                  </p>
                </div>

                <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-sm flex items-center gap-1.5 my-1">
                  <Zap size={16} className="fill-amber-400" /> +{earnedXp} XP
                  Earned
                </div>

                <button
                  onClick={() => setIsQuizOpen(false)}
                  className="w-full mt-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
                >
                  Close & Continue
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
