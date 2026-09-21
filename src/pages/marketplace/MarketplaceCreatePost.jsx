import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Plus,
  X,
  Star,
  Image as ImageIcon,
  Save,
  CloudUpload,
  ArrowLeft,
  ShoppingBag,
  Tag,
  FileText,
  DollarSign,
  MapPin,
} from "lucide-react";

import { marketplaceCategories } from "../../data/marketplaceCategories";
import { createMarketplaceItem } from "../../api/marketplaceApi";
import { useAlert } from "../../context/AlertContext";

const itemCategories = marketplaceCategories.filter(
  (c) => c.id !== "all" && c.id !== "saved Items",
);

const boardTagOptions = ["arduino", "esp32", "esp8266", "raspberry-pi"];

const itemConditions = ["new", "used", "bench tested"];

const states = ["yangon", "mandalay", "mon", "shan"];

// ★ Social platform data — button 4 ခု ကို hardcode ရေးမနေတော့ဘဲ
// array + map ဖြင့် generate (BOM section ရဲ့ pattern အတူတူ)
const socialPlatforms = [
  {
    id: "telegram",
    label: "Telegram",
    color: "#229ED9",
    placeholder: "@username or t.me/...",
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z",
  },
  {
    id: "messenger",
    label: "Messenger",
    color: "#0084FF",
    placeholder: "m.me/username or profile link",
    path: "M12 2C6.366 2 1.75 6.262 1.75 11.53c0 2.998 1.48 5.674 3.784 7.388V22l3.159-1.735c1.028.286 2.119.435 3.307.435 5.634 0 10.25-4.262 10.25-9.53C22.25 6.262 17.634 2 12 2zm1.091 12.833l-2.616-2.79-5.1 2.79 5.608-5.95 2.68 2.79 5.036-2.79-5.608 5.95z",
  },
  {
    id: "viber",
    label: "Viber",
    color: "#7360F6",
    placeholder: "09xxxxxxxxx",
    path: "M11.39 2C6.18 2 2 6.07 2 11.16c0 2.66 1.16 5.06 3.03 6.75l-.75 2.8 2.92-.93c1.23.47 2.58.73 4.01.73 5.21 0 9.39-4.07 9.39-9.16S16.6 2 11.39 2zm5.32 12.5c-.24.39-.98.77-1.4.82-.39.05-.9.08-2.93-.76-2.45-1.02-4.02-3.52-4.14-3.69-.12-.17-.99-1.32-.99-2.52 0-1.2.62-1.79.84-2.03.22-.24.48-.3.64-.3.16 0 .32.01.46.01.15 0 .35-.06.55.42.2.48.68 1.66.74 1.78.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.63 1.04 1.35 1.68.93.83 1.71 1.09 1.95 1.21.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.18.97z",
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "#FE2C55",
    placeholder: "@username",
    path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.68 6.34 6.34 0 009.34 22a6.34 6.34 0 006.34-6.32V9a7.94 7.94 0 004.91 1.68V7.21a4.85 4.85 0 01-1-.52z",
  },
];

const DRAFT_KEY = "createMarketplaceItem_draft";

// ★ field အကုန်ကို ဒီနေရာ ၁ နေရာတည်း စာရင်းပြု — schema ပြောင်းရင်
// ဒီနေရာကို ကြည့်ရုံနဲ့ field အားလုံး တစ်ခါတည်း မြင်နိုင်အောင်
const initialForm = {
  title: "",
  category: "",
  boardTag: "",
  images: [],
  description: "",
  demoVideoUrl: "",
  price: "",
  isNegotiable: false,
  condition: "",
  state: "",
  township: "",
  phone: "",
  preferredMethod: "any",
  telegram: "",
  messenger: "",
  viber: "",
  tiktok: "",
};

// getting saved draft if save data exists
const getInitialForm = () => {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    // ★ initialForm ကို base အဖြစ်ယူပြီး saved draft နဲ့ merge —
    // field အသစ်ထပ်ထည့်ရင် ဟောင်းတဲ့ draft ပါ crash မဖြစ်အောင်
    return saved ? { ...initialForm, ...JSON.parse(saved) } : initialForm;
  } catch {
    return initialForm;
  }
};

