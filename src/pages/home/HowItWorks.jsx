import { ListChecks, Code2, Trophy } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      icon: ListChecks,
      title: "Choose Your Journey",
      text: "pick Arduino, ESP32, ESP8266 or Raspberry Pi",
    },
    {
      icon: Code2,
      title: "Learn & Build",
      text: "follow interactive lessons and build real projects",
    },
    {
      icon: Trophy,
      title: "Earn XP & Badges",
      text: "level up and showcase your achievements",
    },
  ];

  return (
    <section className="py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-text text-3xl font-extrabold mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="group">
                <div className="w-15 h-15 mx-auto mb-6 rounded-2xl bg-primary/15 text-primary shadow-[inset_0_0_15px_rgba(13,148,136,0.3)] flex items-center justify-center w-[60px] h-[60px] group-hover:-translate-y-1 transition-transform">
                  <Icon size={26} />
                </div>
                <h4 className="text-text font-bold text-lg mb-2">
                  {step.title}
                </h4>
                <p className="text-text-muted text-sm max-w-[200px] mx-auto leading-relaxed">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
