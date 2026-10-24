import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { SavePlus, Loader2 } from "lucide-react";
import { useFetch } from "../../../../hooks/useFetch";
import { getJourneys, updateJourney } from "../../../../api/journeysApi";
import { useAlert } from "../../../../context/AlertContext";

const ChapterEdit = () => {
  const { journeySystemId, chapterId } = useParams();
  const navigate = useNavigate();
  const showAlert = useAlert();

  const { data: journeysData, loading: journeysLoading } =
    useFetch(getJourneys);
  const journeys = Array.isArray(journeysData) ? journeysData : [];

  const [saving, setSaving] = useState(false);
  const [loadingChapter, setLoadingChapter] = useState(true);
  const [errors, setErrors] = useState({});

  // 🚀 useRef အစား React State များကို အသုံးပြုခြင်း
  const [formData, setFormData] = useState({
    titleEn: "",
    titleMm: "",
    descEn: "",
    descMm: "",
    order: 1,
  });

  const findTargetJourney = (list) => {
    return list.find(
      (j) =>
        String(j.id) === String(journeySystemId) ||
        String(j.journeyId) === String(journeySystemId),
    );
  };

  useEffect(() => {
    if (!journeysLoading && journeys.length > 0) {
      const journey = findTargetJourney(journeys);

      if (journey && Array.isArray(journey.chapters)) {
        const chapter = journey.chapters.find(
          (ch) =>
            String(ch.id) === String(chapterId) ||
            String(ch.chapterIndex) === String(chapterId),
        );

        if (chapter) {
          // 🚀 State ထဲသို့ Data များကို ထည့်သွင်းခြင်းဖြင့် Input တွေမှာ အလိုအလျောက် ပေါ်လာစေရန်
          setFormData({
            titleEn:
              typeof chapter.title === "object"
                ? chapter.title?.en || ""
                : chapter.title || "",
            titleMm:
              typeof chapter.title === "object" ? chapter.title?.mm || "" : "",
            descEn:
              typeof chapter.desc === "object"
                ? chapter.desc?.en || ""
                : chapter.desc || chapter.description || "",
            descMm:
              typeof chapter.desc === "object" ? chapter.desc?.mm || "" : "",
            order: chapter.order || 1,
          });
        }
      }
      setLoadingChapter(false);
    }
  }, [journeysLoading, journeys, journeySystemId, chapterId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateData = () => {
    let errs = {};
    if (!formData.titleEn.trim()) {
      errs["titleEn"] = "Chapter title (English) is required.";
    }
    if (!formData.titleMm.trim()) {
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

    try {
      setSaving(true);

      const journey = findTargetJourney(journeys);
      if (!journey) {
        throw new Error("Journey not found");
      }

      const existingChapters = Array.isArray(journey.chapters)
        ? journey.chapters
        : [];

      const currentIndex = existingChapters.findIndex(
        (ch) =>
          String(ch.id) === String(chapterId) ||
          String(ch.chapterIndex) === String(chapterId),
      );

      if (currentIndex === -1) {
        throw new Error("Chapter not found in journey");
      }

      const updatedChapters = [...existingChapters];
      const [movedChapter] = updatedChapters.splice(currentIndex, 1);

      movedChapter.title = {
        en: formData.titleEn.trim(),
        mm: formData.titleMm.trim(),
      };
      movedChapter.desc = {
        en: formData.descEn.trim(),
        mm: formData.descMm.trim(),
      };
      movedChapter.order = Number(formData.order) || 1;

      const targetIndex = Math.max(
        0,
        Math.min(movedChapter.order - 1, updatedChapters.length),
      );
      updatedChapters.splice(targetIndex, 0, movedChapter);

      const finalChapters = updatedChapters.map((chapter, idx) => ({
        ...chapter,
        order: idx + 1,
      }));

      await updateJourney(journey.id, {
        ...journey,
        chapters: finalChapters,
      });

      showAlert({ message: "Chapter updated successfully!", type: "success" });
      navigate("/admin/learning/chapters");
    } catch (err) {
      console.error("Failed to update chapter:", err);
      showAlert({
        message: "Failed to update chapter. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (journeysLoading || loadingChapter) {
    return (
      <div className="text-center py-20 text-text-muted">
        <Loader2 size={32} className="mx-auto text-primary animate-spin mb-3" />
        Loading chapter details...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Edit Chapter</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Modify chapter details, multi-language titles, and sorting order.
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
              <span className="text-text font-semibold">Edit</span>
            </li>
          </ol>
        </nav>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-bg-elevated border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Chapter Title (English) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="titleEn"
              value={formData.titleEn}
              onChange={handleChange}
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
              name="titleMm"
              value={formData.titleMm}
              onChange={handleChange}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Description (English)
            </label>
            <textarea
              rows={4}
              name="descEn"
              value={formData.descEn}
              onChange={handleChange}
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
              name="descMm"
              value={formData.descMm}
              onChange={handleChange}
              placeholder="မြန်မာလို ဖော်ပြချက်..."
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="max-w-xs">
          <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
            Chapter Order Number
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            placeholder="1"
            className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

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
                <Loader2 size={16} className="animate-spin" /> Updating...
              </>
            ) : (
              <>
                <SavePlus size={16} /> Update
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChapterEdit;
