import {
  Rocket,
  ArrowRight,
  Star,
  Flame,
  TrendingUp,
  Wifi,
  Code,
  CodeXml,
  Cpu,
} from "lucide-react";

function HeroSection() {
  const streakDays = ["M", "T", "W", "T", "F", "S", "S"];
  const activeDays = 4; 

  return (
    <section className="relative bg-bg overflow-hidden py-16 lg:py-14 min-h-[100vh] flex items-center">
      {/* Background grid pattern - CSS ထဲက ::before ကို inline style နဲ့ ပြန်ဆောက်တာ */}
      <div
        className="absolute inset-0 opacity-100 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      {/* Green ambient glow */}
      <div className="absolute top-1/3 right-[10%] w-[480px] h-[480px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-start w-full">
        {/* LEFT COLUMN */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full px-3.5 py-1.5 text-xs font-bold mb-6">
            <Rocket size={13} className="text-amber-400" />
            #1 IoT Learning Platform in Myanmar
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-text mb-4">
            Learn{" "}
            <span className="text-primary drop-shadow-[0_0_40px_rgba(34,197,94,0.25)]">
              Arduino
            </span>{" "}
            & <br />
            <span className="text-purple-400 drop-shadow-[0_0_40px_rgba(139,92,246,0.25)]">
              IoT
            </span>{" "}
            in Myanmar
          </h1>

          {/* Lead text */}
          <p className="text-text-muted max-w-md leading-relaxed mb-9">
            Interactive learning journeys for future makers and developers.
            Build real-world hardware projects from scratch.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mb-12">
            <a
              href="/learning/arduino"
              className="inline-flex items-center gap-1.5 bg-primary text-[#052010] font-extrabold text-sm px-6 py-2.5 rounded-lg hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(34,197,94,0.3)] transition-all"
            >
              Start Learning <ArrowRight size={16} />
            </a>
            <a
              href="#journeys"
              className="inline-flex items-center bg-bg-subtle text-text-muted font-bold text-sm px-6 py-2.5 rounded-lg border border-purple-400 hover:text-white hover:bg-purple-900/20 transition-all"
            >
              Explore Journeys
            </a>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-3">
            {/* XP Card */}
            <div className="bg-bg-elevated border border-border rounded-2xl p-4 min-h-[150px] hover:border-surface-2 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-amber-400" />
                <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">
                  XP Points
                </span>
              </div>
              <div className="mb-3">
                <span className="text-amber-400 text-2xl font-extrabold tracking-tight">
                  0
                </span>
                <span className="text-text-subtle text-xs font-medium">
                  {" "}
                  / 10,000
                </span>
              </div>
              <div className="h-[5px] bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
                  style={{ width: "0%" }}
                />
              </div>
            </div>

            {/* Streak Card */}
            <div className="bg-bg-elevated border border-border rounded-2xl p-4 min-h-[150px] hover:border-surface-2 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={16} className="text-amber-400" />
                <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">
                  Daily Streak
                </span>
              </div>
              <div className="text-amber-400 text-2xl font-extrabold tracking-tight mb-3">
                0 Days
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {streakDays.map((_, i) => (
                    <div
                      key={i}
                      className={`w-[13px] h-[13px] rounded-sm ${i < activeDays ? "bg-primary" : "bg-surface"}`}
                    />
                  ))}
                </div>
                <div className="flex gap-1 text-[10px] text-text-subtle">
                  {streakDays.map((day, i) => (
                    <span key={i} className="w-[13px] text-center">
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-bg-elevated border border-border rounded-2xl p-4 min-h-[150px] hover:border-surface-2 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-cyan-400" />
                <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">
                  Progress
                </span>
              </div>
              <div className="text-cyan-400 text-2xl font-extrabold mb-1">
                0%
              </div>
              <div className="text-text-muted text-xs mb-3">
                Journey Completion
              </div>
              <div className="h-[5px] bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Floating Hardware (Static for now, animation later) */}
        <div className="hidden lg:flex relative h-[460px] items-center justify-center">
          <img
            src="/assets/arduinouno.png"
            alt="Arduino"
            className="absolute w-[58%] right-[-10%]  z-10 drop-shadow-[0_24px_48px_rgba(0,0,0,0.7)] animate-float"
          />
          <img
            src="/assets/esp32.png"
            alt="ESP32"
            className="absolute w-[32%] top-0 right-[40%] top-[10%] -rotate-6 z-[9] drop-shadow-[0_24px_48px_rgba(0,0,0,0.7)] animate-float"
            style={{ animationDelay: "1.5s" }}
          />
          <img
            src="/assets/raspberry-pi-hero.png"
            alt="Raspberry Pi"
            className="absolute w-[52%] bottom-[10%] left-0 rotate-6 z-[11] drop-shadow-[0_24px_48px_rgba(0,0,0,0.7)] animate-float"
            style={{ animationDelay: "3s" }}
          />
          <Wifi
            size={40}
            className="absolute top-0 right-[25%] text-primary opacity-50 animate-pulse-icon"
          />
          <CodeXml
            size={40}
            className="absolute top-[30%] left-[15%] text-purple-400 opacity-50 animate-pulse-icon"
          />
          <Cpu
            size={40}
            className="absolute bottom-[8%] right-[20%] text-primary opacity-50 animate-pulse-icon"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
