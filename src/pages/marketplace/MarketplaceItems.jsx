import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Loader2, Eye, Bookmark, Tag, MapPin, Layers } from "lucide-react";

// API & Custom Hooks
import { useFetch } from "../../hooks/useFetch";
import {
  getMarketplaceItems,
  updateMarketplaceItem,
} from "../../api/marketplaceApi";
import { useAlert } from "../../context/AlertContext";

function MarketplaceGrid({ activeCategory, searchQuery = "" }) {
  // console.log("active category", activeCategory);

  // useFetch hook
  const { data: items, loading, error } = useFetch(getMarketplaceItems);

  // using usestate to change ui immediately
  const [itemList, setItemList] = useState([]);
  useEffect(() => {
    if (items) {
      setItemList(items);
    }
  }, [items]);

  const navigate = useNavigate();
  const showAlert = useAlert();

  //Fix — localStorage.getItem("userSession") အစား Redux
  const currentUser = useSelector((state) => state.auth.user);

  // filter items with categories nav bar
  function getFilteredItems() {
    if (!itemList || itemList.length === 0) return [];

    let result = itemList;

    // 1. Saved Items စစ်ဆေးခြင်း
    if (activeCategory.toLowerCase() === "saved items") {
      if (!currentUser) return [];
      result = itemList.filter((item) => {
        const savedItems = Array.isArray(item.savedUsers)
          ? item.savedUsers
          : [];
        return savedItems.some((data) =>
          typeof data === "object"
            ? String(data.userId) === String(currentUser?.id)
            : String(data) === String(currentUser?.id),
        );
      });

      result.sort((a, b) => {
        const getSavedTime = (item) => {
          const savedItems = Array.isArray(item.savedUsers)
            ? item.savedUsers
            : [];
          const entry = savedItems.find((data) =>
            typeof data === "object"
              ? String(data.userId) === String(currentUser?.id)
              : String(data) === String(currentUser?.id),
          );
          return typeof entry === "object" && entry?.savedAt
            ? entry.savedAt
            : 0;
        };
        return getSavedTime(b) - getSavedTime(a);
      });
    }
    // ★ Search Query ရိုက်မထားချိန်မှသာ Category အလိုက် Filter လုပ်မည်
    // (Search Query ပါလာပါက Category အားလုံးထဲမှ ရှာပေးမည်)
    else if (activeCategory.toLowerCase() !== "all" && !searchQuery.trim()) {
      result = itemList.filter(
        (item) => item.category?.toLowerCase() === activeCategory.toLowerCase(),
      );
    }

    // ★ 2. Search Query Matching Logic (Space, Dash & Case Insensitive)
    // 2. Search Query Matching Logic
    if (searchQuery.trim()) {
      const rawQ = searchQuery.trim().toLowerCase();
      const cleanQ = rawQ.replace(/\(.*?\)/g, "").replace(/[-_ ]/g, "");

      result = result.filter((item) => {
        const normalize = (text) =>
          text ? String(text).toLowerCase().replace(/[-_ ]/g, "") : "";

        const inTitle = normalize(item.title).includes(cleanQ);
        const inDescription = normalize(item.description).includes(cleanQ);
        const inBoardTag = normalize(item.boardTag).includes(cleanQ);
        const inCategory = normalize(item.category).includes(cleanQ);

        const inComponents = Array.isArray(item.components)
          ? item.components.some((comp) =>
              normalize(comp.name).includes(cleanQ),
            )
          : false;

        return (
          inTitle || inDescription || inBoardTag || inCategory || inComponents
        );
      });
    }

    return [...result].reverse();
  }

  const filteredItems = getFilteredItems();

  // savedItems toggle
  const handleToggleWishlist = async (e, itemId) => {
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

    const userId = String(currentUser.id);
    const savedAt = Date.now().toString();

    // A. မူလ State ကို Backup လုပ်ထားမယ် (Error တက်ရင် ပြန်လှည့်ဖို့)
    const previousItems = [...itemList];

    // Target Item နဲ့ Current savedUsers Status ကို ရှာမယ်
    const targetItem = itemList.find(
      (item) => String(item.id) === String(itemId),
    );
    if (!targetItem) return;

    const savedUsers = Array.isArray(targetItem.savedUsers)
      ? targetItem.savedUsers
      : [];
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

    // B. Optimistic UI Update: Local State ကို ချက်ချင်း Update လုပ်လိုက်မယ်
    setItemList((prevItems) =>
      prevItems.map((item) =>
        String(item.id) === String(itemId)
          ? { ...item, savedUsers: updatedWishlist }
          : item,
      ),
    );

    // C. Background မှာ API Sync လုပ်မယ်
    try {
      await updateMarketplaceItem(itemId, {
        ...targetItem,
        savedUsers: updatedWishlist,
      });
      showAlert(alreadySaved ? "Removed from Saved" : "Added to Saved!");
    } catch (err) {
      console.error("savedItems Update Error:", err);
      // D. Error တက်ရင် မူလ State သို့ ပြန်လှည့်မယ် (Rollback)
      setItemList(previousItems);
      showAlert({ message: "Failed to update watchlist. Please try again." });
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-16"
      id="marketplaceSection"
    >
      {loading ? (
        <div className="text-center py-16">
          <Loader2
            size={32}
            className="mx-auto text-primary animate-spin mb-3"
          />
          <p className="text-text-muted">Loading marketplace items...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-400">
          <p>Failed to load marketplace items: {error}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg font-medium">No marketplace items found!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {filteredItems.map((item, index) => {
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
              `https://ui-avatars.com/api/?name=${encodeURIComponent(item.sellerName || "Seller")}&background=161b22&color=22c55e&bold=true`;

            const formattedCondition = item.condition
              ? item.condition.replace(/_/g, " ").toUpperCase() // "bench_tested" ➔ "bench tested"
              : "USED";

            return (
              <div key={`${item.id}-${index}`} className="block h-full group">
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
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-2">
                      {item.isSold && (
                        <span className="text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full bg-red-500/90 text-white tracking-wider shadow-md">
                          SOLD OUT
                        </span>
                      )}
                      <span className=" inline-flex items-center text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-primary shadow-sm tracking-wider">
                        {formattedCondition}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 sm:p-3 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-text-subtle text-xs font-medium mb-1 border-b border-border-muted/60 pb-1">
                      <span className="inline-flex items-center gap-1 uppercase tracking-wider text-[9px] sm:text-[10px] font-bold text-primary">
                        <Tag size={10} className="sm:w-3 sm:h-3" />
                        {item.category || "Others"}
                      </span>
                      {item.boardTag && (
                        <span className="hidden sm:inline text-[10px] text-text-muted uppercase">
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

                    {Array.isArray(item.components) &&
                      item.components.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-text-subtle bg-surface px-2 py-0.5 rounded-full border border-border-muted w-fit mb-1.5">
                          <Layers size={10} /> {item.components.length} items
                          included
                        </span>
                      )}

                    {/* added break-words to short description */}
                    <p className="text-text-muted text-[11px] sm:text-xs leading-relaxed mb-2.5 line-clamp-2 break-words overflow-hidden">
                      {item.description || "No description provided."}
                    </p>

                    <div className="pt-2 border-t border-border-muted/60 mt-auto">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {/* Left: Avatar + Seller Name Group */}
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
                          to={`/marketplace/items/${item.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-surface hover:bg-bg-elevated text-text text-[11px] sm:text-xs font-semibold py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-border hover:border-primary/40 active:scale-95 transition-all"
                        >
                          <Eye size={12} className="sm:w-[14px] sm:h-[14px]" />{" "}
                          View
                        </Link>
                        <button
                          onClick={(e) => handleToggleWishlist(e, item.id)}
                          className="px-2 sm:px-3 bg-surface hover:bg-bg-elevated text-text rounded-xl border border-border hover:border-primary/40 flex items-center justify-center active:scale-95 transition-all"
                          title={isSaved ? "Remove Watchlist" : "Add Watchlist"}
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
      )}
    </div>
  );
}

export default MarketplaceGrid;
