import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  MessagesSquare,
  Store,
  GraduationCap,
  Trophy,
  Award,
  TrendingUp,
  UserPlus,
  Loader2,
} from "lucide-react";

// 📌 API နှင့် Hooks များကို တင်သွင်းခြင်း (Real data ဆွဲထုတ်ရန်)
import { useFetch } from "../../hooks/useFetch";
import { getJourneys } from "../../api/journeysApi";
import { getLessons } from "../../api/lessonsApi";
import { getMarketplaceItems } from "../../api/marketplaceApi";
import { getPosts } from "../../api/postsApi";
import { getUsers } from "../../api/userService";

const rankClass = {
  1: "bg-amber-500/20 text-amber-500",
  2: "bg-slate-400/20 text-slate-400",
  3: "bg-amber-700/20 text-amber-600",
};
const defaultRankClass = "bg-surface text-text-muted border border-border";

const postBadge = {
  Help: "bg-amber-500/10 text-amber-500",
  Showcase: "bg-primary/10 text-primary",
};

const marketBadge = {
  Listed: "bg-emerald-500/10 text-emerald-500",
  Sold: "bg-primary/10 text-primary",
  Reported: "bg-red-500/10 text-red-500",
};

const signupBadge = {
  Active: "bg-emerald-500/10 text-emerald-500",
  Pending: "bg-amber-500/10 text-amber-500",
};

const getInitials = (name) =>
  name
    ? name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

// ---------------------------------------------------------------
// Small reusable pieces
// ---------------------------------------------------------------

function StatCard({ label, value, icon: Icon, to }) {
  return (
    <Link
      to={to}
      className="block bg-bg-elevated border border-border rounded-2xl p-3.5 sm:p-4 space-y-1.5 shadow-sm hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-text-muted">{label}</span>
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
          <Icon size={16} />
        </div>
      </div>
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-text">{value} {label}</h3>
      </div>
    </Link>
  );
}

function SectionCard({
  title,
  subtitle,
  icon: Icon,
  iconClass = "text-primary",
  tag,
  viewAllTo,
  footer,
  children,
}) {
  return (
    <div className="bg-bg-elevated border border-border rounded-2xl p-4 sm:p-5 flex flex-col shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon size={18} className={`${iconClass} shrink-0`} />}
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-text truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {tag && (
          <span className="text-xs text-text-muted font-medium px-2 py-1 rounded-md bg-surface shrink-0">
            {tag}
          </span>
        )}
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="text-xs text-primary hover:underline font-medium shrink-0"
          >
            View all
          </Link>
        )}
      </div>
      <div className="flex-1">{children}</div>
      {footer}
    </div>
  );
}

