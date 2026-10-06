import React from "react";

const CONFETTI_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#a855f7"];

function ConfettiBurst() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 0.4,
    duration: 2.5 + Math.random() * 1.5,
  }));

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

export default ConfettiBurst;
