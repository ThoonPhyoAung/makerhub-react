import React from "react";
import { Zap, GraduationCap } from "lucide-react";

function LearnerProToggle({
  mode = "learner",
  onChange,
  activeColor = "#10b981",
}) {
  const isPro = mode === "pro";

  return (
    <div className="flex bg-[#1a1d24] p-1 rounded-full border border-white/10">
      <button
        type="button"
        onClick={() => onChange("learner")}
        className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all ${
          !isPro ? "text-black shadow-md" : "text-gray-400 hover:text-white"
        }`}
        style={{ backgroundColor: !isPro ? activeColor : "transparent" }}
      >
        <GraduationCap size={15} />
        Learner Mode
      </button>

      <button
        type="button"
        onClick={() => onChange("pro")}
        className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all ${
          isPro ? "text-black shadow-md" : "text-gray-400 hover:text-white"
        }`}
        style={{ backgroundColor: isPro ? activeColor : "transparent" }}
      >
        <Zap size={14} fill={isPro ? "black" : "none"} />
        Pro Mode
      </button>
    </div>
  );
}

export default LearnerProToggle;