function ActivityRow({ title, meta, badge, badgeClass }) {
  return (
    <div className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text truncate">{title}</p>
        <p className="text-xs text-text-muted truncate">{meta}</p>
      </div>
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${badgeClass}`}
      >
        {badge}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------
// Page
// ---------------------------------------------------------------

function Dashboard() {
  // 📌 1. Real Data များကို API များမှ ခေါ်ယူခြင်း
  const { data: journeysData, loading: journeysLoading } =
    useFetch(getJourneys);
  const { data: lessonsData, loading: lessonsLoading } = useFetch(getLessons);
  const { data: marketData, loading: marketLoading } =
    useFetch(getMarketplaceItems);
  const { data: postsData, loading: postsLoading } = useFetch(getPosts);

  // LocalStorage ထဲမှ MakerHub Users အားလုံးကို ရယူခြင်း
  const usersRes = getUsers();
  const users = Array.isArray(usersRes?.data) ? usersRes.data : [];

  const isLoading =
    journeysLoading || lessonsLoading || marketLoading || postsLoading;

  const journeys = Array.isArray(journeysData) ? journeysData : [];
  const lessons = Array.isArray(lessonsData) ? lessonsData : [];
  const marketItems = Array.isArray(marketData) ? marketData : [];
  const posts = Array.isArray(postsData) ? postsData : [];

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const totalContributors = users.length > 0 ? users.length : 1245;
  const totalPosts = posts.length;
  const totalMarketItems = marketItems.length;
  const totalLessonsCount = lessons.length;

  const statCards = [
    {
      label: "Total Users",
      value: totalContributors.toLocaleString(),
      trend: "+12.4%",
      icon: Users,
      to: "/admin/users",
    },
    {
      label: "Community posts",
      value: totalPosts.toLocaleString(),
      trend: "+8.2%",
      icon: MessagesSquare,
      to: "/admin/community",
    },
    {
      label: "Marketplace items",
      value: totalMarketItems.toLocaleString(),
      trend: "+4.1%",
      icon: Store,
      to: "/admin/marketplace",
    },
    {
      label: "Learning modules",
      value: totalLessonsCount.toLocaleString(),
      trend: "+15.3%",
      icon: GraduationCap,
      to: "/admin/learning/lessons",
    },
  ];

  // Top Active Learners
  const topLearners = [...users]
    .filter((u) => u.role !== "admin")
    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
    .slice(0, 5)
    .map((u) => ({
      name: u.name || "Unknown User",
      xp: (u.xp || 0).toLocaleString(),
    }));

  const displayTopLearners =
    topLearners.length > 0
      ? topLearners
      : [
          { name: "Kaung Myat", xp: "3,450" },
          { name: "Su Myat Noe", xp: "2,920" },
          { name: "Aung Kyaw Moe", xp: "2,750" },
          { name: "Hnin Wutt Yee", xp: "1,750" },
          { name: "Min Thant", xp: "1,550" },
        ];

  // 📌 4. Learners by Journey (Learner ဘက်ခြမ်း JourneyHero ကဲ့သို့ lessons တွေထဲက completedUserIds ကို ယူ၍ တွက်ချက်ခြင်း)
  const colorsList = [
    "bg-primary",
    "bg-purple-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-rose-500",
  ];

  const journeyStats = journeys.map((journey, idx, arr) => {
    // 📌 journey.id သို့မဟုတ် journey.journeyId များကို လိုက်ဖက်ညီအောင် စစ်ဆေးခြင်း
    const journeySystemId = String(journey.id || journey._id || "");
    const journeySlugId = String(journey.journeyId || "");

    const journeyLessons = lessons.filter(
      (l) =>
        String(l.journeyId || l.journey) === journeySystemId ||
        String(l.journeyId || l.journey) === journeySlugId,
    );

    const uniqueLearners = new Set();
    journeyLessons.forEach((lesson) => {
      if (Array.isArray(lesson.completedUserIds)) {
        lesson.completedUserIds.forEach((uid) => {
          if (uid) uniqueLearners.add(String(uid));
        });
      }
    });

    const journeyTitle =
      typeof journey.title === "object"
        ? journey.title.en || "Journey"
        : journey.title || `Journey ${idx + 1}`;

    // Fallback Tailwind colors if journey.color is missing
    const colorsList = [
      "bg-primary",
      "bg-purple-500",
      "bg-amber-500",
      "bg-emerald-500",
      "bg-rose-500",
    ];

    return {
      name: journeyTitle,
      learners: uniqueLearners.size,
      // journey.color ပါရှိလျှင် ၎င်းကိုသုံးမည်၊ မပါပါက default tailwind class ကို ယူမည်
      barColor: journey.color || null,
      barClass: colorsList[idx % colorsList.length],
    };
  });
  const displayJourneyStats =
    journeyStats.length > 0
      ? journeyStats
      : [
          { name: "Arduino Journey", learners: 0, bar: "bg-primary" },
          { name: "ESP32 Journey", learners: 0, bar: "bg-purple-500" },
          { name: "ESP8266 Journey", learners: 0, bar: "bg-amber-500" },
          { name: "Raspberry Pi Journey", learners: 0, bar: "bg-emerald-500" },
        ];

  // 📌 Total Enrolled ဆိုသည်မှာ MakerHub ၏ စုစုပေါင်း User အရေအတွက် အမှန် ဖြစ်ရပါမည်
  const totalMakerHubUsers = users.length > 0 ? users.length : 1;

  // Recent Community Activity
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3)
    .map((p) => ({
      title: p.title || p.content || "Untitled Post",
      by: p.authorName || p.sellerName || "Maker",
      time: p.createdAt
        ? new Date(p.createdAt).toLocaleDateString()
        : "Recently",
      type: p.type || p.category || "Help",
    }));

  const displayCommunityActivity =
    recentPosts.length > 0
      ? recentPosts
      : [
          {
            title: "ESP32 WiFi Connection Issue",
            by: "Aung Min",
            time: "2 hours ago",
            type: "Help",
          },
          {
            title: "Solar Powered IoT Node Project",
            by: "Su Su",
            time: "5 hours ago",
            type: "Showcase",
          },
          {
            title: "ESP32 Weather Station Node",
            by: "Kyaw Gyi",
            time: "1 day ago",
            type: "Showcase",
          },
        ];

  // Recent Marketplace Activity
  const recentMarket = [...marketItems]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3)
    .map((item) => ({
      title: item.title ? `${item.title} listed for sale` : "Item listed",
      by: item.sellerName || "Ko Htet",
      price: item.price
        ? `${Number(item.price).toLocaleString()} MMK`
        : "0 MMK",
      time: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "35m ago",
      status: item.isSold
        ? "Sold"
        : item.reportCount > 0
          ? "Reported"
          : "Listed",
    }));

  const displayMarketActivity =
    recentMarket.length > 0
      ? recentMarket
      : [
          {
            title: "ESP32-S3 Dev Board listed for sale",
            by: "Ko Htet",
            price: "18,000 MMK",
            time: "35m ago",
            status: "Listed",
          },
          {
            title: "Raspberry Pi Zero 2 W marked as sold",
            by: "Ma Phyu",
            price: "45,000 MMK",
            time: "2h ago",
            status: "Sold",
          },
          {
            title: "DHT22 Temperature Sensor reported",
            by: "Ko Min",
            price: "15,000 MMK",
            time: "5h ago",
            status: "Reported",
          },
        ];

  // New User Signups
  const recentUsers = [...users]
    .filter((u) => u.role !== "admin")
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3)
    .map((u) => ({
      name: u.name || "New Member",
      interest: u.interest || "Arduino",
      time: u.createdAt ? u.createdAt : "Recently",
      status: u.status || "Active",
      avatar: "bg-primary/10 text-primary",
    }));

  const displayNewUsers =
    recentUsers.length > 0
      ? recentUsers
      : [
          {
            name: "Kyaw Min",
            interest: "Arduino",
            time: "10m ago",
            status: "Active",
            avatar: "bg-primary/10 text-primary",
          },
          {
            name: "Zin Mar",
            interest: "ESP32",
            time: "1h ago",
            status: "Active",
            avatar: "bg-purple-500/10 text-purple-500",
          },
          {
            name: "Thura Htet",
            interest: "Raspberry Pi",
            time: "3h ago",
            status: "Pending",
            avatar: "bg-amber-500/10 text-amber-500",
          },
        ];

  if (isLoading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted">
        <Loader2 size={36} className="animate-spin text-primary mb-3" />
        <p className="text-sm font-medium">Loading dashboard overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard Overview</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Welcome back! Here's what's happening with MakerHub today.
          </p>
        </div>
        <span className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-bg-elevated border border-border text-xs font-medium text-text-muted">
          {today}
        </span>
      </div>

      {/* 2. Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* 3. Learners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Top Active Learners (XP)"
          icon={Trophy}
          iconClass="text-amber-500"
          tag="This Week"
        >
          <div className="divide-y divide-border">
            {displayTopLearners.map((learner, index) => {
              const rank = index + 1;
              return (
                <div
                  key={learner.name}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                        rankClass[rank] || defaultRankClass
                      }`}
                    >
                      {rank}
                    </span>
                    <p className="text-sm font-medium text-text truncate">
                      {learner.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-xs shrink-0">
                    <Award size={14} />
                    <span>{learner.xp} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Learners by journey"
          subtitle="Active enrollment & completion distribution"
          tag="Monthly"
          footer={
            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <span>
                Total platform users:{" "}
                <strong className="text-text">{totalMakerHubUsers}</strong>
              </span>
              <span>
                Active journeys:{" "}
                <strong className="text-text">
                  {displayJourneyStats.length}
                </strong>
              </span>
            </div>
          }
        >
          <div className="space-y-4">
            {displayJourneyStats.map((journey) => {
              // 📌 ရာခိုင်နှုန်း (%) တွက်ချက်ခြင်း: (ဤ Journey ရဲ့ learned unique users / စုစုပေါင်း MakerHub Users) * 100
              const percent =
                totalMakerHubUsers > 0
                  ? Math.min(
                      Math.round((journey.learners / totalMakerHubUsers) * 100),
                      100,
                    )
                  : 0;

              return (
                <div key={journey.name} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-text truncate">
                      {journey.name}
                    </span>
                    <span className="text-text-muted font-semibold shrink-0">
                      {journey.learners} Learners ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2.5 overflow-hidden border border-border/50">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${!journey.barColor ? journey.barClass : ""}`}
                      style={
                        journey.barColor
                          ? {
                              width: `${percent}%`,
                              backgroundColor: journey.barColor,
                            }
                          : { width: `${percent}%` }
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* 4. Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Recent Community Activity"
          viewAllTo="/admin/community"
        >
          <div className="divide-y divide-border">
            {displayCommunityActivity.map((item, idx) => (
              <ActivityRow
                key={idx}
                title={item.title}
                meta={`by ${item.by} • ${item.time}`}
                badge={item.type}
                badgeClass={
                  postBadge[item.type] || "bg-primary/10 text-primary"
                }
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent Marketplace Activity"
          viewAllTo="/admin/marketplace"
        >
          <div className="divide-y divide-border">
            {displayMarketActivity.map((item, idx) => (
              <ActivityRow
                key={idx}
                title={item.title}
                meta={`by ${item.by} • ${item.price} • ${item.time}`}
                badge={item.status}
                badgeClass={marketBadge[item.status]}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="New User Signups" icon={UserPlus} tag="This Week">
          <div className="divide-y divide-border">
            {displayNewUsers.map((user, idx) => (
              <div
                key={idx}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${user.avatar}`}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {user.interest} • {user.time}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${
                    signupBadge[user.status] ||
                    "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default Dashboard;
