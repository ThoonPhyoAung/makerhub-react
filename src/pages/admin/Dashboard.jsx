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
  Flag,
  HelpCircle,
  BookOpen,
  ChevronRight,
} from "lucide-react";

// ---------------------------------------------------------------
// Placeholder data (UI အဆင့်ပဲ) — Real data ချိတ်တဲ့အခါ ဒီ array တွေကို
// useFetch ရလဒ်နဲ့ အစားထိုးရုံပဲ၊ အောက်က JSX ကို မပြင်ရတော့ဘူး
// ---------------------------------------------------------------

const attentionItems = [
  {
    label: "Reported listings",
    count: 2,
    icon: Flag,
    tone: "danger",
    to: "/admin/marketplace",
  },
  {
    label: "Help posts with no replies",
    count: 3,
    icon: HelpCircle,
    tone: "warning",
    to: "/admin/community",
  },
  {
    label: "Chapters with no lessons",
    count: 16,
    icon: BookOpen,
    tone: "info",
    to: "/admin/learning/chapters",
  },
];

// Tailwind က class နာမည်အပြည့်ကို source ထဲမှာ တွေ့မှ generate လုပ်ပေးလို့
// `bg-${tone}` လို ဆက်ရေးမနေဘဲ နာမည်အပြည့် map ထဲ ထည့်ထားတာ
const toneClass = {
  danger: { chip: "bg-red-500/10 text-red-500", count: "text-red-500" },
  warning: { chip: "bg-amber-500/10 text-amber-500", count: "text-amber-500" },
  info: { chip: "bg-primary/10 text-primary", count: "text-primary" },
};

const statCards = [
  {
    label: "Contributors",
    value: "1,245",
    trend: "+12.4%",
    icon: Users,
    to: "/admin/users",
  },
  {
    label: "Community posts",
    value: "348",
    trend: "+8.2%",
    icon: MessagesSquare,
    to: "/admin/community",
  },
  {
    label: "Marketplace items",
    value: "89",
    trend: "+4.1%",
    icon: Store,
    to: "/admin/marketplace",
  },
  {
    label: "Learning modules",
    value: "560",
    trend: "+15.3%",
    icon: GraduationCap,
    to: "/admin/learning/lessons",
  },
];

const topLearners = [
  { name: "Kaung Myat", xp: "3,450" },
  { name: "Su Myat Noe", xp: "2,920" },
  { name: "Aung Kyaw Moe", xp: "2,750" },
  { name: "Hnin Wutt Yee", xp: "1,750" },
  { name: "Min Thant", xp: "1,550" },
];

const rankClass = {
  1: "bg-amber-500/20 text-amber-500",
  2: "bg-slate-400/20 text-slate-400",
  3: "bg-amber-700/20 text-amber-600",
};
const defaultRankClass = "bg-surface text-text-muted border border-border";

const journeyStats = [
  { name: "Arduino Journey", learners: 245, bar: "bg-primary" },
  { name: "ESP32 Journey", learners: 180, bar: "bg-purple-500" },
  { name: "ESP8266 Journey", learners: 95, bar: "bg-amber-500" },
  { name: "Raspberry Pi Journey", learners: 65, bar: "bg-emerald-500" },
];

