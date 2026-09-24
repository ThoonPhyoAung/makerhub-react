import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Plus,
  Minus,
  X,
  Image as ImageIcon,
  ArrowLeft,
  ShoppingBag,
  Tag,
  FileText,
  DollarSign,
  MapPin,
  Layers,
  Trash2,
  Loader2,
  Video,
  Wrench,
} from "lucide-react";

import { marketplaceCategories } from "../../data/marketplaceCategories";
import {
  getMarketplaceItemById,
  updateMarketplaceItem,
  deleteMarketplaceItem,
} from "../../api/marketplaceApi";
import { useAlert } from "../../context/AlertContext";

// ★ Custom hook - useFetch ကို import လုပ်ခြင်း
import { useFetch } from "../../hooks/useFetch";

const itemCategories = marketplaceCategories.filter(
  (c) => c.id !== "all" && c.id !== "saved Items",
);

const boardTagOptions = ["arduino", "esp32", "esp8266", "raspberry-pi"];
const itemConditions = ["new", "used", "bench tested"];
const states = ["yangon", "mandalay", "mon", "shan"];

const socialPlatforms = [
  {
    id: "telegram",
    label: "Telegram",
    color: "#229ED9",
    viewBox: "0 0 24 24",
    placeholder: "@username or t.me/...",
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z",
  },
  {
    id: "messenger",
    label: "Messenger",
    color: "#0084FF",
    viewBox: "0 0 24 24",
    placeholder: "m.me/username or profile link",
    path: "M12 2C6.366 2 1.75 6.262 1.75 11.53c0 2.998 1.48 5.674 3.784 7.388V22l3.159-1.735c1.028.286 2.119.435 3.307.435 5.634 0 10.25-4.262 10.25-9.53C22.25 6.262 17.634 2 12 2zm1.091 12.833l-2.616-2.79-5.1 2.79 5.608-5.95 2.68 2.79 5.036-2.79-5.608 5.95z",
  },
  {
    id: "viber",
    label: "Viber",
    color: "#7360F6",
    viewBox: "0 0 640 640",
    placeholder: "09xxxxxxxxx",
    path: "M508.3 113.9C495.6 102.2 444.2 64.9 329.6 64.4C329.6 64.4 194.5 56.3 128.7 116.7C92.1 153.3 79.2 207 77.8 273.5C76.4 340 74.7 464.6 194.8 498.4L194.9 498.4L194.8 550C194.8 550 194 570.9 207.8 575.1C224.4 580.3 234.2 564.4 250.1 547.3C258.8 537.9 270.8 524.1 279.9 513.6C362.1 520.5 425.2 504.7 432.4 502.4C449 497 542.9 485 558.1 360.4C573.9 231.8 550.5 150.6 508.3 113.9zM522.2 351C509.3 455 433.2 461.6 419.2 466.1C413.2 468 357.7 481.8 288 477.3C288 477.3 236 540 219.8 556.3C214.5 561.6 208.7 561.1 208.8 550.6C208.8 543.7 209.2 464.9 209.2 464.9L209.2 464.9C107.4 436.7 113.4 330.6 114.5 275.1C115.6 219.6 126.1 174.1 157.1 143.5C212.8 93 327.5 100.5 327.5 100.5C424.4 100.9 470.8 130.1 481.6 139.9C517.3 170.5 535.5 243.7 522.2 351zM383.2 270.2C383.6 278.8 370.7 279.4 370.3 270.8C369.2 248.8 358.9 238.1 337.7 236.9C329.1 236.4 329.9 223.5 338.4 224C366.3 225.5 381.8 241.5 383.2 270.2zM403.5 281.5C404.5 239.1 378 205.9 327.7 202.2C319.2 201.6 320.1 188.7 328.6 189.3C386.6 193.5 417.5 233.4 416.4 281.8C416.3 290.4 403.3 290 403.5 281.5zM450.5 294.9C450.6 303.5 437.6 303.6 437.6 295C437 213.5 382.7 169.1 316.8 168.6C308.3 168.5 308.3 155.7 316.8 155.7C390.5 156.2 449.8 207.1 450.5 294.9zM439.2 393L439.2 393.2C428.4 412.2 408.2 433.2 387.4 426.5L387.2 426.2C366.1 420.3 316.4 394.7 285 369.7C268.8 356.9 254 341.8 242.6 327.3C232.3 314.4 221.9 299.1 211.8 280.7C190.5 242.2 185.8 225 185.8 225C179.1 204.2 200 184 219.1 173.2L219.3 173.2C228.5 168.4 237.3 170 243.2 177.1C243.2 177.1 255.6 191.9 260.9 199.2C265.9 206 272.6 216.9 276.1 223C282.2 233.9 278.4 245 272.4 249.6L260.4 259.2C254.3 264.1 255.1 273.2 255.1 273.2C255.1 273.2 272.9 340.5 339.4 357.5C339.4 357.5 348.5 358.3 353.4 352.2L363 340.2C367.6 334.2 378.7 330.4 389.6 336.5C404.3 344.8 423 357.7 435.4 369.4C442.4 375.1 444 383.8 439.2 393z",
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "#FE2C55",
    viewBox: "0 0 24 24",
    placeholder: "@username",
    path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.68 6.34 6.34 0 009.34 22a6.34 6.34 0 006.34-6.32V9a7.94 7.94 0 004.91 1.68V7.21a4.85 4.85 0 01-1-.52z",
  },
];

