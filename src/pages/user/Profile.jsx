import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  Flame,
  Edit3,
  Package,
  Bookmark,
  GraduationCap,
  ExternalLink,
  Tag,
  MapPin,
  Eye,
  Loader2,
  Heart,
  MessageCircle,
} from "lucide-react";

// 📌 API နှင့် Hooks များ (ပေးထားသော path အမှန်များအတိုင်း)
import { useFetch } from "../../hooks/useFetch";
import { getPosts } from "../../api/postsApi";
import { getMarketplaceItems } from "../../api/marketplaceApi";
import { getJourneys } from "../../api/journeysApi";
import { getLessons } from "../../api/lessonsApi";
import { useAlert } from "../../context/AlertContext";
import { boardIconMap, RenderIcon } from "../../utils/iconMaps";



// Lesson XP Helper Function
const getLessonAllQuestionsXp = (lesson) => {
  if (!lesson) return 0;
  if (Array.isArray(lesson.questions) && lesson.questions.length > 0) {
    return lesson.questions.reduce(
      (sum, q) => sum + Number(q.xp || q.xpReward || 0),
      0,
    );
  }
  return Number(lesson.xp || lesson.xpReward || 0);
};

function Profile() {
  const navigate = useNavigate();
  const showAlert = useAlert();
  const currentUser = useSelector((state) => state?.auth?.user);

  const activeUser = currentUser || {
    id: "usr_admin",
    name: "Admin",
    email: "admin@gmail.com",
    role: "admin",
    xp: 1915,
    streak: 1,
    avatar: "",
    completedLessons: [],
  };

  const [activeTab, setActiveTab] = useState("projects");

  const streakDays = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDayIndex = new Date().getDay();
  const streakCount = activeUser?.streak || activeUser?.streakDays || 1;

  // API Data များကို ယူခြင်း
  const { data: postsData, loading: postsLoading } = useFetch(getPosts);
  const { data: marketData, loading: marketLoading } = useFetch(getMarketplaceItems);
  const { data: journeysData, loading: journeysLoading } = useFetch(getJourneys);
  const { data: lessonsData } = useFetch(getLessons);

  const [itemList, setItemList] = useState([]);
  React.useEffect(() => {
    if (marketData) {
      setItemList(marketData);
    }
  }, [marketData]);

  const posts = Array.isArray(postsData) ? postsData : [];
  const journeys = Array.isArray(journeysData) ? journeysData : [];
  const allLessons = Array.isArray(lessonsData) ? lessonsData : [];

  const userId = String(activeUser.id || activeUser._id || "");

  // 1. My Projects
  const myProjects = posts.filter(
    (p) =>
      String(p.authorId || p.userId) === userId ||
      p.authorName === activeUser.name,
  );

  // 2. My Sell Items
  const mySellItems = itemList.filter(
    (item) =>
      String(item.sellerId || item.userId) === userId ||
      item.sellerName === activeUser.name,
  );

  // 3. My Save Items
  const mySaveItems = itemList.filter((item) => {
    const savedUsers = Array.isArray(item.savedUsers) ? item.savedUsers : [];
    return savedUsers.some((data) =>
      typeof data === "object"
        ? String(data.userId) === userId
        : String(data) === userId,
    );
  });

  // Watchlist Toggle Handler
  const handleToggleSave = async (e, itemId) => {
    e.preventDefault();

    if (!currentUser) {
      showAlert({
        title: "Authentication Required",
        message: "You need to log in to access your saved items.",
        type: "warning",
        actionText: "Go to Login",
        onAction: () => navigate("/login"),
      });
      return;
    }

    const previousItems = [...itemList];
    const targetItem = itemList.find((item) => String(item.id) === String(itemId));
    if (!targetItem) return;

    const savedUsers = Array.isArray(targetItem.savedUsers) ? targetItem.savedUsers : [];
    const alreadySaved = savedUsers.some((data) =>
      typeof data === "object"
        ? String(data.userId) === userId
        : String(data) === userId,
    );

    const updateSavedUsers = alreadySaved
      ? savedUsers.filter((data) =>
          typeof data === "object"
            ? String(data.userId) !== userId
            : String(data) !== userId,
        )
      : [...savedUsers, { userId, savedAt: Date.now().toString() }];

    setItemList((prevItems) =>
      prevItems.map((item) =>
        String(item.id) === String(itemId)
          ? { ...item, savedUsers: updateSavedUsers }
          : item,
      ),
    );

    try {
      await updateMarketplaceItem(itemId, {
        ...targetItem,
        savedUsers: updateSavedUsers,
      });
      showAlert(alreadySaved ? "Removed from watchlist" : "Added to watchlist!");
    } catch (err) {
      console.error("Wishlist Update Error:", err);
      setItemList(previousItems);
      showAlert({ message: "Failed to update watchlist. Please try again." });
    }
  };

  // XP & Tracks Calculations
  const totalPlatformXp = allLessons.reduce(
    (sum, lesson) => sum + getLessonAllQuestionsXp(lesson),
    0,
  );
  const maxAvailableXp = totalPlatformXp > 0 ? totalPlatformXp : 10000;
  const userXp = activeUser.xp || 0;
  const xpPercentage = Math.min(
    Math.round((userXp / maxAvailableXp) * 100),
    100,
  );

  const completedLessonSet = new Set(
    (activeUser.completedLessons || []).map(String),
  );

  const colorsList = ["#22c55e", "#a855f7", "#f59e0b", "#10b981"];
  const trackProgressList = journeys.map((journey, idx) => {
    const journeyId = String(journey.id || journey._id || "");
    const journeySlugId = String(journey.journeyId || "");

    const journeyLessons = allLessons.filter(
      (l) =>
        String(l.journeyId || l.journey) === journeyId ||
        String(l.journeyId || l.journey) === journeySlugId,
    );

    const totalInJourney = journeyLessons.length;
    let completedInJourney = 0;

    journeyLessons.forEach((l) => {
      const lId = String(l.id || l._id || "");
      if (completedLessonSet.has(lId)) {
        completedInJourney++;
      }
    });

    const percent =
      totalInJourney > 0
        ? Math.round((completedInJourney / totalInJourney) * 100)
        : idx === 0
          ? 0
          : idx === 1
            ? 0
            : 0;

    const journeyTitle =
      typeof journey.title === "object"
        ? journey.title.en || "Journey"
        : journey.title || `Journey ${idx + 1}`;

    const color = journey.color || colorsList[idx % colorsList.length];

    return {
      name: journeyTitle,
      percent,
      barColor: color,
      iconKey: journey.iconKey || "code",
      colorBg: journey.colorBg || `${color}15`,
    };
  });

  const displayTracks =
    trackProgressList.length > 0
      ? trackProgressList
      : [
          { name: "Arduino Programming", percent: 0, barColor: "#22c55e", iconKey: "arduino", colorBg: "#22c55e15" },
          { name: "ESP32", percent: 0, barColor: "#a855f7", iconKey: "esp32", colorBg: "#a855f715" },
          { name: "ESP8266", percent: 0, barColor: "#f59e0b", iconKey: "esp8266", colorBg: "#f59e0b15" },
          { name: "Raspberry Pi", percent: 0, barColor: "#10b981", iconKey: "raspberrypi", colorBg: "#10b98115" },
        ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Top Grid: Profile Card & Learning Tracks Progress (items-stretch ဖြင့် အမြင့်တူညီစေရန်) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: User Profile Card */}
        <div className="lg:col-span-5 bg-bg-elevated border border-border rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-sm h-full">
          <div className="w-full flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary border-2 border-primary/40 flex items-center justify-center font-bold text-2xl uppercase shadow-inner mb-3 overflow-hidden">
              {activeUser.avatar ? (
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="w-full h-full object-cover"
                />
              ) : activeUser.name ? (
                activeUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              ) : (
                "AD"
              )}
            </div>

            <h2 className="text-xl font-bold text-text">
              {activeUser.name || "Admin"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {activeUser.email || "admin@gmail.com"}
            </p>

            <div className="w-full bg-bg border border-border rounded-xl p-4 mt-5 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Award size={15} className="text-amber-400" /> XP POINTS
                </span>
                <span className="text-amber-400 font-extrabold">
                  {userXp.toLocaleString()}
                  <span className="text-text-subtle font-medium">
                    / {maxAvailableXp.toLocaleString()}
                  </span>
                </span>
              </div>
              <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden border border-border-muted">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>

            <div className="w-full bg-bg border border-amber-500/30 rounded-xl p-4 mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame
                  size={20}
                  className="fill-amber-400 text-amber-400 animate-pulse"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-text">
                    {streakCount} Days Streak
                  </div>
                  <div className="text-[10px] text-text-muted">
                    Keep it up daily!
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {streakDays.map((_, index) => {
                    const isToday = index === currentDayIndex;
                    return (
                      <div
                        key={index}
                        className={`w-[13px] h-[13px] rounded-sm transition-colors ${
                          isToday
                            ? "bg-primary animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                            : "bg-surface border border-border"
                        }`}
                      />
                    );
                  })}
                </div>
                <div className="flex gap-1 text-[10px] text-text-subtle justify-center">
                  {streakDays.map((day, i) => (
                    <span key={i} className="w-[13px] text-center">
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/profile/edit"
            className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-bg-subtle text-text text-xs font-semibold transition-all shadow-sm"
          >
            <Edit3 size={15} /> Edit Profile
          </Link>
        </div>

        {/* Right Column: Learning Tracks Progress */}
        <div className="lg:col-span-7 bg-bg-elevated border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-border mb-6">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <GraduationCap size={20} />
              </div>
              <h2 className="text-base font-bold text-text">
                Learning Tracks Progress
              </h2>
            </div>

            <div className="space-y-5">
              {journeysLoading ? (
                <div className="text-center py-10">
                  <Loader2
                    size={28}
                    className="mx-auto text-primary animate-spin mb-2"
                  />
                  <p className="text-text-muted text-xs">
                    Loading learning tracks...
                  </p>
                </div>
              ) : (
                displayTracks.map((track) => (
                  <div key={track.name} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      {/* 📌 Journey Icon ဖြင့် အလှဆင်ထားခြင်း */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-sm"
                          style={{
                            backgroundColor: track.colorBg,
                            color: track.barColor,
                          }}
                        >
                          <RenderIcon
                            iconKey={track.iconKey}
                            map={boardIconMap}
                            size={16}
                          />
                        </div>
                        <span className="font-bold text-text">{track.name}</span>
                      </div>
                      <span className="text-text-muted font-semibold">
                        {track.percent}%
                      </span>
                    </div>
                    <div className="w-full bg-bg-subtle rounded-full h-2.5 overflow-hidden border border-border-muted">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${track.percent}%`,
                          backgroundColor: track.barColor,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-3 border-b border-border pb-3 pt-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "projects"
              ? "bg-primary text-[#052010] shadow-[0_4px_14px_rgba(34,197,94,0.3)]"
              : "bg-bg-elevated border border-border text-text-muted hover:text-text hover:bg-surface"
          }`}
        >
          <GraduationCap size={15} /> My Projects ({myProjects.length})
        </button>

        <button
          onClick={() => setActiveTab("sell")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "sell"
              ? "bg-primary text-[#052010] shadow-[0_4px_14px_rgba(34,197,94,0.3)]"
              : "bg-bg-elevated border border-border text-text-muted hover:text-text hover:bg-surface"
          }`}
        >
          <Package size={15} /> My Sell Items ({mySellItems.length})
        </button>

        <button
          onClick={() => setActiveTab("saves")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "saves"
              ? "bg-primary text-[#052010] shadow-[0_4px_14px_rgba(34,197,94,0.3)]"
              : "bg-bg-elevated border border-border text-text-muted hover:text-text hover:bg-surface"
          }`}
        >
          <Bookmark size={15} /> My Save Items ({mySaveItems.length})
        </button>
      </div>

      {/* Tab Content Cards Grid */}
      <div className="pt-2">
        {/* 1. My Projects Tab (Desktop မှာ ၁ တန်းကို ၃ ကတ်) */}
        {activeTab === "projects" &&
          (postsLoading ? (
            <div className="text-center py-12">
              <Loader2
                size={32}
                className="mx-auto text-primary animate-spin mb-3"
              />
              <p className="text-text-muted text-sm">
                Loading your projects...
              </p>
            </div>
          ) : myProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myProjects.map((post) => (
                <Link
                  key={post.id || post._id}
                  to={`/community/project/${post.id || post._id}`}
                  className="block h-full group"
                >
                  <div className="h-full flex flex-col rounded-xl sm:rounded-2xl border border-border bg-bg-elevated/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-bg-elevated hover:border-primary/40 hover:shadow-xl">
                    <div className="p-1">
                      <img
                        src={
                          post.image ||
                          "https://placehold.co/500x300/1c2128/64748b?text=No+Image"
                        }
                        alt={post.title}
                        className="w-full h-[180px] rounded-2xl object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                      />
                    </div>

                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="text-text text-base font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-text-muted text-sm leading-relaxed mb-3 line-clamp-2">
                        {post.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border-muted/60">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={
                              post.avatarUrl ||
                              activeUser.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                activeUser.name || "User",
                              )}&background=161b22&color=22c55e&bold=true`
                            }
                            alt={post.authorName || activeUser.name}
                            className="w-6 h-6 rounded-full border border-border-muted object-cover p-px"
                          />
                          <span className="text-text-subtle text-sm font-medium truncate">
                            {post.authorName || activeUser.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-text-subtle text-sm shrink-0">
                          <span className="flex items-center gap-1">
                            <Heart size={13} className="text-red-500" />{" "}
                            {post.likedBy?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={13} />{" "}
                            {post.commentsList?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-text-muted text-sm bg-bg-elevated border border-border rounded-2xl">
              <p className="font-medium text-base mb-1">
                No projects posted yet
              </p>
              <p className="text-xs text-text-subtle">
                Share your hardware and IoT creations with the community!
              </p>
            </div>
          ))}

        {/* 2. My Sell Items Tab (Desktop မှာ ၁ တန်းကို ၄ ကတ်) */}
        {activeTab === "sell" &&
          (marketLoading ? (
            <div className="text-center py-12">
              <Loader2
                size={32}
                className="mx-auto text-primary animate-spin mb-3"
              />
              <p className="text-text-muted text-sm">
                Loading your listings...
              </p>
            </div>
          ) : mySellItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {mySellItems.map((item, index) => {
                const isSaved =
                  currentUser &&
                  Array.isArray(item.savedUsers) &&
                  item.savedUsers.some((data) =>
                    typeof data === "object"
                      ? String(data.userId) === String(currentUser.id)
                      : String(data) === String(currentUser.id),
                  );

                const displayImage =
                  Array.isArray(item.images) && item.images.length > 0
                    ? item.images[0]
                    : "https://images.unsplash.com/photo-1608564697171-2f6118fc5f37?w=500";

                const displayAvatar =
                  item.sellerAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    item.sellerName || "Seller",
                  )}&background=161b22&color=22c55e&bold=true`;

                const formattedCondition = item.condition
                  ? item.condition.replace(/_/g, " ").toUpperCase()
                  : "USED";

                return (
                  <div
                    key={`${item.id || item._id}-${index}`}
                    className="block h-full group"
                  >
                    <div className="h-full flex flex-col rounded-xl sm:rounded-2xl border border-border bg-bg-elevated/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-bg-elevated hover:border-primary/40 hover:shadow-xl">
                      <div className="p-1 relative">
                        <div className="h-28 sm:h-44 w-full rounded-lg sm:rounded-2xl overflow-hidden bg-black/40 relative">
                          <img
                            src={displayImage}
                            alt={item.title || "Item"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1608564697171-2f6118fc5f37?w=500";
                            }}
                          />
                        </div>
                        <span className="absolute top-2 right-2 sm:top-3 sm:right-3 inline-flex items-center text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-primary shadow-sm tracking-wider">
                          {formattedCondition}
                        </span>
                      </div>

                      <div className="p-2 sm:p-3 flex flex-col flex-1">
                        <div className="flex items-center justify-between text-text-subtle text-xs font-medium mb-1 border-b border-border-muted/60 pb-1">
                          <span className="inline-flex items-center gap-1 uppercase tracking-wider text-[9px] sm:text-[10px] font-bold text-primary">
                            <Tag size={10} className="sm:w-3 sm:h-3" />
                            {item.category || "Others"}
                          </span>
                          {item.boardTag && (
                            <span className="text-[9px] sm:text-[10px] text-text-muted uppercase">
                              #{item.boardTag}
                            </span>
                          )}
                        </div>

                        <h3
                          className="text-text text-xs sm:text-base mb-0.5 sm:mb-1 font-bold line-clamp-1 group-hover:text-primary transition-colors"
                          title={item.title}
                        >
                          {item.title || "Untitled Item"}
                        </h3>

                        <div className="text-primary font-black text-sm sm:text-lg mb-1 sm:mb-1.5">
                          {typeof item.price === "number"
                            ? `${item.price.toLocaleString()} MMK`
                            : item.price || "0 MMK"}
                        </div>

                        <p className="text-text-muted text-[11px] sm:text-xs leading-relaxed mb-2.5 line-clamp-2 break-words overflow-hidden">
                          {item.description || "No description provided."}
                        </p>

                        <div className="pt-2 border-t border-border-muted/60 mt-auto">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={displayAvatar}
                                alt={item.sellerName || "Seller"}
                                className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-border-muted object-cover p-px"
                              />
                              <span className="text-text-subtle text-[10px] sm:text-xs max-w-[80px] sm:max-w-[130px] font-medium truncate">
                                {item.sellerName || "Anonymous"}
                              </span>
                            </div>

                            {item.location && (
                              <div className="hidden md:flex items-center gap-1 text-[11px] text-text-muted shrink-0 min-w-0">
                                <MapPin
                                  size={14}
                                  className="shrink-0 text-text-subtle"
                                />
                                <span className="truncate">
                                  {item.location.township},{" "}
                                  {item.location.state.toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Link
                              to={`/marketplace/items/${item.id || item._id}`}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-surface hover:bg-bg-elevated text-text text-[11px] sm:text-xs font-semibold py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-border hover:border-primary/40 active:scale-95 transition-all"
                            >
                              <Eye
                                size={12}
                                className="sm:w-[14px] sm:h-[14px]"
                              />{" "}
                              View
                            </Link>
                            <button
                              onClick={(e) =>
                                handleToggleSave(e, item.id || item._id)
                              }
                              className="px-2 sm:px-3 bg-surface hover:bg-bg-elevated text-text rounded-xl border border-border hover:border-primary/40 flex items-center justify-center active:scale-95 transition-all"
                              title={
                                isSaved ? "Remove Watchlist" : "Add Watchlist"
                              }
                            >
                              <Bookmark
                                size={18}
                                className={
                                  isSaved
                                    ? "text-primary fill-primary sm:w-[16px] sm:h-[16px]"
                                    : " sm:w-[16px] sm:h-[16px]"
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-text-muted text-sm bg-bg-elevated border border-border rounded-2xl">
              <p className="font-medium text-base mb-1">
                No marketplace items listed
              </p>
              <p className="text-xs text-text-subtle">
                List your electronic parts, boards, or modules for sale!
              </p>
            </div>
          ))}

        {/* 3. My Save Items Tab (Desktop မှာ ၁ တန်းကို ၄ ကတ်) */}
        {activeTab === "saves" &&
          (marketLoading ? (
            <div className="text-center py-12">
              <Loader2
                size={32}
                className="mx-auto text-primary animate-spin mb-3"
              />
              <p className="text-text-muted text-sm">Loading saved items...</p>
            </div>
          ) : mySaveItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {mySaveItems.map((item, index) => {
                const isSaved =
                  currentUser &&
                  Array.isArray(item.savedUsers) &&
                  item.savedUsers.some((data) =>
                    typeof data === "object"
                      ? String(data.userId) === String(currentUser.id)
                      : String(data) === String(currentUser.id),
                  );

                const displayImage =
                  Array.isArray(item.images) && item.images.length > 0
                    ? item.images[0]
                    : "https://images.unsplash.com/photo-1608564697171-2f6118fc5f37?w=500";

                const displayAvatar =
                  item.sellerAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    item.sellerName || "Seller",
                  )}&background=161b22&color=22c55e&bold=true`;

                const formattedCondition = item.condition
                  ? item.condition.replace(/_/g, " ").toUpperCase()
                  : "USED";

                return (
                  <div
                    key={`${item.id || item._id}-${index}`}
                    className="block h-full group"
                  >
                    <div className="h-full flex flex-col rounded-xl sm:rounded-2xl border border-border bg-bg-elevated/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-bg-elevated hover:border-primary/40 hover:shadow-xl">
                      <div className="p-1 relative">
                        <div className="h-28 sm:h-44 w-full rounded-lg sm:rounded-2xl overflow-hidden bg-black/40 relative">
                          <img
                            src={displayImage}
                            alt={item.title || "Item"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1608564697171-2f6118fc5f37?w=500";
                            }}
                          />
                        </div>
                        <span className="absolute top-2 right-2 sm:top-3 sm:right-3 inline-flex items-center text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-primary shadow-sm tracking-wider">
                          {formattedCondition}
                        </span>
                      </div>

                      <div className="p-2 sm:p-3 flex flex-col flex-1">
                        <div className="flex items-center justify-between text-text-subtle text-xs font-medium mb-1 border-b border-border-muted/60 pb-1">
                          <span className="inline-flex items-center gap-1 uppercase tracking-wider text-[9px] sm:text-[10px] font-bold text-primary">
                            <Tag size={10} className="sm:w-3 sm:h-3" />
                            {item.category || "Others"}
                          </span>
                          {item.boardTag && (
                            <span className="text-[9px] sm:text-[10px] text-text-muted uppercase">
                              #{item.boardTag}
                            </span>
                          )}
                        </div>

                        <h3
                          className="text-text text-xs sm:text-base mb-0.5 sm:mb-1 font-bold line-clamp-1 group-hover:text-primary transition-colors"
                          title={item.title}
                        >
                          {item.title || "Untitled Item"}
                        </h3>

                        <div className="text-primary font-black text-sm sm:text-lg mb-1 sm:mb-1.5">
                          {typeof item.price === "number"
                            ? `${item.price.toLocaleString()} MMK`
                            : item.price || "0 MMK"}
                        </div>

                        <p className="text-text-muted text-[11px] sm:text-xs leading-relaxed mb-2.5 line-clamp-2 break-words overflow-hidden">
                          {item.description || "No description provided."}
                        </p>

                        <div className="pt-2 border-t border-border-muted/60 mt-auto">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={displayAvatar}
                                alt={item.sellerName || "Seller"}
                                className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-border-muted object-cover p-px"
                              />
                              <span className="text-text-subtle text-[10px] sm:text-xs max-w-[80px] sm:max-w-[130px] font-medium truncate">
                                {item.sellerName || "Anonymous"}
                              </span>
                            </div>

                            {item.location && (
                              <div className="hidden md:flex items-center gap-1 text-[11px] text-text-muted shrink-0 min-w-0">
                                <MapPin
                                  size={14}
                                  className="shrink-0 text-text-subtle"
                                />
                                <span className="truncate">
                                  {item.location.township},{" "}
                                  {item.location.state.toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Link
                              to={`/marketplace/items/${item.id || item._id}`}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-surface hover:bg-bg-elevated text-text text-[11px] sm:text-xs font-semibold py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-border hover:border-primary/40 active:scale-95 transition-all"
                            >
                              <Eye
                                size={12}
                                className="sm:w-[14px] sm:h-[14px]"
                              />{" "}
                              View
                            </Link>
                            <button
                              onClick={(e) =>
                                handleToggleSave(e, item.id || item._id)
                              }
                              className="px-2 sm:px-3 bg-surface hover:bg-bg-elevated text-text rounded-xl border border-border hover:border-primary/40 flex items-center justify-center active:scale-95 transition-all"
                              title={
                                isSaved ? "Remove Watchlist" : "Add Watchlist"
                              }
                            >
                              <Bookmark
                                size={18}
                                className={
                                  isSaved
                                    ? "text-primary fill-primary sm:w-[16px] sm:h-[16px]"
                                    : " sm:w-[16px] sm:h-[16px]"
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-text-muted text-sm bg-bg-elevated border border-border rounded-2xl">
              <p className="font-medium text-base mb-1">
                No saved items in watchlist
              </p>
              <p className="text-xs text-text-subtle">
                Browse the marketplace and bookmark items you like!
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Profile;