// checking image link
const isBase64DataUrl = (value) => {
  return typeof value === "string" && value.startsWith("data:");
};

function MarketplacePostForm() {
  const [form, setForm] = useState(getInitialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageUrlInput, setImageUrlInput] = useState("");
  const navigate = useNavigate();
  const showAlert = useAlert();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const userName = user?.name; // user ရှိရင် name ကိုယူမယ်, null ဆိုရင် undefined
  const userAvatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User",
    )}&background=161b22&color=0d9488&bold=true`;

  // LocalStorage ထဲတွင် အရင် save ထားဖူးသည့် Draft ရှိမရှိ စစ်ဆေးပြီး initial state ပေးခြင်း
  const [isDraftSaved, setIsDraftSaved] = useState(() => {
    return Boolean(localStorage.getItem(DRAFT_KEY));
  });

  // ★ draft ပြန် load ဖြစ်တဲ့အခါ, socail field (telegram/viber...) ထဲ
  // value ရှိနေရင် toggle ကို "active" အနေနဲ့ ပြန်ဖွင့်ပေးဖို့ — lazy
  // initializer function ကို useState ထဲ ပို့ထားတယ် (component ပထမဆုံး
  // render မှာတစ်ခါပဲ run)
  const [activeSocials, setActiveSocials] = useState(() => {
    const restored = getInitialForm();

    // ၁။ ID တွေကိုပဲ သီးသန့် ထုတ်ယူမည်
    const allIds = socialPlatforms.map((p) => p.id);
    // ရလဒ်: ["telegram", "messenger", "viber", "tiktok"]

    // ၂။ LocalStorage ထဲမှာ တန်ဖိုးရှိတဲ့ ID များကိုပဲ စစ်ထုတ်မည်
    const activeIds = allIds.filter((id) => {
      const value = restored[id]; // restored['telegram']
      return Boolean(value); // တန်ဖိုးရှိရင် true၊ မရှိရင် false
      // restored["telegram"] ထဲမှာ "@myhandle" (စာသား/တန်ဖိုး) ရှိနေရင် JavaScript က အဲဒါကို True လို့ သတ်မှတ်ပြီး Array ထဲမှာ ချန်ထား
    });

    // ၃။ ရလာတဲ့ activeIds array ကို useState ရဲ့ initial value အဖြစ် return ပြန်ပေးမည်
    return activeIds;
  });

  const toggleSocial = (id) => {
    setActiveSocials((prev) => {
      const isCurrentlyActive = prev.includes(id);

      if (isCurrentlyActive) {
        // Toggle ပိတ်လိုက်ပါက Form Value ရော Error ပါ ဖျက်ပေးမည်
        setForm((f) => ({ ...f, [id]: "" }));
        setErrors((e) => ({ ...e, [id]: "" }));
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  //   to handle the input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));

    if (isDraftSaved) {
      setIsDraftSaved(false); // စာသားအသစ် ပြန်ရိုက်လျှင် "Draft saved" ကို ခဏပြန်ဖျောက်မည်
    }

    // အကယ်၍ အဲဒီ field မှာ error ရှိနေခဲ့ရင် စာစရိုက်လိုက်တာနဲ့ error ကို ချက်ချင်း ဖျက်ပေးမည်
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "", // error message ကို ရှင်းထုတ်လိုက်ခြင်း
      }));
    }
  };

  // image url input
  const handleAddImage = (e) => {
    e.preventDefault();
    const url = imageUrlInput.trim();
    if (!url) return;

    if (isBase64DataUrl(url)) {
      showAlert(
        "ကျေးဇူးပြု၍ image file ကို paste မလုပ်ပါနှင့်၊ hosted image URL (https://...) ကိုသာ ထည့်ပါ။",
      );
      return;
    }

    const currentCount = form.images?.length || 0;

    if (currentCount >= 5) {
      showAlert("Maximum 5 images allowed");
      return;
    }

    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), url],
    }));

    if (errors.images) {
      setErrors((prev) => ({
        ...prev,
        images: "",
      }));
    }

    if (currentCount + 1 === 5) {
      showAlert("Maximum 5 images reached");
    }

    setImageUrlInput("");
  };

  // image remove
  const handleRemove = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // image main
  const handleMakeMain = (indexToMakeMain) => {
    const selectedImage = form.images[indexToMakeMain];
    const remainingImages = form.images.filter(
      (_, index) => index !== indexToMakeMain,
    );

    setForm((prev) => ({
      ...prev,
      images: [selectedImage, ...remainingImages],
    }));
  };

  // checking validation
  const validateData = () => {
    const err = {};

    // 1. Item Title (Required)
    if (!form.title?.trim()) {
      err.title = "Item title is required";
    }

    // 2. Category (Required)
    if (!form.category) {
      err.category = "Category is required";
    }

    // 3. Photos (Required - အနည်းဆုံး ၁ ပုံ ပါရမည်)
    if (!form.images || form.images.length === 0) {
      err.images = "At least 1 item photo is required";
    }

    // 4. Description
    if (!form.description) {
      err.description = "Description is required";
    }

    // 5. Price (Required & Must be positive number)
    if (!form.price || Number(form.price) <= 0) {
      err.price = "Valid price is required";
    }

    // 6. Item Condition (Required)
    if (!form.condition) {
      err.condition = "Item condition is required";
    }

    // 7. Location (Required)
    if (!form.state) {
      err.state = "State or region is required";
    }
    if (!form.township?.trim()) {
      err.township = "Township is required";
    }

    // 8. Phone Number (Required)
    if (!form.phone?.trim()) {
      err.phone = "Phone number is required";
    }

    // 9. Social Media Links
    // Social Media Link Validation (Active ဖြစ်နေမှသာ လိုအပ်မည်)
    socialPlatforms.forEach((p) => {
      if (activeSocials.includes(p.id) && !form[p.id]?.trim()) {
        err[p.id] = `${p.label} link or username is required`;
      }
    });

    /* 
    Optional Fields (Validation ရေးရန် မလိုပါ):
    - boardTag (Brand/Model)
    - description 
    - demoVideoUrl (Proof Video)
    - isNegotiable (Nego Checkbox)
    - preferredMethod (Preferred Contact)
    - telegram, messenger, viber, tiktok (Social Media Links)
  */

    setErrors(err);
    console.log("errors", errors);

    return err;
  };

  // ★ localStorage ထဲ save
  const handleSaveDraft = () => {
    try {
      // Form ထဲမှာ ရှိသမျှ စာများကို LocalStorage ထဲ သိမ်းမည်
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setIsDraftSaved(true);
      showAlert("Draft saved successfully!");
    } catch (error) {
      showAlert({
        message: "Failed to save draft!",
        type: "error",
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation စစ်မည်
    const validationErrors = validateData();
    if (Object.keys(validationErrors).length > 0) {
      showAlert({
        message: "Please fill all required fields correctly!",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Form Data ကို API Format ရောက်အောင် Structure ပြောင်းလဲခြင်း
      const payload = {
        title: form.title,
        price: Number(form.price) || 0, // String မှ Number သို့ ပြောင်းမည်
        category: form.category,
        boardTag: form.boardTag,
        condition: form.condition,
        images: form.images, // Image URLs / Base64 Array
        description: form.description,
        demoVideoUrl: form.demoVideoUrl || "",
        isNegotiable: Boolean(form.isNegotiable),

        // Nested Location Object
        location: {
          state: form.state,
          township: form.township,
        },

        // Nested Contact Methods Object
        contactMethods: {
          phone: form.phone,
          preferredMethod: form.preferredMethod || "any",
          telegram: activeSocials.includes("telegram") ? form.telegram : "",
          messenger: activeSocials.includes("messenger") ? form.messenger : "",
          viber: activeSocials.includes("viber") ? form.viber : "",
          tiktok: activeSocials.includes("tiktok") ? form.tiktok : "",
        },

        // Seller Metadata (Auth State ထဲမှ ယူမည်)
        sellerId: userId || "usr_default",
        sellerName: userName || "Thoon Phyo Aung",
        sellerAvatar: userAvatar,
        sellerJoinDate: user?.joinDate || "2026-01",

        // System Defaults
        createdAt: new Date().toISOString(),
        isSold: false,
        reportCount: 0,
        savedUsers: [],
      };

      // 3. API သို့ ပို့မည်
      await createMarketplaceItem(payload);

      // 4. အောင်မြင်ပါက LocalStorage Draft ကို ရှင်းထုတ်မည်
      localStorage.removeItem(DRAFT_KEY);

      showAlert({
        message: "Your item post was published successfully!",
        type: "success",
      });

      navigate("/marketplace");
    } catch (error) {
      console.error("Failed to create marketplace item:", error);
      showAlert({
        message:
          error?.response?.data?.message || "Failed to publish item post!",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ★ Cancel button handler — Form Field အားလုံးကို Dynamic စစ်ဆေးခြင်း
  const handleCancel = () => {
    // initialForm ထဲက တန်ဖိုးများအတိုင်း ပြောင်းလဲမှု (Change) ရှိမရှိ စစ်ဆေးခြင်း
    const hasFormData = Object.keys(initialForm).some((key) => {
      const currentValue = form[key];
      const defaultValue = initialForm[key]; //preferredMethod: "any" လို Default Value ရှိသော Field များ

      // Array (images) ဖြစ်ပါက အနည်းဆုံး ၁ ခုရှိမရှိ စစ်မည်
      if (Array.isArray(currentValue)) {
        return currentValue.length > 0;
      }

      // မူလတန်ဖိုး (defaultValue) နှင့် မတူတော့ဘဲ စာသား/တန်ဖိုး ရှိနေပါက Dirty ဟု သတ်မှတ်မည်
      return (
        currentValue !== defaultValue &&
        Boolean(currentValue?.toString().trim())
      );
    });

    // မည်သည့် Field မှ ရိုက်ကူးထားခြင်း မရှိပါက တိုက်ရိုက် ထွက်မည်
    if (!hasFormData) {
      navigate("/marketplace");
      return;
    }

    // ရေးလက်စများ ရှိပါက Alert Modal ပြသမည်
    showAlert({
      title: "Discard Post Draft?",
      message:
        "ရေးလက်စ အချက်အလက်များ ပျောက်ပျက်သွားပါမည်။ မသိမ်းဆည်းဘဲ ထွက်မှာ သေချာပါသလား။",
      type: "warning",
      isModal: true,
      actionText: "Discard & Exit",
      cancelText: "Keep Editing",
      onAction: () => {
        localStorage.removeItem(DRAFT_KEY);
        setIsDraftSaved(false);
        navigate("/marketplace");
      },
    });
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8 md:py-12">
      {/* Top Action Bar (Back Link & Draft Tag) - Outside Card */}
      <div className="flex items-center justify-between gap-3 mb-4 px-1">
        <Link
          to="/marketplace"
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-text-muted hover:text-primary transition-colors py-1"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Back to Marketplace</span>
        </Link>

        {isDraftSaved && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 animate-fade-in">
            <Save size={12} /> Draft saved
          </span>
        )}
      </div>

      {/* Main Form Container - Single Cohesive Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-bg-elevated border border-border rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Form Header Section (Card Top Header) */}
        <div className="p-5 md:p-6 border-b border-border bg-surface/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="flex items-center gap-2 text-text text-xl sm:text-2xl font-bold tracking-tight">
              <ShoppingBag size={22} className="text-primary shrink-0" />
              List an Item for Sale
            </h1>
            <p className="text-text-muted text-xs sm:text-sm">
              Sell your spare parts, tools, or boards to the maker community.
            </p>
          </div>

          {/* Seller Mini Profile Pill */}
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface border border-border/80 shrink-0 self-start sm:self-auto">
              <img
                src={userAvatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-primary/40 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-text text-xs font-semibold truncate max-w-[120px] leading-tight">
                  {user.name}
                </p>
                <p className="text-text-subtle text-[10px] leading-none mt-0.5">
                  Posting as seller
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Form Inputs Body */}
        <div className="p-5 md:p-6 flex flex-col gap-5">
          {/* Item information section */}
          <div className="space-y-3 bg-surface p-4 rounded-2xl border border-border">
            <label className="text-xs font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={14} /> Item Information
            </label>

            {/* title */}
            <div>
              <label
                htmlFor="title"
                className="block text-text-muted text-sm font-medium mb-2"
              >
                Item Title *
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., ESP32-S3 Dev Board (Bench Tested)"
                className="w-full bg-bg border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              />
              <span className="text-red-500 text-xs">{errors.title}</span>
            </div>

            {/* Category and board tag */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-text-muted text-sm font-medium mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border text-text rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    Select your item type...
                  </option>
                  {itemCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <span className="text-red-500 text-xs">{errors.category}</span>
              </div>

              <div>
                {/* ★ htmlFor ကို id ("boardTag") နဲ့ ထပ်တူညီအောင်ပြင် */}
                <label
                  htmlFor="boardTag"
                  className="block text-text-muted text-sm font-medium mb-2"
                >
                  Brand / Model
                </label>
                <select
                  id="boardTag"
                  value={form.boardTag}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border text-text rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    Select board type...
                  </option>
                  {boardTagOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Image section */}
          <div className="space-y-3 bg-surface p-4 rounded-2xl border border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon size={14} /> Item Photos ({form.images.length}/5)*
              </label>
              <span className="text-[11px] text-text-muted">
                First photo is main cover
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder={
                  form.images.length >= 5
                    ? "Maximum 5 images reached"
                    : "Paste image link (https://...)"
                }
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

            <div className="flex">
              <span className="text-red-500 text-xs">{errors.images}</span>
            </div>

            {form.images.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto pt-2 pb-1 scrollbar-none">
                {form.images.map((url, index) => {
                  const isMain = index === 0;
                  return (
                    <div
                      key={index}
                      className={`relative w-28 h-28 shrink-0 rounded-xl overflow-hidden border-2 bg-black/40 transition-all ${
                        isMain
                          ? "border-primary shadow-lg shadow-primary/10"
                          : "border-border"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Item photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=300";
                        }}
                      />
                      <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-500 text-white p-1 rounded-full transition-colors"
                      >
                        <X size={12} />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 p-1 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex justify-center">
                        {isMain ? (
                          <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                            <Star size={10} fill="white" /> MAIN PHOTO
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleMakeMain(index)}
                            className="bg-black/80 hover:bg-primary hover:text-white text-white text-[9px] font-bold px-2 py-0.5 rounded-md border border-white/20 transition-all"
                          >
                            Make Main
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Description & Media */}
          <div className="space-y-3 bg-surface p-4 rounded-2xl border border-border">
            <label className="text-xs font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} /> Description & Media
            </label>

            <div>
              <label
                htmlFor="description"
                className="block text-text-subtle text-sm font-medium mb-2"
              >
                Full Description*
              </label>
              <textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Write a longer explanation as one plain paragraph..."
                className="w-full bg-bg border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-primary transition-all resize-y"
              />
              <span className="text-red-500 text-xs">{errors.description}</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-text-subtle flex items-center justify-between">
                <span>Demo / Proof Video URL</span>
                <span className="text-xs text-text-subtle font-normal">
                  (Optional)
                </span>
              </label>
              <input
                type="url"
                id="demoVideoUrl"
                value={form.demoVideoUrl}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=... သို့မဟုတ် Loom link"
                className="w-full bg-bg border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              />
              <p className="text-xs text-text-subtle">
                * Item ရဲ့ အလုပ်လုပ်ပုံ ပြသထားသည့် YouTube, Google Drive
                သို့မဟုတ် Loom Video Link ထည့်ပါ။
              </p>
            </div>

            {form.demoVideoUrl &&
              form.demoVideoUrl.includes("youtube.com/watch?v=") && (
                <div className="mt-2 aspect-video w-full rounded-lg overflow-hidden border border-border">
                  <iframe
                    src={form.demoVideoUrl.replace("watch?v=", "embed/")}
                    title="Demo Video Preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
          </div>

          {/* Pricing & Condition */}
          <div className="space-y-3 bg-surface p-4 rounded-2xl border border-border">
            <label className="text-xs font-bold text-text-subtle uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign size={14} /> Pricing & Condition
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Pricing */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-text-muted text-sm font-medium mb-2"
                >
                  Price *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="1000"
                    className="w-full bg-bg border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                  <span className="text-text-muted text-sm font-medium">
                    MMK
                  </span>
                </div>

                <span className="text-red-500 text-xs">{errors.price}</span>

                {/* ★ Nego toggle — schema ထဲ isNegotiable ရှိပြီးသား, UI ထဲ
                  မပါခဲ့တာမို့ ထပ်ထည့်လိုက်တယ် */}
                <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isNegotiable}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isNegotiable: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className="text-sm text-text-muted">
                    Price is negotiable (Nego)
                  </span>
                </label>
              </div>

              {/* Condition */}
              <div>
                <label
                  htmlFor="condition"
                  className="block text-text-muted text-sm font-medium mb-2"
                >
                  Item Condition *
                </label>
                <select
                  id="condition"
                  value={form.condition}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border text-text rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    Select your item condition...
                  </option>
                  {itemConditions.map((option) => (
                    <option key={option} value={option}>
                      {option.toUpperCase()}
                    </option>
                  ))}
                </select>

                <span className="text-red-500 text-xs">{errors.condition}</span>
              </div>
            </div>
          </div>

          {/* Location & Contact Info */}
          <div className="bg-surface p-4 rounded-2xl border border-border space-y-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-text-subtle uppercase tracking-wider">
              <MapPin size={14} /> Location & Contact Info
            </label>

            {/* location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="state"
                  className="block text-text-muted text-sm font-medium mb-2"
                >
                  State / Region *
                </label>
                <select
                  id="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border text-text rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    Select your region...
                  </option>
                  {states.map((option) => (
                    <option key={option} value={option}>
                      {option.toUpperCase()}
                    </option>
                  ))}
                </select>
                <span className="text-red-500 text-xs">{errors.state}</span>
              </div>

              <div>
                <label
                  htmlFor="township"
                  className="block text-text-muted text-sm font-medium mb-2"
                >
                  Township *
                </label>
                <input
                  id="township"
                  type="text"
                  value={form.township}
                  onChange={handleChange}
                  placeholder="e.g., Kamayut"
                  className="w-full bg-bg border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                />
                <span className="text-red-500 text-xs">{errors.township}</span>
              </div>
            </div>

            {/* contact info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label
                  htmlFor="phone"
                  className="block text-text-muted text-sm font-medium mb-2"
                >
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="09xxxxxxxxx"
                  className="w-full bg-bg border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                />
                <span className="text-red-500 text-xs">{errors.phone}</span>
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="preferredMethod"
                  className="block text-text-muted text-sm font-medium mb-2"
                >
                  Preferred
                </label>
                <select
                  id="preferredMethod"
                  value={form.preferredMethod}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border text-text rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="any">Anytime</option>
                  <option value="call">Call Only</option>
                  <option value="telegram">Telegram Only</option>
                  <option value="message">Message Only</option>
                </select>
              </div>
            </div>

            {/* ★ Social media — data-driven, 4x duplicate block ဖျက်ပြီး map */}
            <div className="pt-2 border-t border-border/50 space-y-3">
              <label className="block text-text-subtle text-xs font-semibold uppercase tracking-wider">
                Add Social Media (Optional)
              </label>

              <div className="flex flex-wrap gap-2">
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
                      className="px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all active:scale-95"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d={platform.path} />
                      </svg>
                      <span>{platform.label}</span>
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
                      {/* ★ Error Message ကို platform.id အလိုက် Dynamic ပြသခြင်း */}
                      {errors[platform.id] && (
                        <span className="text-red-500 text-xs font-medium pl-22">
                          {errors[platform.id]}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {/* save as draft btn */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-3 inline-flex items-center justify-center gap-2 bg-surface hover:bg-surface-2 text-text-muted hover:text-text border border-border rounded-xl font-semibold transition-all duration-200 active:scale-[0.99]"
            >
              Save as Draft
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 sm:flex-initial px-5 py-3 inline-flex items-center justify-center gap-2 bg-surface hover:bg-surface-2 text-text-muted hover:text-text border border-border rounded-xl font-semibold transition-all duration-200 active:scale-[0.99]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial px-5 py-3 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl border border-primary/50 shadow-sm transition-all duration-200 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:bg-bg-subtle disabled:text-text-subtle disabled:border-border-muted disabled:cursor-not-allowed"
              >
                <CloudUpload size={17} />
                {isSubmitting ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default MarketplacePostForm;