const isBase64DataUrl = (value) =>
  typeof value === "string" && value.startsWith("data:");

const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
};

function MarketplaceEditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showAlert = useAlert();
  const currentUser = useSelector((state) => state.auth?.user);

  // ★ useFetch Pattern: API Call ပြုလုပ်ရန် useCallback ဖြင့် ခေါ်ယူခြင်း
  const fetchFn = useCallback(() => getMarketplaceItemById(id), [id]);
  const { data: itemData, loading, error } = useFetch(fetchFn, [fetchFn]);

  const [form, setForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [activeSocials, setActiveSocials] = useState([]);

  // ★ Fetch ရရှိလာသော Data ကို Form State သို့ ပြောင်းလဲသတ်မှတ်ခြင်း
  useEffect(() => {
    if (itemData) {
      // Ownership Verification (ပိုင်ရှင်ဟုတ်မဟုတ် စစ်ဆေးခြင်း)
      if (
        currentUser &&
        itemData.sellerId &&
        String(itemData.sellerId) !== String(currentUser.id)
      ) {
        showAlert({
          message: "You are not authorized to edit this listing.",
          type: "error",
        });
        navigate(`/marketplace/items/${id}`);
        return;
      }

      const contacts = itemData.contactMethods || {};
      const loc = itemData.location || {};

      setForm({
        title: itemData.title || "",
        category: itemData.category || "",
        boardTag: itemData.boardTag || "",
        images: Array.isArray(itemData.images) ? itemData.images : [],
        description: itemData.description || "",
        demoVideoUrl: itemData.demoVideoUrl || "",
        price: itemData.price ? String(itemData.price) : "",
        isNegotiable: Boolean(itemData.isNegotiable),
        condition: itemData.condition || "",
        state: loc.state || "",
        township: loc.township || "",
        phone: contacts.phone || itemData.sellerPhone || "",
        preferredMethod: contacts.preferredMethod || "any",
        telegram: contacts.telegram || "",
        messenger: contacts.messenger || "",
        viber: contacts.viber || "",
        tiktok: contacts.tiktok || "",
        components: Array.isArray(itemData.components)
          ? itemData.components
          : [],
        isSold: Boolean(itemData.isSold),
      });

      // Active ဖြစ်နေသော Social Platform toggles များကို ဖော်ပြရန် Set လုပ်ခြင်း
      const activeIds = socialPlatforms
        .map((p) => p.id)
        .filter((sId) =>
          Boolean(contacts[sId] && String(contacts[sId]).trim() !== ""),
        );

      setActiveSocials(activeIds);
    }
  }, [itemData, currentUser, id, navigate, showAlert]);

  const toggleSocial = (socialId) => {
    setActiveSocials((prev) => {
      if (prev.includes(socialId)) {
        setForm((f) => ({ ...f, [socialId]: "" }));
        return prev.filter((item) => item !== socialId);
      } else {
        return [...prev, socialId];
      }
    });
  };

  const handleChange = (e) => {
    const key = e.target.name || e.target.id;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // Image Handlers
  const handleAddImage = (e) => {
    e.preventDefault();
    const url = imageUrlInput.trim();
    if (!url) return;
    if (isBase64DataUrl(url)) {
      showAlert({
        message: "Please provide hosted image URLs (https://...).",
        type: "warning",
      });
      return;
    }
    if (form.images.length + 1 === 5) {
      showAlert({
        message: "Maximum 5 images reached",
        type: "info",
      });
    }
    if (form.images.length >= 5) {
      showAlert({ message: "Maximum 5 images allowed", type: "warning" });
      return;
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImageUrlInput("");
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleMakeMainImage = (index) => {
    const selected = form.images[index];
    const rest = form.images.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, images: [selected, ...rest] }));
  };

  // Components Handlers
  const addComponent = () => {
    setForm((prev) => ({
      ...prev,
      components: [...prev.components, { name: "", quantity: "1", image: "" }],
    }));
  };

  const updateComponent = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      components: prev.components.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const removeComponent = (index) => {
    setForm((prev) => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index),
    }));
  };

  const validateData = () => {
    const err = {};
    if (!form.title?.trim()) err.title = "Item title is required";
    if (!form.category) err.category = "Category is required";
    if (!form.images || form.images.length === 0)
      err.images = "At least 1 photo is required";
    if (!form.description?.trim()) err.description = "Description is required";

    const parsedPrice = Number(form.price);
    if (!form.price || isNaN(parsedPrice) || parsedPrice <= 0)
      err.price = "Valid price is required";

    if (!form.condition) err.condition = "Condition is required";
    if (!form.state) err.state = "State/Region is required";
    if (!form.township?.trim()) err.township = "Township is required";
    if (!form.phone?.trim()) err.phone = "Phone number is required";

    setErrors(err);
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateData();
    if (Object.keys(validationErrors).length > 0) {
      showAlert({
        message: "Please fill in all required fields.",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: form.title,
        price: Number(form.price) || 0,
        category: form.category,
        boardTag: form.boardTag,
        condition: form.condition,
        images: form.images,
        components: form.components,
        description: form.description,
        demoVideoUrl: form.demoVideoUrl || "",
        isNegotiable: Boolean(form.isNegotiable),
        isSold: Boolean(form.isSold),

        location: {
          state: form.state,
          township: form.township,
        },
        contactMethods: {
          phone: form.phone,
          preferredMethod: form.preferredMethod || "any",
          telegram: activeSocials.includes("telegram")
            ? form.telegram || ""
            : "",
          messenger: activeSocials.includes("messenger")
            ? form.messenger || ""
            : "",
          viber: activeSocials.includes("viber") ? form.viber || "" : "",
          tiktok: activeSocials.includes("tiktok") ? form.tiktok || "" : "",
        },
        updatedAt: new Date().toISOString(),
      };

      await updateMarketplaceItem(id, payload);

      showAlert({
        message: "Updated successfully!",
        type: "success",
      });

      navigate(`/marketplace/items/${id}`);
    } catch (error) {
      console.error("Failed to update item:", error);
      showAlert({
        message:
          error?.response?.data?.message || "Failed to update item post.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel Handler with Warning Alert
  const handleCancel = () => {
    showAlert({
      message: "Unsaved changes will be lost. Leave this page?",
      actionText: "Leave",
      type: "warning",
      duration: 0, // user click လုပ်မှ ပိတ်မည်
      onAction: () => {
        navigate(`/marketplace/items/${id}`);
      },
    });
  };

  // Delete Handler
  const handleDeleteItem = (e) => {
    e.preventDefault();

    showAlert({
      message:
        "Are you sure you want to delete this marketplace item? This action cannot be undone.",
      actionText: "Delete",
      type: "warning",
      duration: 0, // user click လုပ်မှ ပိတ်မည်
      onAction: async () => {
        try {
          await deleteMarketplaceItem(id);
          showAlert({
            message: "Item listing deleted successfully!",
            type: "success",
          });
          navigate("/marketplace");
        } catch (error) {
          console.error("Failed to delete item:", error);
          showAlert({
            message:
              error?.response?.data?.message ||
              "Failed to delete item listing.",
            type: "error",
          });
        }
      },
    });
  };

  // ★ Loading State ကို useFetch ၏ loading ပေါ် မူတည်၍ ပြသခြင်း
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16">
        <Loader2 size={36} className="text-primary animate-spin mb-3" />
        <p className="text-text-muted text-sm font-medium">
          Loading listing data for edit...
        </p>
      </div>
    );
  }

  // ★ Error State သို့မဟုတ် Data မရှိပါက ပြသခြင်း
  if (error || !form) {
    return (
      <div className="text-center py-24 text-red-400">
        <p>Failed to load item for editing: {error || "Item not found"}</p>
        <Link
          to="/marketplace"
          className="text-primary font-semibold mt-4 inline-block"
        >
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-between gap-3 mb-4 px-1">
        <Link
          to={`/marketplace/items/${id}`}
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-text-muted hover:text-primary transition-colors py-1"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Back to Item Details</span>
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-bg-elevated border border-border rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-5 md:p-6 border-b border-border bg-surface/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-text text-xl sm:text-2xl font-bold tracking-tight">
              <ShoppingBag size={22} className="text-primary shrink-0" />
              Edit Marketplace Item
            </h1>
            <p className="text-text-muted text-xs sm:text-sm mt-1">
              Update item details, prices, contact methods, and BOM list.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <input
              type="checkbox"
              id="isSold"
              name="isSold"
              checked={form.isSold}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isSold: e.target.checked }))
              }
              className="w-4 h-4 accent-red-500 rounded cursor-pointer"
            />
            <label
              htmlFor="isSold"
              className="text-xs font-bold text-text cursor-pointer select-none"
            >
              Mark as SOLD OUT
            </label>
          </div>
        </div>

        <div className="p-5 md:p-6 flex flex-col gap-6">
          {/* Section 1: Item Details */}
          <div className="space-y-4 bg-surface p-4 rounded-2xl border border-border">
            <label className="text-xs font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={14} /> Basic Item Details
            </label>

            <div>
              <label className="block text-text-muted text-sm font-medium mb-1">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                className="w-full bg-bg border border-border text-text rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              {errors.title && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.title}
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-muted text-sm font-medium mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border text-text rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {itemCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.category}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-text-muted text-sm font-medium mb-1">
                  Brand / Hardware Tag
                </label>
                <select
                  id="boardTag"
                  name="boardTag"
                  value={form.boardTag}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border text-text rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Select board tag (optional)</option>
                  {boardTagOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Photos */}
          <div className="space-y-3 bg-surface p-4 rounded-2xl border border-border">
            <label className="text-xs font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon size={14} /> Product Images ({form.images.length}/5) *
            </label>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste image URL (https://...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                disabled={form.images.length >= 5}
                className="flex-1 bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleAddImage}
                disabled={form.images.length >= 5}
                className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1 shrink-0 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            {errors.images && (
              <span className="text-red-500 text-xs block">
                {errors.images}
              </span>
            )}

            {form.images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pt-2 pb-1 scrollbar-none">
                {form.images.map((url, idx) => (
                  <div
                    key={idx}
                    className={`relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 ${
                      idx === 0 ? "border-primary" : "border-border"
                    }`}
                  >
                    <img
                      src={url}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                    {idx === 0 ? (
                      <span className="absolute bottom-1 left-1 bg-primary text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded">
                        MAIN
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleMakeMainImage(idx)}
                        className="absolute bottom-1 left-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded hover:bg-black"
                      >
                        Set Main
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Description & Video */}
          <div className="space-y-4 bg-surface p-4 rounded-2xl border border-border">
            <label className="text-xs font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} /> Description & Video
            </label>

            <div>
              <label className="block text-text-muted text-sm font-medium mb-1">
                Item Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full bg-bg border border-border text-text rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
              />
              {errors.description && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.description}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-text-muted text-sm font-medium mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Video size={14} /> Demo Video URL
                </span>
                <span className="text-xs text-text-subtle font-normal">
                  (Optional)
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  id="demoVideoUrl"
                  name="demoVideoUrl"
                  type="url"
                  value={form.demoVideoUrl || ""}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-bg border border-border text-text rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />

                {form.demoVideoUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, demoVideoUrl: "" }))
                    }
                    className="text-red-500 bg-bg border border-border px-3 py-2.5 rounded-xl hover:text-red-400 p-1.5 self-end sm:self-center transition-colors"
                    title="Clear URL"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            {form.demoVideoUrl && getYoutubeEmbedUrl(form.demoVideoUrl) && (
              <div className="mt-2 aspect-video w-full rounded-lg overflow-hidden border border-border">
                <iframe
                  src={getYoutubeEmbedUrl(form.demoVideoUrl)}
                  title="Demo Video Preview"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Section 4: Components (BOM List) */}
          <div className="space-y-3 bg-surface p-4 rounded-2xl border border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={14} /> Included Components / BOM
              </label>
              <button
                type="button"
                onClick={addComponent}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Add Component
              </button>
            </div>

            {form.components.length > 0 && (
              <div className="space-y-3">
                {form.components.map((comp, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-bg p-3 rounded-xl border border-border"
                  >
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-bg-subtle border border-border flex items-center justify-center overflow-hidden text-text-subtle shadow-xs">
                      {comp.image ? (
                        <img
                          src={comp.image}
                          alt={comp.name || "Preview"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <Wrench size={18} className="text-text-subtle" />
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Component Name"
                      value={comp.name}
                      onChange={(e) =>
                        updateComponent(idx, "name", e.target.value)
                      }
                      className="flex-2 w-full bg-surface border border-border text-text rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary"
                    />
                    <div className="flex items-center border border-border rounded-lg bg-surface overflow-hidden shrink-0 h-[31px]">
                      <button
                        type="button"
                        onClick={() =>
                          updateComponent(
                            idx,
                            "quantity",
                            Math.max(1, (parseInt(comp.quantity) || 1) - 1),
                          )
                        }
                        className="px-2 h-full flex items-center justify-center text-text-muted hover:text-text hover:bg-border/40 transition-colors"
                        title="Decrease"
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={comp.quantity}
                        onChange={(e) =>
                          updateComponent(
                            idx,
                            "quantity",
                            Math.max(1, parseInt(e.target.value) || 1),
                          )
                        }
                        className="w-7 bg-transparent text-center text-text text-xs font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-0"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateComponent(
                            idx,
                            "quantity",
                            (parseInt(comp.quantity) || 0) + 1,
                          )
                        }
                        className="px-2 h-full flex items-center justify-center text-text-muted hover:text-text hover:bg-border/40 transition-colors"
                        title="Increase"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <input
                      type="url"
                      placeholder="Image URL (Optional)"
                      value={comp.image || ""}
                      onChange={(e) =>
                        updateComponent(idx, "image", e.target.value)
                      }
                      className="flex-1 w-full bg-surface border border-border text-text rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => removeComponent(idx)}
                      className="text-red-500 hover:text-red-400 p-1.5 self-end sm:self-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Pricing & Condition */}
          <div className="space-y-4 bg-surface p-4 rounded-2xl border border-border">
            <label className="text-xs font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign size={14} /> Pricing & Condition
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-muted text-sm font-medium mb-1">
                  Price (MMK) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border text-text rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
                {errors.price && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.price}
                  </span>
                )}
                <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="isNegotiable"
                    name="isNegotiable"
                    checked={form.isNegotiable}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isNegotiable: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <span className="text-xs text-text-muted">
                    Price is Negotiable
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-text-muted text-sm font-medium mb-1">
                  Item Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border text-text rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="" disabled>
                    Select condition
                  </option>
                  {itemConditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond.toUpperCase()}
                    </option>
                  ))}
                </select>
                {errors.condition && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.condition}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 6: Location & Social Contacts */}
          <div className="space-y-4 bg-surface p-4 rounded-2xl border border-border">
            <label className="text-xs font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} /> Location & Contact Channels
            </label>

            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">
                  State / Region *
                </label>
                <select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border text-text rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary"
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">
                  Township *
                </label>
                <input
                  id="township"
                  name="township"
                  type="text"
                  value={form.township}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border text-text rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border text-text rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-muted text-xs font-medium mb-1">
                Preferred Contact Method
              </label>
              <select
                id="preferredMethod"
                name="preferredMethod"
                value={form.preferredMethod}
                onChange={handleChange}
                className="w-full bg-bg border border-border text-text rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary"
              >
                <option value="any">Any Method</option>
                <option value="phone">Phone Call</option>
                <option value="telegram">Telegram</option>
                <option value="messenger">Messenger</option>
                <option value="viber">Viber</option>
              </select>
            </div>

            {/* Social Media Toggles & Input Fields */}
            <div className="pt-2 border-t border-border/60">
              <label className="block text-text-muted text-xs font-medium mb-2">
                Additional Social Media Channels
              </label>
              <div className="flex flex-wrap gap-3 mb-3">
                {socialPlatforms.map((platform) => {
                  const isActive = activeSocials.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => toggleSocial(platform.id)}
                      style={{
                        backgroundColor: isActive
                          ? `${platform.color}15`
                          : "transparent",
                        borderColor: isActive
                          ? platform.color
                          : "var(--color-border)",
                        color: isActive
                          ? platform.color
                          : "var(--color-text-subtle)",
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isActive
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-bg border-border text-text-muted hover:border-text-subtle"
                      }`}
                    >
                      {isActive ? "✓ " : "+ "}
                      {platform.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2 pt-2">
                {socialPlatforms
                  .filter((platform) => activeSocials.includes(platform.id))
                  .map((platform) => (
                    <div key={platform.id} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-semibold w-20 shrink-0"
                          style={{ color: platform.color }}
                        >
                          {platform.label}
                        </span>
                        <input
                          type="text"
                          id={platform.id}
                          value={form[platform.id]}
                          onChange={handleChange}
                          placeholder={platform.placeholder}
                          className="flex-1 bg-bg border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-all"
                          style={{ borderColor: "var(--color-border)" }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col gap-4 pt-4 border-t border-border">
            <div className="flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 text-text font-semibold py-2.5 rounded-xl transition-all"
              >
                {isSubmitting ? "Updating..." : "Update Post"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border border-border text-text text-sm font-semibold hover:bg-surface transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Delete Danger Zone */}
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center justify-between mt-2">
              <div>
                <p className="text-sm font-semibold text-red-400">
                  Delete this listing
                </p>
                <p className="text-xs text-text-muted">
                  Once deleted, this item listing cannot be recovered.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDeleteItem}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition-all"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default MarketplaceEditPost;