const communityActivity = [
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

// Post type ၂ မျိုးပဲ ရှိတယ် (Help / Showcase)
const postBadge = {
  Help: "bg-amber-500/10 text-amber-500",
  Showcase: "bg-primary/10 text-primary",
};

const marketActivity = [
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

const marketBadge = {
  Listed: "bg-emerald-500/10 text-emerald-500",
  Sold: "bg-primary/10 text-primary",
  Reported: "bg-red-500/10 text-red-500",
};

// NOTE: users data က localStorage ထဲမှာပဲ ရှိလို့ Firebase မချိတ်ခင်အထိ
// admin browser ထဲက account တွေကိုပဲ မြင်ရမယ်။ "status" ဆိုတဲ့ field လည်း
// user model ထဲမှာ မရှိသေးဘူး (placeholder ပဲ)
const newUsers = [
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

const signupBadge = {
  Active: "bg-emerald-500/10 text-emerald-500",
  Pending: "bg-amber-500/10 text-amber-500",
};

const getInitials = (name) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// ---------------------------------------------------------------
// Small reusable pieces
// ---------------------------------------------------------------

function StatCard({ label, value, trend, icon: Icon, to }) {
  return (
    <Link
      to={to}
      className="block bg-bg-elevated border border-border rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-text-muted">{label}</span>
        <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
          <Icon size={18} />
        </div>
      </div>
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-text">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-500 font-medium">
            <TrendingUp size={14} className="shrink-0" />
            {/* ဖုန်းမှာ နေရာကျဉ်းလို့ "vs last month" ကို sm အထက်မှာပဲ ပြ */}
            <span>
              {trend}
              <span className="hidden sm:inline"> vs last month</span>
            </span>
          </div>
        )}
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
  // ရက်စွဲကို အသေမရေးတော့ဘဲ ဒီနေ့ရက်ကို တွက်ပြ
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // % နဲ့ total ကို array ကနေ တွက်လို့ ဂဏန်းတွေ တစ်ညီတစ်ညာတည်း ဖြစ်နေမယ်
  const totalLearners = journeyStats.reduce((sum, j) => sum + j.learners, 0);

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

      {/* 2. Needs attention (အပေါ်ဆုံးမှာ ထားတယ် — အောက်ဆုံးကို ရွှေ့ချင်ရင် ဒီ block ကို ရွှေ့ရုံပဲ) */}
      <SectionCard title="Needs attention">
        <div className="divide-y divide-border">
          {attentionItems.map(({ label, count, icon: Icon, tone, to }) => (
            <Link
              key={label}
              to={to}
              className="py-3 first:pt-0 last:pb-0 flex items-center gap-3 group"
            >
              <div
                className={`p-2 rounded-xl shrink-0 ${toneClass[tone].chip}`}
              >
                <Icon size={16} />
              </div>
              <span className="flex-1 min-w-0 text-sm font-medium text-text group-hover:text-primary transition-colors">
                {label}
              </span>
              <span className={`text-sm font-bold ${toneClass[tone].count}`}>
                {count}
              </span>
              <ChevronRight size={16} className="text-text-muted shrink-0" />
            </Link>
          ))}
        </div>
      </SectionCard>

      {/* 3. Stat cards (ဖုန်းမှာ ၂ ကော်လံ၊ desktop မှာ ၄ ကော်လံ) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* 4. Learners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Top Active Learners (XP)"
          icon={Trophy}
          iconClass="text-amber-500"
          tag="This Week"
        >
          <div className="divide-y divide-border">
            {topLearners.map((learner, index) => {
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
                Total enrolled:{" "}
                <strong className="text-text">{totalLearners}</strong>
              </span>
              <span>
                Active journeys:{" "}
                <strong className="text-text">{journeyStats.length}</strong>
              </span>
            </div>
          }
        >
          <div className="space-y-4">
            {journeyStats.map((journey) => {
              const percent = Math.round(
                (journey.learners / totalLearners) * 100,
              );
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
                      className={`${journey.bar} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* 5. Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Recent Community Activity"
          viewAllTo="/admin/community"
        >
          <div className="divide-y divide-border">
            {communityActivity.map((item) => (
              <ActivityRow
                key={item.title}
                title={item.title}
                meta={`by ${item.by} • ${item.time}`}
                badge={item.type}
                badgeClass={postBadge[item.type]}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent Marketplace Activity"
          viewAllTo="/admin/marketplace"
        >
          <div className="divide-y divide-border">
            {marketActivity.map((item) => (
              <ActivityRow
                key={item.title}
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
            {newUsers.map((user) => (
              <div
                key={user.name}
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
                    signupBadge[user.status]
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
