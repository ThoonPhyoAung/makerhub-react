import React from "react";
import { HelpCircle, X, Zap, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

function LessonQuizModal({
  isOpen,
  onClose,
  journeyColor,
  quizSubmitted,
  currentLesson,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  quizAnswers,
  setQuizAnswers,
  handleVerify,
  correctCount,
  earnedXp,
  t,
}) {
  if (!isOpen) return null;

  const questions = currentLesson?.questions || [];
  const q = questions[currentQuestionIndex];
  const qKey = q?.id || `q_${currentQuestionIndex}`;
  const isLast = currentQuestionIndex === questions.length - 1;
  const selectedOpt = quizAnswers[qKey];
  const questionXp = q?.xp || q?.xpReward || 10;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121418] border border-white/10 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle size={16} style={{ color: journeyColor }} /> Verify & Complete
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {!quizSubmitted ? (
          <div className="flex flex-col gap-4">
            {q && (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                    style={{
                      color: journeyColor,
                      backgroundColor: `${journeyColor}20`,
                    }}
                  >
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>

                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    <Zap size={11} className="fill-amber-400" /> +{questionXp} XP
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
                                  backgroundColor: "rgba(24, 27, 32, 0.8)",
                                  color: "#d1d5db",
                                }
                          }
                        >
                          <span>{t(opt)}</span>
                          {isSelected && (
                            <CheckCircle2 size={16} style={{ color: journeyColor }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/10">
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
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
                          Math.min(questions.length - 1, prev + 1)
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
            )}
          </div>
        ) : (
          <div className="py-6 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Quiz Completed!</h4>
              <p className="text-gray-400 text-xs mt-1">
                You answered {correctCount} of {questions.length} correctly.
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-sm flex items-center gap-1.5 my-1">
              <Zap size={16} className="fill-amber-400" /> +{earnedXp} XP Earned
            </div>

            <button
              onClick={onClose}
              className="w-full mt-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              Close & Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonQuizModal;