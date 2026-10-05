import { Users, Cpu, ShoppingBag, Layers, Star } from "lucide-react";

function StatsRibbon({ customStats }) {
  // 📍 Backend API မပါသေးမီ သို့မဟုတ် Props မလာပါက အသုံးပြုမည့် Default Data
  const defaultStats = [
    {
      id: "statLearners",
      value: "500+",
      label: "Active Learners",
      icon: Users,
      color: "text-emerald-400",
    },
    {
      id: "statProjects",
      value: "1,200+",
      label: "Projects Built",
      icon: Cpu,
      color: "text-purple-400",
    },
    {
      id: "statSaleItems",
      value: "45+",
      label: "IoT Modules & Kits",
      icon: ShoppingBag,
      color: "text-amber-400",
    },
    {
      id: "statBoards",
      value: "6+",
      label: "Hardware Boards",
      icon: Layers,
      color: "text-cyan-400",
    },
    {
      id: "statRating",
      value: "4.9/5",
      label: "Community Rating",
      icon: Star,
      color: "text-yellow-400",
    },
  ];

  const stats = customStats || defaultStats;

  return (
    <section className="py-3.5 bg-bg-elevated/80 backdrop-blur-md border-y border-border/60 relative z-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div
          className="flex items-center justify-between gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;

            return (
              <div
                key={stat.id}
                className="flex items-center gap-6 sm:gap-8 shrink-0"
              >
                {/* Stat Item */}
                <div className="flex items-center gap-2.5 whitespace-nowrap group cursor-default">
                  {IconComponent && (
                    <IconComponent
                      size={17}
                      className={`${
                        stat.color || "text-primary"
                      } opacity-80 group-hover:scale-110 transition-transform`}
                    />
                  )}
                  <span className="text-text font-extrabold text-base sm:text-lg tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-text-subtle text-xs sm:text-sm font-medium">
                    {stat.label}
                  </span>
                </div>

                {/* Divider (Last Item မပါ) */}
                {index < stats.length - 1 && (
                  <span className="hidden md:inline-block text-border-muted opacity-60 shrink-0 select-none">
                    •
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StatsRibbon;
