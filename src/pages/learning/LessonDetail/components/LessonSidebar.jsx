import React from "react";
import { CheckCircle2, Lock, HelpCircle } from "lucide-react";

function LessonSidebar({
  lessonSections,
  activeSectionId,
  scrollToSection,
  journeyColor,
  currentLesson,
  openQuiz,
  isAlreadyCompleted,
  isPro,
  activeUser,
  t,
}) {
  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-39">
        <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3 px-1">
          Table Of Contents
        </h3>
        <nav className="flex flex-col gap-1">
          {lessonSections.map((sec) => {
            const active = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 font-medium cursor-pointer ${
                  active
                    ? "shadow-sm font-semibold"
                    : "text-text-muted hover:text-text hover:bg-bg-subtle"
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

          {currentLesson?.questions?.length > 0 && (
            <button
              onClick={openQuiz}
              disabled={isAlreadyCompleted || isPro}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all mt-2 flex items-center justify-between shadow-sm cursor-pointer ${
                isAlreadyCompleted || isPro
                  ? "opacity-60 cursor-not-allowed bg-bg-subtle border border-border text-text-muted"
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
                  <CheckCircle2 size={13} className="text-emerald-500 dark:text-emerald-400" />
                ) : isPro ? (
                  <Lock size={13} className="text-amber-500 dark:text-amber-400" />
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
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-bg-subtle border border-border text-text-muted">
                {currentLesson.questions.length}
              </span>
            </button>
          )}
        </nav>
      </div>
    </aside>
  );
}

export default LessonSidebar;