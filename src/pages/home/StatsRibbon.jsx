import { useState, useEffect } from "react";
import { Users, Cpu, ShoppingBag, Layers, Star, Loader2 } from "lucide-react";

// API Hooks & Calls
import { useFetch } from "../../hooks/useFetch";
import { getJourneys } from "../../api/journeysApi";
import { getPosts } from "../../api/postsApi";
import { getMarketplaceItems } from "../../api/marketplaceApi";
import { getLessonsByJourneyId } from "../../api/lessonsApi";

/**
 * 1. Journey တစ်ခုချင်းစီရဲ့ Lessons ကို useFetch ဖြင့် သီးသန့်ဆွဲယူပြီး
 *    First Lesson Completed User IDs များကို Parent ထံ ပို့ပေးမည့် Child Component
 */
function JourneyUserTracker({ journeyId, onUsersFetched }) {
  const { data: lessonsData } = useFetch(() =>
    getLessonsByJourneyId(journeyId),
  );

  useEffect(() => {
    if (lessonsData) {
      const journeyLessons = Array.isArray(lessonsData)
        ? lessonsData
        : Array.isArray(lessonsData?.data)
          ? lessonsData.data
          : [];

      const firstLesson = journeyLessons[0];
      const userIds = firstLesson?.completedUserIds;

      if (Array.isArray(userIds)) {
        onUsersFetched(journeyId, userIds);
      }
    }
  }, [lessonsData, journeyId, onUsersFetched]);

  return null; // UI မှာ ဘာမှ ပြစရာမလိုပါ
}

/**
 * 2. Main StatsRibbon Component
 */
function StatsRibbon({ customStats }) {
  // Main APIs ခေါ်ယူခြင်း
  const { data: journeys, loading: loadingJourneys } = useFetch(getJourneys);
  const { data: posts, loading: loadingPosts } = useFetch(getPosts);
  const { data: marketplaceItems, loading: loadingItems } =
    useFetch(getMarketplaceItems);

  // Active Learners စာရင်းသိမ်းဆည်းရန် State
  const [journeyUserMap, setJourneyUserMap] = useState({});

  // Child Component မှ User IDs များ ပို့ပေးလာပါက Map ထဲသိမ်းမည်
  const handleUsersFetched = (journeyId, userIds) => {
    setJourneyUserMap((prev) => {
      // Data တူနေပါက re-render မဖြစ်အောင် စစ်ဆေးခြင်း
      if (JSON.stringify(prev[journeyId]) === JSON.stringify(userIds)) {
        return prev;
      }
      return { ...prev, [journeyId]: userIds };
    });
  };

  // Active Learners Unique Count ကို တွက်ချက်ခြင်း
  const activeUserSet = new Set();
  Object.values(journeyUserMap).forEach((userIds) => {
    userIds.forEach((id) => {
      if (id) activeUserSet.add(String(id));
    });
  });
  const activeLearnersCount = activeUserSet.size;

  // Stats Data များ ပြင်ဆင်ခြင်း
  const projectsCount = Array.isArray(posts) ? posts.length : 0;
  const itemsCount = Array.isArray(marketplaceItems)
    ? marketplaceItems.length
    : 0;
  const boardsCount = Array.isArray(journeys) ? journeys.length : 0;

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

  const stats = customStats || dynamicStats;
  const isLoading = loadingJourneys || loadingPosts || loadingItems;

  return (
    <section className="py-3.5 bg-bg-elevated/80 backdrop-blur-md border-y border-border/60 relative z-10">
      {/* Hidden Tracker Components: Journey တစ်ခုစီအတွက် useFetch ခေါ်ယူရန် */}
      {Array.isArray(journeys) &&
        journeys.map((journey) => (
          <JourneyUserTracker
            key={journey.id}
            journeyId={journey.id}
            onUsersFetched={handleUsersFetched}
          />
        ))}

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
