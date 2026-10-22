import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { useFetch } from "../../../../hooks/useFetch";
import { getJourneys, updateJourney } from "../../../../api/journeysApi";
import { useAlert } from "../../../../context/AlertContext";

const ChapterCreate = () => {
  const navigate = useNavigate();
  const showAlert = useAlert();

  const { data: journeysData, loading: journeysLoading } =
    useFetch(getJourneys);
  const journeys = Array.isArray(journeysData) ? journeysData : [];

  const [selectedJourneySystemId, setSelectedJourneySystemId] = useState("");
  const [autoOrder, setAutoOrder] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({}); // 📌 Validation Errors State

  const titleEnRef = useRef(null);
  const titleMmRef = useRef(null);
  const descEnRef = useRef(null);
  const descMmRef = useRef(null);
  const orderRef = useRef(null);

  useEffect(() => {
    if (selectedJourneySystemId) {
      const journey = journeys.find((j) => j.id === selectedJourneySystemId);
      if (journey) {
        const nextOrder = Array.isArray(journey.chapters)
          ? journey.chapters.length + 1
          : 1;
        setAutoOrder(nextOrder);
        if (orderRef.current) {
          orderRef.current.value = nextOrder;
        }
      }
    }
  }, [selectedJourneySystemId, journeys]);

  // 📌 စာစရိုက်လိုက်သည်နှင့် သက်ဆိုင်ရာ field ၏ error ကို ချက်ချင်းဖျက်ပေးသည့် handler
  const handleInputChange = (fieldKey) => {
    if (errors[fieldKey]) {
      setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
    }
  };

  // --- VALIDATION LOGIC (Create ခလုတ်နှိပ်မှသာ စစ်ဆေးမည်) ---
  const validateData = () => {
    let errs = {};
    if (!selectedJourneySystemId) {
      errs["journey"] = "Parent journey is required.";
    }

    const titleEn = titleEnRef.current?.value.trim() || "";
    const titleMm = titleMmRef.current?.value.trim() || "";

    // 📌 English နဲ့ Myanmar နှစ်ခုစလုံးကို မဖြစ်မနေ တောင်းဆိုခြင်း
    if (!titleEn) {
      errs["titleEn"] = "Chapter title (English) is required.";
    }
    if (!titleMm) {
      errs["titleMm"] = "Chapter title (Myanmar) is required.";
    }

    setErrors(errs);
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateData();
    if (Object.keys(errs).length > 0) {
      showAlert({
        message: "Please fill in all required fields correctly.",
        type: "warning",
      });
      return;
    }

    const titleEn = titleEnRef.current?.value.trim() || "";
    const titleMm = titleMmRef.current?.value.trim() || "";
    const descEn = descEnRef.current?.value.trim() || "";
    const descMm = descMmRef.current?.value.trim() || "";
    const targetOrder = Number(orderRef.current?.value) || autoOrder;

    try {
      setSaving(true);

      const journey = journeys.find((j) => j.id === selectedJourneySystemId);
      if (!journey) {
        throw new Error("Journey not found in local data");
      }

      const existingChapters = Array.isArray(journey.chapters)
        ? journey.chapters
        : [];

      const newChapterId = `ch_${Date.now()}`;

      const newChapter = {
        id: newChapterId,
        title: {
          en: titleEn,
          mm: titleMm,
        },
        desc: {
          en: descEn,
          mm: descMm,
        },
        order: targetOrder,
        totalLessons: 0,
        duration: "30m",
        progress: 0,
      };

      // ==========================================
      // 📌 ORDER LOGIC (CREATE):
      // ==========================================
      const targetIndex = Math.max(
        0,
        Math.min(targetOrder - 1, existingChapters.length),
      );

      const updatedChapters = [...existingChapters];
      updatedChapters.splice(targetIndex, 0, newChapter);

      const finalChapters = updatedChapters.map((chapter, currentIndex) => ({
        ...chapter,
        order: currentIndex + 1,
      }));
      // ==========================================

      await updateJourney(selectedJourneySystemId, {
        ...journey,
        chapters: finalChapters,
      });

      showAlert({ message: "Chapter created successfully!", type: "success" });
      navigate("/admin/learning/chapters");
    } catch (err) {
      console.error("Failed to create chapter:", err);
      showAlert({
        message: "Failed to create chapter. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Add New Chapter</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Create a new learning chapter with multi-language support using
            refs.
          </p>
        </div>
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm font-medium text-text-muted">
            <li>
              <Link
                to="/admin/dashboard"
                className="hover:text-text transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li className="text-border">/</li>
            <li>
              <span className="text-text-muted">Learning</span>
            </li>
            <li className="text-border">/</li>
            <li>
              <Link
                to="/admin/learning/chapters"
                className="hover:text-text transition-colors"
              >
                Chapters
              </Link>
            </li>
            <li className="text-border">/</li>
            <li>
              <span className="text-text font-semibold">Create</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-bg-elevated border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
      >
        {/* Parent Journey Selection */}
        <div className="max-w-xl">
          <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
            Select Parent Journey <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedJourneySystemId}
            onChange={(e) => {
              setSelectedJourneySystemId(e.target.value);
              handleInputChange("journey");
            }}
            disabled={journeysLoading}
            className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">-- Choose Journey --</option>
            {journeys.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.journeyId})
              </option>
            ))}
          </select>
          {errors.journey && (
            <span className="text-rose-500 text-[11px] mt-1 block">
              * {errors.journey}
            </span>
          )}
        </div>

        {/* Chapter Title (English & Myanmar Side-by-Side using refs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Chapter Title (English) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              ref={titleEnRef}
              onChange={() => handleInputChange("titleEn")}
              placeholder="e.g., Getting Started & Basics"
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            {errors.titleEn && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.titleEn}
              </span>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Chapter Title (Myanmar 🇲🇲){" "}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              ref={titleMmRef}
              onChange={() => handleInputChange("titleMm")}
              placeholder="ဥပမာ - အခြေခံနှင့် စတင်ခြင်း"
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            {errors.titleMm && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.titleMm}
              </span>
            )}
          </div>
        </div>

        {/* Chapter Description (English & Myanmar Side-by-Side using refs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Description (English)
            </label>
            <textarea
              rows={4}
              ref={descEnRef}
              placeholder="Briefly describe what learners will build or learn..."
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Description (Myanmar 🇲🇲)
            </label>
            <textarea
              rows={4}
              ref={descMmRef}
              placeholder="မြန်မာလို ဖော်ပြချက်..."
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Order Sequence using ref */}
        <div className="max-w-xs">
          <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
            Chapter Order Number
          </label>
          <input
            type="number"
            ref={orderRef}
            defaultValue={autoOrder}
            placeholder="1"
            className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          <p className="text-[11px] text-text-muted mt-1">
            Auto-calculated based on existing chapters.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Link
            to="/admin/learning/chapters"
            className="px-5 py-2.5 rounded-xl border border-border bg-surface text-text text-xs font-semibold hover:bg-surface-2 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating...
              </>
            ) : (
              <>
                <Plus size={16} /> Create Chapter
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChapterCreate;