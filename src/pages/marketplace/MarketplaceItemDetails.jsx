import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Tag,
  MapPin,
  Bookmark,
  Phone,
  Share2,
  Loader2,
  ShieldCheck,
  Check,
  FileText,
  Info,
  UserCheck,
  Calendar,
  ExternalLink,
  Copy,
  DollarSign,
  Heart,
  Layers,
  Cpu,
  Package,
  Video,
} from "lucide-react";

// API & Custom Hooks
import {
  getMarketplaceItemById,
  updateMarketplaceItem,
} from "../../api/marketplaceApi";
import { useAlert } from "../../context/AlertContext";

// --- Custom Brand SVG Icons ---
const TelegramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const MessengerIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.16 7.19V22l3.03-1.66c1.17.33 2.43.51 3.81.51 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm1.12 13.01l-2.54-2.71-4.96 2.71 5.45-5.79 2.6 2.71 4.9-2.71-5.45 5.79z" />
  </svg>
);

const ViberIcon = () => (
  <svg
    className="w-4 h-4 fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
  >
    <path d="M508.3 113.9C495.6 102.2 444.2 64.9 329.6 64.4C329.6 64.4 194.5 56.3 128.7 116.7C92.1 153.3 79.2 207 77.8 273.5C76.4 340 74.7 464.6 194.8 498.4L194.9 498.4L194.8 550C194.8 550 194 570.9 207.8 575.1C224.4 580.3 234.2 564.4 250.1 547.3C258.8 537.9 270.8 524.1 279.9 513.6C362.1 520.5 425.2 504.7 432.4 502.4C449 497 542.9 485 558.1 360.4C573.9 231.8 550.5 150.6 508.3 113.9zM522.2 351C509.3 455 433.2 461.6 419.2 466.1C413.2 468 357.7 481.8 288 477.3C288 477.3 236 540 219.8 556.3C214.5 561.6 208.7 561.1 208.8 550.6C208.8 543.7 209.2 464.9 209.2 464.9L209.2 464.9C107.4 436.7 113.4 330.6 114.5 275.1C115.6 219.6 126.1 174.1 157.1 143.5C212.8 93 327.5 100.5 327.5 100.5C424.4 100.9 470.8 130.1 481.6 139.9C517.3 170.5 535.5 243.7 522.2 351zM383.2 270.2C383.6 278.8 370.7 279.4 370.3 270.8C369.2 248.8 358.9 238.1 337.7 236.9C329.1 236.4 329.9 223.5 338.4 224C366.3 225.5 381.8 241.5 383.2 270.2zM403.5 281.5C404.5 239.1 378 205.9 327.7 202.2C319.2 201.6 320.1 188.7 328.6 189.3C386.6 193.5 417.5 233.4 416.4 281.8C416.3 290.4 403.3 290 403.5 281.5zM450.5 294.9C450.6 303.5 437.6 303.6 437.6 295C437 213.5 382.7 169.1 316.8 168.6C308.3 168.5 308.3 155.7 316.8 155.7C390.5 156.2 449.8 207.1 450.5 294.9zM439.2 393L439.2 393.2C428.4 412.2 408.2 433.2 387.4 426.5L387.2 426.2C366.1 420.3 316.4 394.7 285 369.7C268.8 356.9 254 341.8 242.6 327.3C232.3 314.4 221.9 299.1 211.8 280.7C190.5 242.2 185.8 225 185.8 225C179.1 204.2 200 184 219.1 173.2L219.3 173.2C228.5 168.4 237.3 170 243.2 177.1C243.2 177.1 255.6 191.9 260.9 199.2C265.9 206 272.6 216.9 276.1 223C282.2 233.9 278.4 245 272.4 249.6L260.4 259.2C254.3 264.1 255.1 273.2 255.1 273.2C255.1 273.2 272.9 340.5 339.4 357.5C339.4 357.5 348.5 358.3 353.4 352.2L363 340.2C367.6 334.2 378.7 330.4 389.6 336.5C404.3 344.8 423 357.7 435.4 369.4C442.4 375.1 444 383.8 439.2 393z" />
  </svg>
);

