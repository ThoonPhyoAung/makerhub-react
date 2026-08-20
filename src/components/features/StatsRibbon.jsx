function StatsRibbon() {
  const stats = [
    { id: "statLearners", value: "0", label: "Active Learners" },
    { id: "statProjects", value: "0", label: "Projects Built" },
    { id: "statSaleItems", value: "0", label: "Sale Items" },
    { id: "statBoards", value: "0", label: "Boards Covered" },
    { id: "statRating", value: "0", label: "Community Rating" },
  ];

  return (
    <section className="py-6 md:py-8 bg-bg-elevated border-y border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div
          className="flex flex-nowrap items-center gap-8 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {stats.map((stat, index) => (
            <div key={stat.id} className="flex items-center gap-8 shrink-0">
              {/* Stat item — Original CSS ရဲ့ .stat-item { display: flex } အတိုင်း Value/Label ကို Row နဲ့ ချထားတာ */}
              <div className="flex items-center gap-2 text-nowrap">
                <span className="text-text font-bold text-lg">
                  {stat.value}
                </span>
                <span className="text-text-subtle text-sm">{stat.label}</span>
              </div>

              {/* Divider — Last item ရဲ့ နောက်မှာ မပြပါ */}
              {index < stats.length - 1 && (
                <span className="hidden md:block text-text-subtle opacity-40 shrink-0">
                  •
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsRibbon;
