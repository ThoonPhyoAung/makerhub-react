// import { useState, useEffect } from "react";
import { Users, Cpu, ShoppingBag, Layers, Star, Loader2 } from "lucide-react";

// API Hooks & Calls
import { useFetch } from "../../hooks/useFetch";
import { getJourneys } from "../../api/journeysApi";
import { getPosts } from "../../api/postsApi";
import { getMarketplaceItems } from "../../api/marketplaceApi";
import { getLessons } from "../../api/lessonsApi"; //

function StatsRibbon({ customStats }) {
  // API များ ခေါ်ယူခြင်း
  const { data: journeys, loading: loadingJourneys } = useFetch(getJourneys);
  const { data: posts, loading: loadingPosts } = useFetch(getPosts);
  const { data: marketplaceItems, loading: loadingItems } =
    useFetch(getMarketplaceItems);
  const { data: lessonsData, loading: loadingLessons } = useFetch(getLessons); // 👈 Lessons အားလုံးကို တစ်ကြိမ်တည်း ခေါ်ယူခြင်း

  // Active Learners Unique Count ကို Lessons Data မှ တွက်ချက်ခြင်း
  const activeLearnersCount = (() => {
    const lessons = Array.isArray(lessonsData) ? lessonsData : [];
    const activeUserSet = new Set(); // new Set()  will not count duplicate user IDs

    lessons.forEach((lesson) => {
      if (Array.isArray(lesson.completedUserIds)) {
        lesson.completedUserIds.forEach((id) => {
          if (id) activeUserSet.add(String(id));
        });
      }
    });

    return activeUserSet.size;
  })();

  // Stats Data များ ပြင်ဆင်ခြင်း
  const projectsCount = Array.isArray(posts) ? posts.length : 0;

  // Marketplace Items Count နှင့် Journeys Count ကို စစ်ဆေးခြင်း
  const itemsCount = Array.isArray(marketplaceItems)
    ? marketplaceItems.length
    : 0;
  // Journey Boards Counting
  const boardsCount = Array.isArray(journeys) ? journeys.length : 0;

  // Dynamic icon and data for the stats ribbon
  const dynamicStats = [
    {
      id: "statLearners",
      value: activeLearnersCount > 0 ? `${activeLearnersCount}+` : "0",
      label: "Active Learners",
      icon: Users,
      color: "text-emerald-400",
    },
    {
      id: "statProjects",
      value: projectsCount > 0 ? `${projectsCount}+` : "0",
      label: "Projects Built",
      icon: Cpu,
      color: "text-purple-400",
    },
    {
      id: "statSaleItems",
      value: itemsCount > 0 ? `${itemsCount}+` : "0",
      label: "IoT Modules & Kits",
      icon: ShoppingBag,
      color: "text-amber-400",
    },
    {
      id: "statBoards",
      value: boardsCount > 0 ? `${boardsCount}+` : "0",
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

  const stats = customStats || dynamicStats; // if customStats is provided, use it; otherwise, use dynamicStats
  // Loading state for the stats ribbon
  const isLoading =
    loadingJourneys || loadingPosts || loadingItems || loadingLessons;

  return (
    <section className="py-3.5 bg-bg-elevated/80 backdrop-blur-md border-y border-border/60 relative z-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div
          className="flex items-center justify-between gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* looping each stat */}
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;

            return (
              <div
                key={stat.id}
                className="flex items-center gap-6 sm:gap-8 shrink-0"
              >
                <div className="flex items-center gap-2.5 whitespace-nowrap group cursor-default">
                  {IconComponent && (
                    <IconComponent
                      size={17}
                      className={`${
                        stat.color || "text-primary"
                      } opacity-80 group-hover:scale-110 transition-transform`}
                    />
                  )}

                  <span className="text-text font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-1.5">
                    {!customStats && isLoading && stat.id !== "statRating" ? (
                      <Loader2
                        size={14}
                        className="animate-spin text-text-subtle"
                      />
                    ) : (
                      stat.value
                    )}
                  </span>

                  <span className="text-text-subtle text-xs sm:text-sm font-medium">
                    {stat.label}
                  </span>
                </div>

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
