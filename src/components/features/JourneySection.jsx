import {
  Infinity as InfinityIcon,
  Wifi,
  Server,
  Cpu,
  BookOpen,
  Users,
  Star,
  ChevronRight,
} from "lucide-react";

function JourneySection() {
  const journeys = [
    {
      id: "arduino",
      icon: InfinityIcon,
      title: "Arduino Journey",
      badge: "Beginner",
      desc: "Master Arduino programming from LED blinking to advanced robotics projects.",
      lessons: "0 lessons",
      students: "2.3k",
      xp: "0 XP",
      progress: 0,
      color: "#3b82f6",
      colorBg: "rgba(59,130,246,0.15)",
      image: "/assets/arduinouno.png",
      link: "/learning/arduino",
    },
    {
      id: "esp32",
      icon: Wifi,
      title: "ESP32 Journey",
      badge: "Intermediate",
      desc: "Build WiFi & Bluetooth IoT devices with the powerful ESP32 microcontroller.",
      lessons: "0 lessons",
      students: "1.8k",
      xp: "0 XP",
      progress: 0,
      color: "#a855f7",
      colorBg: "rgba(168,85,247,0.15)",
      image: "/assets/esp32.png",
      link: "/learning/esp32",
    },
    {
      id: "esp8266",
      icon: Server,
      title: "ESP8266 Journey",
      badge: "Beginner",
      desc: "Create smart home projects and web-connected sensors with the affordable ESP8266.",
      lessons: "0 lessons",
      students: "2.1k",
      xp: "0 XP",
      progress: 0,
      color: "#f97316",
      colorBg: "rgba(249,115,22,0.15)",
      image: "/assets/esp8266.png",
      link: "/learning/esp8266",
    },
    {
      id: "raspberrypi",
      icon: Cpu,
      title: "Raspberry Pi Journey",
      badge: "Advanced",
      desc: "Transform ideas into reality with the versatile Raspberry Pi single-board computer.",
      lessons: "0 lessons",
      students: "1.5k",
      xp: "0 XP",
      progress: 0,
      color: "#22c55e",
      colorBg: "rgba(34,197,94,0.15)",
      image: "/assets/raspberrypi.png",
      link: "/learning/raspberrypi",
    },
  ];

  return (
    <section id="journeys" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-text text-3xl font-extrabold mb-3">
          Choose your learning journey
        </h2>
        <p className="text-text-muted text-lg max-w-xl mx-auto">
          Select your path and start building. Progress and XP await!
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-6">
        {journeys.map((j) => {
          const Icon = j.icon;
          return (
            <div
              key={j.id}
              className="bg-bg-elevated border border-white/5 rounded-3xl p-6 hover:-translate-y-1 hover:border-white/15 transition-all duration-300"
            >
              {/* Header: icon + badge */}
              <div className="flex justify-between items-start mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: j.colorBg, color: j.color }}
                >
                  <Icon size={22} />
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: j.colorBg,
                    color: j.color,
                    border: `1px solid ${j.color}33`,
                  }}
                >
                  {j.badge}
                </span>
              </div>

              {/* Body: text + photo */}
              <div className="flex justify-between items-start gap-4 mb-5">
                <div className="flex-1">
                  <h3 className="text-text text-xl font-bold mb-2">
                    {j.title}
                  </h3>
                  <p className="hidden md:block text-text-muted text-sm leading-relaxed mb-3">
                    {j.desc}
                  </p>
                  <div className="flex gap-4 text-text-muted text-sm">
                    <span className="flex items-center gap-1">
                      <BookOpen size={13} /> {j.lessons}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={13} /> {j.students}
                    </span>
                  </div>
                </div>
                <div className="w-[140px] h-[110px] rounded-xl overflow-hidden shrink-0">
                  <img
                    src={j.image}
                    alt={j.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>

              {/* Footer: progress + continue */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-muted">Progress</span>
                  <span className="text-text-muted">{j.progress}%</span>
                </div>
                <div className="h-1.5 bg-bg-subtle border border-border-muted rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${j.progress}%`,
                      backgroundColor: j.color,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="flex items-center gap-1 text-sm font-semibold"
                    style={{ color: j.color }}
                  >
                    <Star size={13} /> {j.xp}
                  </span>
                  <a
                    href={j.link}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: j.color, color: j.color }}
                  >
                    Continue <ChevronRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default JourneySection;