const TikTokIcon = () => (
  <svg
    className="w-4 h-4 fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
  >
    <path d="M448.5 209.9c-44 .1-87-13.6-122.8-39.2l0 178.7c0 33.1-10.1 65.4-29 92.6s-45.6 48-76.6 59.6-64.8 13.5-96.9 5.3-60.9-25.9-82.7-50.8-35.3-56-39-88.9 2.9-66.1 18.6-95.2 40-52.7 69.6-67.7 62.9-20.5 95.7-16l0 89.9c-15-4.7-31.1-4.6-46 .4s-27.9 14.6-37 27.3-14 28.1-13.9 43.9 5.2 31 14.5 43.7 22.4 22.1 37.4 26.9 31.1 4.8 46-.1 28-14.4 37.2-27.1 14.2-28.1 14.2-43.8l0-349.4 88 0c-.1 7.4 .6 14.9 1.9 22.2 3.1 16.3 9.4 31.9 18.7 45.7s21.3 25.6 35.2 34.6c19.9 13.1 43.2 20.1 67 20.1l0 87.4z" />
  </svg>
);

const YoutubeIcon = ({ className = "w-4 h-4 fill-current" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// --- YouTube Embed URL Helper ---
const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  let videoId = "";
  if (url.includes("youtube.com/shorts/")) {
    videoId = url.split("youtube.com/shorts/")[1]?.split("?")[0];
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

function MarketplaceItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showAlert = useAlert();

  const currentUser = useSelector((state) => state.auth?.user);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [activeTab, setActiveTab] = useState("description"); // 'description' | 'details' | 'bom' | 'video' | 'seller'
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await getMarketplaceItemById(id);
        if (isMounted) {
          setItem(data);
          const initialImg =
            Array.isArray(data?.images) && data.images.length > 0
              ? data.images[0]
              : "https://images.unsplash.com/photo-1608564697171-2f6118fc5f37?w=800";
          setSelectedImage(initialImg);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Item မရှာဖွေနိုင်ပါ");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchItem();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Saved/Wishlist Check
  const isSaved =
    currentUser &&
    item &&
    Array.isArray(item.savedUsers) &&
    item.savedUsers.some((data) =>
      typeof data === "object"
        ? String(data.userId) === String(currentUser.id)
        : String(data) === String(currentUser.id),
    );

  const handleToggleWishlist = async () => {
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

    const userId = String(currentUser.id);
    const savedAt = Date.now().toString();
    const previousItem = { ...item };

    const savedUsers = Array.isArray(item.savedUsers) ? item.savedUsers : [];
    const alreadySaved = savedUsers.some((data) =>
      typeof data === "object"
        ? String(data.userId) === userId
        : String(data) === userId,
    );

    const updatedWishlist = alreadySaved
      ? savedUsers.filter((data) =>
          typeof data === "object"
            ? String(data.userId) !== userId
            : String(data) !== userId,
        )
      : [...savedUsers, { userId, savedAt }];

    setItem((prev) => ({ ...prev, savedUsers: updatedWishlist }));

    try {
      await updateMarketplaceItem(item.id, {
        ...item,
        savedUsers: updatedWishlist,
      });
      showAlert(alreadySaved ? "Removed from Saved" : "Added to Saved!");
    } catch (err) {
      console.error("Wishlist Update Error:", err);
      setItem(previousItem);
      showAlert({ message: "Failed to update watchlist. Please try again." });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title || "Marketplace Item",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showAlert("Link copied to clipboard!");
    }
  };

  const handleCopyText = (text, type = "Text") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "Phone") {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      showAlert(`${type} copied to clipboard!`);
    }
  };

  const formatSocialUrl = (type, value) => {
    if (!value || value === "t.me/" || value === "https://t.me") return null;
    if (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("viber://")
    ) {
      return value;
    }
    switch (type) {
      case "telegram":
        return `https://t.me/${value.replace("@", "")}`;
      case "messenger":
        return `https://m.me/${value.replace("m.me/", "")}`;
      case "viber":
        return `viber://chat?number=${encodeURIComponent(value)}`;
      case "tiktok":
        return `https://tiktok.com/${value.startsWith("@") ? value : "@" + value}`;
      default:
        return value;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16">
        <Loader2 size={36} className="text-primary animate-spin mb-3" />
        <p className="text-text-muted text-sm font-medium">
          Loading details...
        </p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-400 font-semibold mb-4">
          {error || "Item detail ရှာမတွေ့ပါ"}
        </p>
        <button
          onClick={() => navigate("/marketplace")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface hover:bg-bg-elevated border border-border text-text rounded-xl transition-all"
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </button>
      </div>
    );
  }

  const imagesList =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : ["https://images.unsplash.com/photo-1608564697171-2f6118fc5f37?w=800"];

  const displayAvatar =
    item.sellerAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      item.sellerName || "Seller",
    )}&background=161b22&color=0d9488&bold=true`;

  const formattedCondition = item.condition
    ? item.condition.replace(/_/g, " ").toUpperCase()
    : "USED";

  const contacts = item.contactMethods || {};
  const preferred = contacts.preferredMethod || "any";
  const phone = contacts.phone || item.sellerPhone;

  const telegramUrl = formatSocialUrl("telegram", contacts.telegram);
  const messengerUrl = formatSocialUrl("messenger", contacts.messenger);
  const viberUrl = formatSocialUrl("viber", contacts.viber);
  const tiktokUrl = formatSocialUrl("tiktok", contacts.tiktok);

  const embedVideoUrl = getYoutubeEmbedUrl(item.demoVideoUrl);

  const formattedCreatedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  // Check if API includes components array (BOM)
  const componentsList = Array.isArray(item.components) ? item.components : [];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 md:py-10">
      {/* Back Button & Action Controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-text-subtle hover:text-text bg-surface hover:bg-bg-elevated px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-border transition-all active:scale-95"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 bg-surface hover:bg-bg-elevated text-text rounded-xl border border-border hover:border-primary/40 active:scale-95 transition-all"
            title="Share Item"
          >
            <Share2 size={18} />
          </button>
          <button
            onClick={handleToggleWishlist}
            className="p-2 bg-surface hover:bg-bg-elevated text-text rounded-xl border border-border hover:border-primary/40 active:scale-95 transition-all"
            title={isSaved ? "Remove Watchlist" : "Add Watchlist"}
          >
            <Bookmark
              size={18}
              className={
                isSaved ? "text-primary fill-primary" : "text-text-muted"
              }
            />
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* LEFT COLUMN: Main Image with Small Thumbnails UNDER IT */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative w-full h-80 sm:h-96 md:h-[460px] rounded-2xl overflow-hidden bg-black/50 border border-border flex items-center justify-center">
            <img
              src={selectedImage}
              alt={item.title || "Item Image"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1608564697171-2f6118fc5f37?w=800";
              }}
            />

            <div className="absolute top-3 right-3 flex gap-2">
              {item.isSold && (
                <span className="text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full bg-red-500/90 text-white tracking-wider shadow-md">
                  SOLD OUT
                </span>
              )}
              <span className="text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full bg-black/70 border border-white/15 backdrop-blur-md text-primary tracking-wider shadow-md">
                {formattedCondition}
              </span>
            </div>
          </div>

          {/* Thumbnails Row UNDER Big Image */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === imgUrl
                      ? "border-primary scale-95 shadow-md shadow-primary/20 opacity-100"
                      : "border-border hover:border-border-muted opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Info, Price, Location & Contacts Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-bg-elevated/40 border border-border rounded-2xl p-5 sm:p-6">
          <div>
            {/* Category & Board Tag */}
            <div className="flex items-center justify-between text-xs font-medium mb-3 pb-2 border-b border-border/40">
              <span className="inline-flex items-center gap-1.5 uppercase tracking-wider font-bold text-primary">
                <Tag size={14} />
                {item.category || "General"}
              </span>
              {item.boardTag && (
                <span className="font-mono text-text-muted bg-surface px-2.5 py-0.5 rounded border border-border text-[11px]">
                  #{item.boardTag}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-text mb-3 leading-tight">
              {item.title || "Untitled Item"}
            </h1>

            {/* Price & Negotiable Status */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl sm:text-3xl font-black text-primary">
                {typeof item.price === "number"
                  ? `${item.price.toLocaleString()} MMK`
                  : item.price || "0 MMK"}
              </span>
              {item.isNegotiable && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
                  <DollarSign size={12} /> စျေးညှိနိုင်သည်
                </span>
              )}
            </div>

            {/* Location & Post Date */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mb-5">
              {item.location && (
                <div className="inline-flex items-center gap-1.5 bg-surface/80 px-3 py-1.5 rounded-lg border border-border/60">
                  <MapPin size={14} className="text-primary shrink-0" />
                  <span>
                    {item.location.township},{" "}
                    {item.location.state?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 bg-surface/80 px-3 py-1.5 rounded-lg border border-border/60">
                <Calendar size={14} className="text-text-subtle shrink-0" />
                <span>Posted: {formattedCreatedDate}</span>
              </div>
            </div>
          </div>

          {/* Seller Card & Social Contacts */}
          <div className="pt-4 border-t border-border/60 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={displayAvatar}
                  alt={item.sellerName || "Seller"}
                  className="w-11 h-11 rounded-full border border-primary/40 object-cover p-0.5"
                />
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-text">
                    {item.sellerName || "Anonymous Seller"}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] text-primary">
                    <ShieldCheck size={12} /> Joined{" "}
                    {item.sellerJoinDate || "2026"}
                  </span>
                </div>
              </div>

              {item.savedUsers?.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-text-muted bg-surface px-2.5 py-1 rounded-lg border border-border">
                  <Bookmark
                    size={12}
                    className="text-primary fill-primary sm:w-[16px] sm:h-[16px]"
                  />
                  {item.savedUsers.length} saved
                </span>
              )}
            </div>

            {/* Phone Contact Block */}
            {phone && phone !== "09xxxxxxxxx" ? (
              <div className="flex gap-2">
                <a
                  href={`tel:${phone}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-black font-extrabold text-xs sm:text-sm py-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-primary/20"
                >
                  <Phone size={16} /> CALL ({phone})
                  {preferred === "phone" && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary text-white">
                      Preferred
                    </span>
                  )}
                </a>
                <button
                  onClick={() => handleCopyText(phone, "Phone")}
                  className="px-3 bg-surface hover:bg-bg-elevated border border-border text-text rounded-xl text-xs font-semibold transition-all"
                  title="Copy Phone Number"
                >
                  {copiedPhone ? (
                    <Check size={16} className="text-primary" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            ) : (
              <div className="text-xs text-amber-400/90 bg-amber-950/30 border border-amber-800/40 px-3 py-2 rounded-xl text-center">
                ဖုန်းနံပါတ် သီးသန့်ထည့်သွင်းထားခြင်းမရှိပါ။
              </div>
            )}

            {/* Real Social Media Contact Icons Strip */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-subtle">
                Other Contact Methods:
              </span>

              {telegramUrl || messengerUrl || viberUrl || tiktokUrl ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Telegram */}
                  {telegramUrl && (
                    <a
                      href={telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative flex items-center justify-center gap-1.5 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] text-xs font-bold py-2 px-2 rounded-xl transition-all ${
                        preferred === "telegram" ? "ring-2 ring-[#229ED9]" : ""
                      }`}
                    >
                      <TelegramIcon /> Telegram
                      {preferred === "telegram" && (
                        <span className="absolute -top-1.5 -right-1.5 bg-[#229ED9] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                          ★
                        </span>
                      )}
                    </a>
                  )}

                  {/* Messenger */}
                  {messengerUrl && (
                    <a
                      href={messengerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative flex items-center justify-center gap-1.5 bg-[#0084FF]/10 hover:bg-[#0084FF]/20 border border-[#0084FF]/30 text-[#0084FF] text-xs font-bold py-2 px-2 rounded-xl transition-all ${
                        preferred === "messenger" ? "ring-2 ring-[#0084FF]" : ""
                      }`}
                    >
                      <MessengerIcon /> Messenger
                      {preferred === "messenger" && (
                        <span className="absolute -top-1.5 -right-1.5 bg-[#0084FF] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                          ★
                        </span>
                      )}
                    </a>
                  )}

                  {/* Viber */}
                  {viberUrl && (
                    <a
                      href={viberUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative flex items-center justify-center gap-1.5 bg-[#7360F2]/10 hover:bg-[#7360F2]/20 border border-[#7360F2]/30 text-[#7360F2] text-xs font-bold py-2 px-2 rounded-xl transition-all ${
                        preferred === "viber" ? "ring-2 ring-[#7360F2]" : ""
                      }`}
                    >
                      <ViberIcon /> Viber
                      {preferred === "viber" && (
                        <span className="absolute -top-1.5 -right-1.5 bg-[#7360f2] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                          ★
                        </span>
                      )}
                    </a>
                  )}

                  {/* TikTok (API Typo စစ်ဆေးရန် "titok" ပါ ထည့်ထားသည်) */}
                  {tiktokUrl && (
                    <a
                      href={tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold py-2 px-2 rounded-xl transition-all ${
                        preferred === "tiktok" || preferred === "titok"
                          ? "ring-2 ring-red-500"
                          : ""
                      }`}
                    >
                      <TikTokIcon /> TikTok
                      {(preferred === "tiktok" || preferred === "titok") && (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                          ★
                        </span>
                      )}
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-xs text-text-subtle italic bg-surface/50 border border-border/50 py-2 px-3 rounded-xl">
                  No other contact methods provided.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: Tabs for Description, Specifications, BOM Components & Embedded Video */}
      <div className="bg-bg-elevated/30 border border-border rounded-2xl p-4 sm:p-6">
        {/* Tab Buttons Navigation */}
        <div className="flex items-center gap-6 border-b border-border/60 pb-3 mb-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("description")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase pb-2 transition-all whitespace-nowrap ${
              activeTab === "description"
                ? "text-primary border-b-2 border-primary -mb-[13px]"
                : "text-text-subtle hover:text-text"
            }`}
          >
            <FileText size={15} /> Description
          </button>

          <button
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase pb-2 transition-all whitespace-nowrap ${
              activeTab === "details"
                ? "text-primary border-b-2 border-primary -mb-[13px]"
                : "text-text-subtle hover:text-text"
            }`}
          >
            <Info size={15} /> Specifications
          </button>

          {/* New BOM / Components Tab */}
          <button
            onClick={() => setActiveTab("bom")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase pb-2 transition-all whitespace-nowrap ${
              activeTab === "bom"
                ? "text-primary border-b-2 border-primary -mb-[13px]"
                : "text-text-subtle hover:text-text"
            }`}
          >
            <Layers size={15} className="text-cyan-400" /> Devices & Components
            (BOM)
            {componentsList.length > 0 && (
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.2 rounded-full border border-primary/30">
                {componentsList.length}
              </span>
            )}
          </button>

          {item.demoVideoUrl && (
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase pb-2 transition-all whitespace-nowrap ${
                activeTab === "video"
                  ? "text-primary border-b-2 border-primary -mb-[13px]"
                  : "text-text-subtle hover:text-text"
              }`}
            >
              <YoutubeIcon className="w-4 h-4 text-red-500 fill-current" /> Demo
              Video
            </button>
          )}

          <button
            onClick={() => setActiveTab("seller")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase pb-2 transition-all whitespace-nowrap ${
              activeTab === "seller"
                ? "text-primary border-b-2 border-primary -mb-[13px]"
                : "text-text-subtle hover:text-text"
            }`}
          >
            <UserCheck size={15} /> Seller Info
          </button>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[160px]">
          {/* Description Tab */}
          {activeTab === "description" && (
            <div className="text-text-muted text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words bg-black/20 p-4 rounded-xl border border-border/40">
              {item.description ||
                "No full description provided for this item."}
            </div>
          )}

          {/* Specifications Table (Redesigned Modern UI Table) */}
          {activeTab === "details" && (
            <div className="overflow-hidden rounded-xl border border-border/60 bg-surface/30">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-surface/80 border-b border-border/60 text-text-subtle font-semibold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4 w-1/3 sm:w-1/4">Specification</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-text">
                  <tr className="hover:bg-surface/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-text-subtle flex items-center gap-2">
                      <Tag size={14} className="text-primary" /> Condition
                    </td>
                    <td className="py-3 px-4 font-bold text-primary">
                      {formattedCondition}
                    </td>
                  </tr>

                  <tr className="bg-surface/20 hover:bg-surface/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-text-subtle flex items-center gap-2">
                      <Package size={14} className="text-cyan-400" /> Category
                    </td>
                    <td className="py-3 px-4 font-medium capitalize">
                      {item.category || "General"}
                    </td>
                  </tr>

                  {item.boardTag && (
                    <tr className="hover:bg-surface/40 transition-colors">
                      <td className="py-3 px-4 font-medium text-text-subtle flex items-center gap-2">
                        <Cpu size={14} className="text-amber-400" /> Controller
                        Tag
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        #{item.boardTag}
                      </td>
                    </tr>
                  )}

                  <tr className="bg-surface/20 hover:bg-surface/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-text-subtle flex items-center gap-2">
                      <DollarSign size={14} className="text-emerald-400" />{" "}
                      Price Negotiable
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {item.isNegotiable ? (
                        <span className="text-emerald-400">
                          Yes (ညှိနှိုင်းနိုင်သည်)
                        </span>
                      ) : (
                        <span className="text-text-muted">Fixed Price</span>
                      )}
                    </td>
                  </tr>

                  {item.location && (
                    <tr className="hover:bg-surface/40 transition-colors">
                      <td className="py-3 px-4 font-medium text-text-subtle flex items-center gap-2">
                        <MapPin size={14} className="text-rose-400" /> Location
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {item.location.township},{" "}
                        {item.location.state?.toUpperCase()}
                      </td>
                    </tr>
                  )}

                  <tr className="bg-surface/20 hover:bg-surface/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-text-subtle flex items-center gap-2">
                      <Calendar size={14} className="text-indigo-400" /> Listing
                      Date
                    </td>
                    <td className="py-3 px-4 font-medium text-text-subtle">
                      {formattedCreatedDate}
                    </td>
                  </tr>

                  <tr className="hover:bg-surface/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-text-subtle">
                      Listing ID
                    </td>
                    <td className="py-3 px-4 font-mono text-text-muted text-xs">
                      {item.id}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* DEVICES & COMPONENTS (BOM) TAB - Production Ready Structure */}
          {activeTab === "bom" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-surface/50 p-3.5 rounded-xl border border-border/60">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-text font-medium">
                  <Layers size={18} className="text-primary shrink-0" />
                  <span>
                    ပါဝင်သော ပစ္စည်းများနှင့် အပိုပစ္စည်းစာရင်းများ (Bill of
                    Materials)
                  </span>
                </div>
                <span className="text-xs text-text-muted">
                  Total Items: {componentsList.length}
                </span>
              </div>

              {componentsList.length > 0 ? (
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="text-primary" size={20} />
                    <h3 className="text-lg font-bold text-text">
                      Included Components ({item.components.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.components.map((comp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border/80 hover:border-primary/40 transition-all"
                      >
                        {/* Component Image */}
                        <div className="w-12 h-12 rounded-lg bg-bg-elevated border border-border overflow-hidden shrink-0">
                          <img
                            src={
                              comp.image ||
                              "https://images.unsplash.com/photo-1608564697171-2f6118fc5f37?w=200"
                            }
                            alt={comp.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1608564697171-2f6118fc5f37?w=200";
                            }}
                          />
                        </div>

                        {/* Component Info */}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-text truncate">
                            {comp.name || "Unnamed Component"}
                          </h4>
                          <p className="text-xs text-text-muted mt-0.5">
                            Qty:{" "}
                            <span className="text-primary font-bold">
                              {comp.quantity || "1"}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Empty / Preview State when current listing is single item */
                <div className="text-center py-10 px-4 bg-surface/20 border border-dashed border-border/80 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <div className="p-3 bg-surface rounded-full text-text-muted border border-border">
                    <Package size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text mb-1">
                      တစ်လုံးချင်း/အထုပ်လိုက် ရောင်းချသော ပစ္စည်းဖြစ်ပါသည်
                    </h4>
                    <p className="text-xs text-text-muted max-w-md">
                      Post တင်သူမှ သီးခြားခွဲရောင်းမည့် အပိုပစ္စည်းစာရင်းများ
                      (BOM Breakdown) ထည့်သွင်းထားခြင်း မရှိသေးပါ။
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Embedded YouTube Demo Video Tab */}
          {activeTab === "video" && item.demoVideoUrl && (
            <div className="flex flex-col gap-4">
              {embedVideoUrl ? (
                /* Responsive 16:9 Embedded YouTube Player */
                <div className="relative w-full aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden border border-border shadow-2xl bg-black">
                  <iframe
                    src={embedVideoUrl}
                    title="Product Demo Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="p-4 bg-surface/30 rounded-xl text-xs text-text-muted text-center">
                  ဗီဒီယိုကို တိုက်ရိုက် ပြသ၍ မရသေးပါ။ အောက်ပါ Link တွင် နှိပ်၍
                  ကြည့်ရှုနိုင်ပါသည်။
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                <span className="text-xs text-text-muted flex items-center gap-1.5">
                  <Video size={14} className="text-red-500" /> YouTube Direct
                  Link:
                </span>
                <a
                  href={item.demoVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-red-400 bg-red-950/30 border border-red-800/40 px-3.5 py-2 rounded-xl hover:bg-red-900/40 transition-all"
                >
                  <YoutubeIcon className="w-4 h-4 text-red-500 fill-current" />{" "}
                  Open in YouTube <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}

          {/* Seller Info Tab */}
          {activeTab === "seller" && (
            <div className="flex items-center gap-4 p-4 bg-surface/50 rounded-xl border border-border/40">
              <img
                src={displayAvatar}
                alt={item.sellerName || "Seller"}
                className="w-12 h-12 rounded-full border border-primary object-cover"
              />
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-text">
                  {item.sellerName || "Anonymous"}
                </h4>
                <p className="text-xs text-text-muted mb-1">
                  Seller ID: {item.sellerId || "N/A"}
                </p>
                <p className="text-xs text-primary font-medium">
                  Joined: {item.sellerJoinDate || "2026"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketplaceItemDetails;
