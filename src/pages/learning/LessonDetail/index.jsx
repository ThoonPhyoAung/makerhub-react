import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CheckCircle2,
  Play,
  HelpCircle,
  ShoppingBag,
  ExternalLink,
  Lock,
  LogIn,
  Cpu,
  Download,
} from "lucide-react";

import { useAlert } from "../../../context/AlertContext";
import { useFetch } from "../../../hooks/useFetch";
import { getLessons, getLessonBySlug } from "../../../api/lessonsApi";
import { getJourneyById } from "../../../api/journeysApi";
import LearningBreadcrumb from "../components/LearningBreadcrumb";

import { updateUserProgress } from "../../../features/auth/authSlice";
import { completeLessonLogic } from "../../../api/userService";

// Sub-components
import CodeBlock from "./components/CodeBlock";
import LessonSidebar from "./components/LessonSidebar";
import LessonQuizModal from "./components/LessonQuizModal";
import ConfettiBurst from "./components/ConfettiBurst";

// for YouTube embed URL extraction
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
  // getting journeyId, chapterId, and lessonSlug from the URL
  const { journeyId, chapterId, lessonSlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux dispatch for updating user progress

  // able to directly search at marketplace
  const handleMarketplaceSearch = (itemName) => {
    navigate("/marketplace", { state: { initialSearch: itemName } });
  };

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

  const activeUser = useSelector((state) => state.auth.user);
  const [userMode] = useState(
    () => localStorage.getItem("userMode") || "learner",
  );
  const isPro = userMode === "pro";

  // -------------------------------------------------------------
  // Data Fetching Fix using useMemo (Stable Function References)
  // -------------------------------------------------------------
  const fetchJourney = useMemo(
    () => () => getJourneyById(journeyId),
    [journeyId],
  );

  const fetchLesson = useMemo(
    () => () => getLessonBySlug(lessonSlug),
    [lessonSlug],
  );

  const fetchTotalLessons = useMemo(() => () => getLessons(), []);

  const { data: journey } = useFetch(fetchJourney);
  const { data: currentLesson, loading, error } = useFetch(fetchLesson);
  const { data: totalLessonsData } = useFetch(fetchTotalLessons);

  const journeyColor = journey?.color || "#10b981";
  const totalLessonsCount = Array.isArray(totalLessonsData)
    ? totalLessonsData.length
    : 0;

  // Total XP Calculation
  let totalLessonXp = 20;
  if (currentLesson?.questions && currentLesson.questions.length > 0) {
    totalLessonXp = currentLesson.questions.reduce(
      (sum, q) => sum + Number(q.xp || q.xpReward || 10),
      0,
    );
  } else if (currentLesson) {
    totalLessonXp = currentLesson.xpReward || currentLesson.xp || 20;
  }

  // Completed Status Check
  let isAlreadyCompleted = false;
  if (currentLesson && activeUser) {
    const currentLessonId = String(currentLesson.id || currentLesson._id || "");
    const completedList = (activeUser.completedLessons || []).map((item) =>
      String(typeof item === "object" ? item.id || item._id : item),
    );
    isAlreadyCompleted = completedList.includes(currentLessonId);
  }

  const [activeSectionId, setActiveSectionId] = useState("");
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  // Quiz States
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Language
  const [language, setLanguage] = useState(
    () => localStorage.getItem("lang") || "en",
  );

  const toggleLanguage = () => {
    const next = language === "en" ? "mm" : "en";
    setLanguage(next);
    localStorage.setItem("lang", next);
  };

  // change language of content by this function
  const t = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field?.[language] ?? field?.en ?? field?.mm ?? "";
  };

  // Section Formatting
  const lessonSections = currentLesson
    ? (currentLesson.sections || []).map((s, idx) => ({
        id: s.id || `section-${idx}`,
        label: s.label || `Section ${idx + 1}`,
        blocks: s.blocks || [],
      }))
    : [];

  // --- SCROLLSPY LOGIC (Window Scroll Event Based) ---
  useEffect(() => {
    if (!currentLesson || lessonSections.length === 0) return;

    const handleScroll = () => {
      // section- စာလုံးပါသော id ရှိသည့် section element များကို ရှာယူခြင်း
      const sectionElements = document.querySelectorAll("[id^='section-']");
      const scrollPosition = window.scrollY + 200; // Offset allowance

      // စာမျက်နှာ၏ အောက်ဆုံး (Bottom) ရောက်မရောက် စစ်ဆေးခြင်း
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;

      if (isAtBottom && sectionElements.length > 0) {
        const lastSection = sectionElements[sectionElements.length - 1];
        const sectionId = lastSection.id.replace("section-", "");
        setActiveSectionId(sectionId);
        return;
      }

      // တည်နေရာအလိုက် Active Section ခွဲခြားခြင်း
      sectionElements.forEach((el) => {
        const top = el.offsetTop;
        const height = el.offsetHeight;

        if (scrollPosition >= top && scrollPosition < top + height) {
          const sectionId = el.id.replace("section-", "");
          setActiveSectionId(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Page စတင် load လျှင် သို့မဟုတ် Lesson ပြောင်းသွားလျှင် ချက်ချင်း တစ်ကြိမ် စစ်ဆေးပေးရန်
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentLesson, lessonSections]);

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
      showAlert("Pro Mode တွင် လေ့လာကြည့်ခွင့်သာ ရပါမည်။", "warning");
      return;
    }
    if (!activeUser) {
      showAlert("⚠️ Quiz ဖြေဆိုပြီး XP ရယူရန် Login ဝင်ပေးပါ!", "warning");
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

    if (questions.length > 0) {
      questions.forEach((q, index) => {
        const qKey = q.id || `q_${index}`;
        if (quizAnswers[qKey] === q.correctIndex) {
          correct++;
          calculatedXp += Number(q.xp || q.xpReward || 10);
        }
      });
    } else {
      calculatedXp = Number(currentLesson.xpReward || currentLesson.xp || 20);
    }

    setEarnedXp(calculatedXp);
    setCorrectCount(correct);
    setQuizSubmitted(true);

    const lessonId = String(currentLesson.id || currentLesson._id);

    if (activeUser && !isAlreadyCompleted && !isPro) {
      const updatedUserData = completeLessonLogic({
        currentUser: activeUser,
        lessonId,
        chapterId,
        journeyId,
        earnedXp: calculatedXp,
        totalPlatformLessonsCount: totalLessonsCount,
      });

      if (updatedUserData) dispatch(updateUserProgress(updatedUserData));

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
        <LessonSidebar
          lessonSections={lessonSections}
          activeSectionId={activeSectionId}
          scrollToSection={scrollToSection}
          journeyColor={journeyColor}
          currentLesson={currentLesson}
          openQuiz={openQuiz}
          isAlreadyCompleted={isAlreadyCompleted}
          isPro={isPro}
          activeUser={activeUser}
          t={t}
        />

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
                    return (
                      <div
                        key={bIdx}
                        className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 my-2 bg-black/40"
                      >
                        <iframe
                          src={getYouTubeEmbedUrl(block.url)}
                          title="Lesson Video"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    );
                  }

                  if (block.type === "simulator") {
                    const simulatorUrl =
                      block.url || `https://wokwi.com/projects/${block.id}`;
                    return (
                      <div key={bIdx} className="my-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
                            <Play size={14} /> Interactive Simulator
                          </div>
                          {simulatorUrl && (
                            <a
                              href={simulatorUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium hover:underline transition-all"
                            >
                              Visit original page <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        <div className="w-full h-[500px] sm:h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-[#08090b] shadow-2xl">
                          <iframe
                            src={`https://wokwi.com/projects/${block.id}?embed=1`}
                            title="Wokwi Simulator"
                            className="w-full h-full border-0"
                            allow="autoplay"
                          />
                        </div>
                      </div>
                    );
                  }

                  if (block.type === "software") {
                    return (
                      <div
                        key={bIdx}
                        className="my-3 p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                            <Cpu size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">
                                {t(block.name || block.softwareName)}
                              </h4>
                              {(block.softwareType || block.software_type) && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  {t(block.softwareType || block.software_type)}
                                </span>
                              )}
                            </div>
                            {block.description && (
                              <p className="text-xs text-gray-400 mt-1">
                                {t(block.description)}
                              </p>
                            )}
                          </div>
                        </div>

                        {(block.link || block.url) && (
                          <a
                            href={block.link || block.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shrink-0"
                          >
                            <Download size={14} /> Get Software{" "}
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    );
                  }

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

      <LessonQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        journeyColor={journeyColor}
        quizSubmitted={quizSubmitted}
        currentLesson={currentLesson}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        quizAnswers={quizAnswers}
        setQuizAnswers={setQuizAnswers}
        handleVerify={handleVerify}
        correctCount={correctCount}
        earnedXp={earnedXp}
        t={t}
      />
    </div>
  );
}

export default LessonDetailPage;
