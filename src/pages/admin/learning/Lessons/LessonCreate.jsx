import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// Lucide Icons
import {
  BookOpen,
  Plus,
  Trash2,
  Type,
  ImagePlus,
  Video,
  Code2,
  Cpu,
  Wrench,
  HelpCircle,
  CloudUpload,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

// API & Hooks & Context
import { useFetch } from "../../../../hooks/useFetch";
import { getJourneys } from "../../../../api/journeysApi";
import {
  getLessons,
  createLesson,
  updateLesson,
} from "../../../../api/lessonsApi";
import { useAlert } from "../../../../context/AlertContext";

// Helper for YouTube embed preview
const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
};

// Initial Clean Form Structure
const initialForm = {
  journeyId: "",
  chapterId: "",
  lessonUrlParam: "",
  order: 1,
  durationMin: 10,
  title: {
    en: "",
    mm: "",
  },
  description: {
    en: "",
    mm: "",
  },
  coverImage: "",
  sections: [
    {
      id: "sec-1",
      label: {
        en: "",
        mm: "",
      },
      isOpen: true,
      blocks: [{ type: "text", value: { en: "", mm: "" } }],
    },
  ],
  questions: [],
};

// Helper: Base64 check for image fields
const isBase64DataUrl = (value) => {
  return typeof value === "string" && value.startsWith("data:");
};

function LessonCreate() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({}); // 📌 Validation Errors State

  const navigate = useNavigate();
  const showAlert = useAlert();

  // Fetch Journeys
  const { data: journeysData, loading: journeysLoading } =
    useFetch(getJourneys);
  const journeys = Array.isArray(journeysData) ? journeysData : [];

  // Fetch All Lessons (To calculate chapter lesson order sequence)
  const { data: allLessonsData } = useFetch(getLessons);
  const allLessons = Array.isArray(allLessonsData) ? allLessonsData : [];

  // Find selected journey's chapters dynamically (using journeyId)
  const selectedJourney = journeys.find((j) => j.journeyId === form.journeyId);
  const availableChapters = Array.isArray(selectedJourney?.chapters)
    ? [...selectedJourney.chapters].sort(
        (a, b) => (a.order || 0) - (b.order || 0),
      )
    : [];

  // --- AUTOMATIC ORDER LOGIC (BASED ON SELECTED CHAPTER) ---
  useEffect(() => {
    if (form.journeyId && form.chapterId) {
      // Filter existing lessons for this specific chapter
      const existingChapterLessons = allLessons.filter(
        (l) => l.journeyId === form.journeyId && l.chapterId === form.chapterId,
      );

      const nextOrder = existingChapterLessons.length + 1;
      setForm((prev) => ({ ...prev, order: nextOrder }));
    }
  }, [form.journeyId, form.chapterId, allLessons]);

  // Input change handler (စာစရိုက်လျှင် error ရှိနေပါက ချက်ချင်းဖျက်ပေးမည်)
  const changeInput = (e) => {
    const { id, value } = e.target;

    if (id === "coverImage" && isBase64DataUrl(value)) {
      showAlert({
        message:
          "ကျေးဇူးပြု၍ image file ကို paste မလုပ်ပါနှင့်၊ hosted image URL (https://...) ကိုသာ ထည့်ပါ။",
        type: "warning",
      });
      return;
    }

    if (id === "order") {
      setForm((prev) => ({
        ...prev,
        [id]: value === "" ? "" : Math.max(1, Number(value)),
      }));
      if (errors.order) setErrors((prev) => ({ ...prev, order: "" }));
      return;
    }

    if (id === "durationMin") {
      setForm((prev) => ({
        ...prev,
        [id]: value === "" ? "" : Math.max(1, Number(value)),
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [id]: value }));

    // 📌 Field တွင် Error ရှိနေပါက စာစရိုက်လိုက်သည်နှင့် ချက်ချင်းဖျက်ပေးခြင်း
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // Multi-language input change handler
  const changeNestedInput = (field, lang, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));

    const errorKey =
      field === "title" ? (lang === "en" ? "titleEn" : "titleMm") : null;
    if (errorKey && errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  // --- VALIDATION LOGIC (Create ခလုတ်နှိပ်မှသာ စစ်ဆေးမည်) ---
  const validateData = () => {
    let errs = {};
    if (!form.journeyId) errs["journeyId"] = "Parent journey is required.";
    if (!form.chapterId) errs["chapterId"] = "Parent chapter is required.";
    if (!form.title.en?.trim())
      errs["titleEn"] = "Lesson title (English) is required.";
    if (!form.title.mm?.trim())
      errs["titleMm"] = "Lesson title (Myanmar) is required.";
    if (!form.coverImage?.trim())
      errs["coverImage"] = "Cover image URL is required.";
    if (!form.lessonUrlParam?.trim())
      errs["lessonUrlParam"] = "URL slug/param is required.";

    setErrors(errs);
    return errs;
  };

  // --- SECTIONS & BLOCKS HANDLERS ---
  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: `sec-${Date.now()}`,
          label: { en: "", mm: "" },
          isOpen: true,
          blocks: [{ type: "text", value: { en: "", mm: "" } }],
        },
      ],
    }));
  };

  const removeSection = (secIndex) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== secIndex),
    }));
  };

  const toggleSectionOpen = (secIndex) => {
    setForm((prev) => {
      const newSections = prev.sections.map((sec, sIdx) => {
        if (sIdx === secIndex) {
          return { ...sec, isOpen: sec.isOpen === false ? true : false };
        }
        return sec;
      });
      return { ...prev, sections: newSections };
    });
  };

  const updateSectionLabel = (secIndex, lang, value) => {
    setForm((prev) => {
      const newSections = prev.sections.map((sec, sIdx) => {
        if (sIdx === secIndex) {
          return {
            ...sec,
            label: { ...sec.label, [lang]: value },
          };
        }
        return sec;
      });
      return { ...prev, sections: newSections };
    });
  };

  const addBlockToSection = (secIndex, blockType) => {
    setForm((prev) => {
      let newBlock = { type: blockType };

      if (blockType === "text") {
        newBlock.value = { en: "", mm: "" };
      } else if (blockType === "image") {
        newBlock.url = "";
        newBlock.caption = { en: "", mm: "" };
      } else if (blockType === "video") {
        newBlock.url = "";
      } else if (blockType === "code") {
        newBlock.language = "cpp";
        newBlock.value = "";
      } else if (blockType === "simulator") {
        newBlock.provider = "wokwi";
        newBlock.id = "";
      } else if (blockType === "software") {
        newBlock.name = { en: "", mm: "" };
        newBlock.softwareType = { en: "", mm: "" };
        newBlock.link = "";
        newBlock.description = { en: "", mm: "" };
      } else if (blockType === "hardware") {
        newBlock.title = {
          en: "Hardware Required",
          mm: "လိုအပ်သော ပစ္စည်းများ",
        };
        newBlock.components = [{ name: "", qty: "1x", image: "" }];
      }

      const newSections = prev.sections.map((sec, sIdx) => {
        if (sIdx === secIndex) {
          return { ...sec, blocks: [...sec.blocks, newBlock] };
        }
        return sec;
      });

      return { ...prev, sections: newSections };
    });
  };

  const removeBlockFromSection = (secIndex, blockIndex) => {
    setForm((prev) => {
      const newSections = prev.sections.map((sec, sIdx) => {
        if (sIdx === secIndex) {
          return {
            ...sec,
            blocks: sec.blocks.filter((_, bIdx) => bIdx !== blockIndex),
          };
        }
        return sec;
      });
      return { ...prev, sections: newSections };
    });
  };

  const updateBlockField = (secIndex, blockIndex, field, value) => {
    setForm((prev) => {
      const newSections = prev.sections.map((sec, sIdx) => {
        if (sIdx === secIndex) {
          const newBlocks = sec.blocks.map((block, bIdx) => {
            if (bIdx === blockIndex) {
              return { ...block, [field]: value };
            }
            return block;
          });
          return { ...sec, blocks: newBlocks };
        }
        return sec;
      });
      return { ...prev, sections: newSections };
    });
  };

  // --- QUIZ QUESTIONS HANDLERS ---
  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: `q-${Date.now()}`,
          question: { en: "", mm: "" },
          options: [
            { en: "", mm: "" },
            { en: "", mm: "" },
          ],
          correctIndex: 0,
          xp: 10,
        },
      ],
    }));
  };

  const removeQuestion = (qIndex) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== qIndex),
    }));
  };

  const updateQuestionLang = (qIndex, lang, value) => {
    setForm((prev) => {
      const newQuestions = prev.questions.map((q, qIdx) => {
        if (qIdx === qIndex) {
          return {
            ...q,
            question: { ...q.question, [lang]: value },
          };
        }
        return q;
      });
      return { ...prev, questions: newQuestions };
    });
  };

  const updateQuestionField = (qIndex, field, value) => {
    setForm((prev) => {
      const newQuestions = prev.questions.map((q, qIdx) => {
        if (qIdx === qIndex) {
          return { ...q, [field]: value };
        }
        return q;
      });
      return { ...prev, questions: newQuestions };
    });
  };

  const addOptionToQuestion = (qIndex) => {
    setForm((prev) => {
      const newQuestions = prev.questions.map((q, qIdx) => {
        if (qIdx === qIndex) {
          return {
            ...q,
            options: [...q.options, { en: "", mm: "" }],
          };
        }
        return q;
      });
      return { ...prev, questions: newQuestions };
    });
  };

  const removeOptionFromQuestion = (qIndex, optIndex) => {
    setForm((prev) => {
      const newQuestions = prev.questions.map((q, qIdx) => {
        if (qIdx === qIndex) {
          return {
            ...q,
            options: q.options.filter((_, oIdx) => oIdx !== optIndex),
          };
        }
        return q;
      });
      return { ...prev, questions: newQuestions };
    });
  };

  const updateOptionLang = (qIndex, optIndex, lang, value) => {
    setForm((prev) => {
      const newQuestions = prev.questions.map((q, qIdx) => {
        if (qIdx === qIndex) {
          const newOptions = q.options.map((opt, oIdx) => {
            if (oIdx === optIndex) {
              return { ...opt, [lang]: value };
            }
            return opt;
          });
          return { ...q, options: newOptions };
        }
        return q;
      });
      return { ...prev, questions: newQuestions };
    });
  };

  // --- SUBMIT WITH VALIDATION & CHAPTER-STYLE REORDER & SPLICE LOGIC (CREATE) ---
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

    setIsSubmitting(true);
    try {
      // 1. Existing lessons for this chapter
      const existingLessons = allLessons
        .filter(
          (l) =>
            l.journeyId === form.journeyId && l.chapterId === form.chapterId,
        )
        .sort((a, b) => (a.order || 1) - (b.order || 1));

      const cleanedSections = form.sections.map(({ isOpen, ...sec }) => sec);

      const cleanedQuestions = form.questions.filter(
        (q) => q.question.en?.trim() || q.question.mm?.trim(),
      );

      const targetOrder = Math.max(
        1,
        Number(form.order) || existingLessons.length + 1,
      );

      const newLessonId = form.lessonUrlParam || `lesson_${Date.now()}`;

      const newLesson = {
        ...form,
        journeyId: form.journeyId,
        chapterId: form.chapterId,
        order: targetOrder,
        durationMin: Number(form.durationMin) || 10,
        sections: cleanedSections,
        questions: cleanedQuestions,
        id: newLessonId,
        createdAt: new Date().toISOString(),
        completedUserIds: [],
      };

      // ==========================================
      // 📌 CHAPTER-STYLE REORDER & SPLICE LOGIC (CREATE):
      // ==========================================
      const targetIndex = Math.max(
        0,
        Math.min(targetOrder - 1, existingLessons.length),
      );

      const updatedLessons = [...existingLessons];
      updatedLessons.splice(targetIndex, 0, newLesson);

      const finalLessons = updatedLessons.map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));
      // ==========================================

      // 3. Save new lesson
      await createLesson(newLesson);

      // 4. Update order sequence for affected lessons
      for (const item of finalLessons) {
        const itemId = item.id || item._id;
        if (itemId && itemId !== newLessonId) {
          await updateLesson(itemId, { ...item, order: item.order });
        }
      }

      showAlert({
        message: "Lesson created successfully!",
        type: "success",
      });
      navigate("/admin/learning/lessons");
    } catch (err) {
      console.error("Failed to create lesson:", err);
      showAlert({
        message: "Failed to create lesson. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/learning/lessons");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-text text-2xl font-bold mb-1">
            <BookOpen size={22} className="text-primary" />
            Create New Lesson
          </h2>
          <p className="text-text-muted text-sm">
            Add a new lesson with multi-language support, sections, and quizzes.
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
                to="/admin/learning/lessons"
                className="hover:text-text transition-colors"
              >
                Lessons
              </Link>
            </li>
            <li className="text-border">/</li>
            <li>
              <span className="text-text font-semibold">Create</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-bg-elevated border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
      >
        {/* Parent Selection: Journey & Chapter */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Parent Journey <span className="text-rose-500">*</span>
            </label>
            <select
              id="journeyId"
              value={form.journeyId}
              onChange={(e) => {
                changeInput(e);
                setForm((prev) => ({
                  ...prev,
                  journeyId: e.target.value,
                  chapterId: "",
                }));
                if (errors.journeyId)
                  setErrors((prev) => ({ ...prev, journeyId: "" }));
              }}
              disabled={journeysLoading}
              className="w-full bg-surface border border-border text-text rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all disabled:opacity-50"
            >
              <option value="" disabled>
                {journeysLoading
                  ? "Loading journeys..."
                  : "-- Choose Journey --"}
              </option>
              {journeys.map((j) => (
                <option key={j.journeyId} value={j.journeyId}>
                  {j.title} ({j.journeyId})
                </option>
              ))}
            </select>
            {errors.journeyId && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.journeyId}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Parent Chapter <span className="text-rose-500">*</span>
            </label>
            <select
              id="chapterId"
              value={form.chapterId}
              onChange={(e) => {
                changeInput(e);
                if (errors.chapterId)
                  setErrors((prev) => ({ ...prev, chapterId: "" }));
              }}
              disabled={!form.journeyId || availableChapters.length === 0}
              className="w-full bg-surface border border-border text-text rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all disabled:opacity-50"
            >
              <option value="" disabled>
                {!form.journeyId
                  ? "Select Journey first..."
                  : availableChapters.length === 0
                    ? "No chapters available"
                    : "-- Choose Chapter --"}
              </option>
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title?.en || ch.title?.mm || ch.id}
                </option>
              ))}
            </select>
            {errors.chapterId && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.chapterId}
              </span>
            )}
          </div>
        </div>

        <hr className="border-border-muted" />

        {/* Title (English & Myanmar) */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Lesson Title (English) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.title.en}
              onChange={(e) => changeNestedInput("title", "en", e.target.value)}
              placeholder="e.g., Blinking Your First LED"
              className="w-full bg-surface border border-border text-text placeholder:text-text-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
            />
            {errors.titleEn && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.titleEn}
              </span>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Lesson Title (Myanmar 🇲🇲) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.title.mm}
              onChange={(e) => changeNestedInput("title", "mm", e.target.value)}
              placeholder="ဥပမာ - ပထမဆုံး LED မီးမှိတ်တမ်းခတ်ခြင်း"
              className="w-full bg-surface border border-border text-text placeholder:text-text-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
            />
            {errors.titleMm && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.titleMm}
              </span>
            )}
          </div>
        </div>

        {/* Description (English & Myanmar) */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Description (English)
            </label>
            <textarea
              rows={3}
              value={form.description.en}
              onChange={(e) =>
                changeNestedInput("description", "en", e.target.value)
              }
              placeholder="Brief summary in English..."
              className="w-full bg-surface border border-border text-text placeholder:text-text-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all resize-y"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Description (Myanmar 🇲🇲)
            </label>
            <textarea
              rows={3}
              value={form.description.mm}
              onChange={(e) =>
                changeNestedInput("description", "mm", e.target.value)
              }
              placeholder="မြန်မာလို အကျဉ်းချုပ်..."
              className="w-full bg-surface border border-border text-text placeholder:text-text-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all resize-y"
            />
          </div>
        </div>

        {/* Cover Image URL with Live Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 items-start">
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Cover Image URL <span className="text-rose-500">*</span>
            </label>
            <input
              id="coverImage"
              type="url"
              value={form.coverImage}
              onChange={changeInput}
              placeholder="https://.../cover.png"
              className="w-full bg-surface border border-border text-text placeholder:text-text-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary font-mono transition-all"
            />
            {errors.coverImage && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.coverImage}
              </span>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
              Preview
            </label>
            <div className="w-full sm:w-36 h-24 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden text-text-muted shadow-xs p-1">
              {form.coverImage?.trim() ? (
                <img
                  src={form.coverImage}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-[10px] text-text-muted">No Image</span>
              )}
            </div>
          </div>
        </div>

        {/* Duration & Order & URL Param */}
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label
              htmlFor="durationMin"
              className="block text-xs font-semibold text-text uppercase tracking-wider mb-2"
            >
              Duration (Minutes)
            </label>
            <input
              id="durationMin"
              type="number"
              min="1"
              value={form.durationMin}
              onChange={changeInput}
              className="w-full bg-surface border border-border text-text rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="order"
              className="block text-xs font-semibold text-text uppercase tracking-wider mb-2"
            >
              Order Number
            </label>
            <input
              id="order"
              type="number"
              min="1"
              value={form.order}
              onChange={changeInput}
              className="w-full bg-surface border border-border text-text rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
            />
            <p className="text-[11px] text-text-muted mt-1">
              Auto-calculated sequence for selected chapter.
            </p>
          </div>
          <div>
            <label
              htmlFor="lessonUrlParam"
              className="block text-xs font-semibold text-text uppercase tracking-wider mb-2"
            >
              URL Slug / Param <span className="text-rose-500">*</span>
            </label>
            <input
              id="lessonUrlParam"
              type="text"
              value={form.lessonUrlParam}
              onChange={changeInput}
              placeholder="uno-led-blink"
              className="w-full bg-surface border border-border text-text placeholder:text-text-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary font-mono transition-all"
            />
            {errors.lessonUrlParam && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.lessonUrlParam}
              </span>
            )}
          </div>
        </div>

        <hr className="border-border-muted" />

        {/* --- SECTIONS & DYNAMIC BLOCKS BUILDER --- */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-text">
                Lesson Sections & Content Blocks
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Click section header to collapse/expand sections for clean
                editing.
              </p>
            </div>
            <button
              type="button"
              onClick={addSection}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus size={14} /> Add Section
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {form.sections.map((section, secIndex) => {
              const isOpen = section.isOpen !== false;
              return (
                <div
                  key={section.id || secIndex}
                  className="bg-surface/50 border border-border rounded-2xl overflow-hidden transition-all"
                >
                  <div
                    onClick={() => toggleSectionOpen(secIndex)}
                    className="flex items-center justify-between p-4 bg-surface border-b border-border/60 cursor-pointer select-none hover:bg-surface-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                        Section {secIndex + 1}
                      </span>
                      <span className="text-sm font-semibold text-text truncate max-w-xs sm:max-w-md">
                        {section.label.en ||
                          section.label.mm ||
                          `Untitled Section ${secIndex + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(secIndex);
                        }}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete Section"
                      >
                        <Trash2 size={16} />
                      </button>
                      <span className="text-text-muted p-1">
                        {isOpen ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-4 sm:p-5 flex flex-col gap-4">
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={section.label.en}
                          onChange={(e) =>
                            updateSectionLabel(secIndex, "en", e.target.value)
                          }
                          placeholder="Section Label (English) e.g., 1. Introduction"
                          className="bg-surface border border-border text-text text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-primary"
                        />
                        <input
                          type="text"
                          value={section.label.mm}
                          onChange={(e) =>
                            updateSectionLabel(secIndex, "mm", e.target.value)
                          }
                          placeholder="Section Label (Myanmar) ဥပမာ - ၁။ မိတ်ဆက်"
                          className="bg-surface border border-border text-text text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="flex flex-col gap-3 pl-2 md:pl-4 border-l-2 border-border-muted">
                        {section.blocks.map((block, blockIndex) => (
                          <div
                            key={blockIndex}
                            className="bg-surface border border-border-muted p-4 rounded-xl flex flex-col gap-3.5 relative"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] uppercase tracking-wider font-semibold text-text-subtle bg-bg-subtle px-2.5 py-0.5 rounded">
                                Block: {block.type}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  removeBlockFromSection(secIndex, blockIndex)
                                }
                                className="text-text-subtle hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            {block.type === "text" && (
                              <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                                    Text Content (English)
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={block.value?.en || ""}
                                    onChange={(e) => {
                                      const updatedVal = {
                                        ...block.value,
                                        en: e.target.value,
                                      };
                                      updateBlockField(
                                        secIndex,
                                        blockIndex,
                                        "value",
                                        updatedVal,
                                      );
                                    }}
                                    placeholder="Write English text..."
                                    className="w-full bg-bg-subtle border border-border text-text text-sm rounded-xl p-3 focus:outline-none focus:border-primary"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                                    စာသား အကြောင်းအရာ (Myanmar 🇲🇲)
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={block.value?.mm || ""}
                                    onChange={(e) => {
                                      const updatedVal = {
                                        ...block.value,
                                        mm: e.target.value,
                                      };
                                      updateBlockField(
                                        secIndex,
                                        blockIndex,
                                        "value",
                                        updatedVal,
                                      );
                                    }}
                                    placeholder="မြန်မာလို ရေးရန်..."
                                    className="w-full bg-bg-subtle border border-border text-text text-sm rounded-xl p-3 focus:outline-none focus:border-primary"
                                  />
                                </div>
                              </div>
                            )}

                            {block.type === "image" && (
                              <div className="flex flex-col gap-4">
                                <div>
                                  <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                                    Image URL{" "}
                                    <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="url"
                                    value={block.url || ""}
                                    onChange={(e) =>
                                      updateBlockField(
                                        secIndex,
                                        blockIndex,
                                        "url",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="https://... (Hosted Image URL)"
                                    className="w-full bg-bg-subtle border border-border text-text text-sm rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-primary transition-all"
                                  />
                                </div>

                                {block.url?.trim() ? (
                                  <div className="space-y-1.5">
                                    <span className="block text-[11px] font-semibold text-text-subtle uppercase tracking-wider">
                                      Live Preview
                                    </span>
                                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border bg-[#0a0d14] flex items-center justify-center p-3 shadow-xs group">
                                      <img
                                        src={block.url}
                                        alt="Block Preview"
                                        className="w-full h-full object-contain max-h-44 rounded-lg"
                                        onError={(e) => {
                                          e.currentTarget.style.display =
                                            "none";
                                        }}
                                      />
                                    </div>
                                  </div>
                                ) : null}

                                <div className="grid md:grid-cols-2 gap-3 pt-1">
                                  <div>
                                    <label className="block text-[10px] text-text-subtle uppercase tracking-wider mb-1">
                                      Caption (English)
                                    </label>
                                    <input
                                      type="text"
                                      value={block.caption?.en || ""}
                                      onChange={(e) => {
                                        const cap = {
                                          ...block.caption,
                                          en: e.target.value,
                                        };
                                        updateBlockField(
                                          secIndex,
                                          blockIndex,
                                          "caption",
                                          cap,
                                        );
                                      }}
                                      placeholder="e.g., Circuit Pinout Diagram"
                                      className="w-full bg-bg-subtle border border-border text-text text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-primary"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-text-subtle uppercase tracking-wider mb-1">
                                      Caption (Myanmar 🇲🇲)
                                    </label>
                                    <input
                                      type="text"
                                      value={block.caption?.mm || ""}
                                      onChange={(e) => {
                                        const cap = {
                                          ...block.caption,
                                          mm: e.target.value,
                                        };
                                        updateBlockField(
                                          secIndex,
                                          blockIndex,
                                          "caption",
                                          cap,
                                        );
                                      }}
                                      placeholder="ဥပမာ - ဆားကစ် ပင်ထွက်ပုံစံ"
                                      className="w-full bg-bg-subtle border border-border text-text text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-primary"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {block.type === "video" && (
                              <div className="flex flex-col gap-3">
                                <input
                                  type="url"
                                  value={block.url || ""}
                                  onChange={(e) =>
                                    updateBlockField(
                                      secIndex,
                                      blockIndex,
                                      "url",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="YouTube Video URL"
                                  className="bg-bg-subtle border border-border text-text text-sm rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-primary"
                                />
                                {block.url?.trim() && (
                                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-black/40">
                                    <iframe
                                      src={getYouTubeEmbedUrl(block.url)}
                                      title="Video Preview"
                                      className="w-full h-full border-0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                )}
                              </div>
                            )}

                            {block.type === "code" && (
                              <div className="flex flex-col gap-2">
                                <input
                                  type="text"
                                  value={block.language || "cpp"}
                                  onChange={(e) =>
                                    updateBlockField(
                                      secIndex,
                                      blockIndex,
                                      "language",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Language"
                                  className="bg-bg-subtle border border-border text-text text-xs rounded-lg px-3 py-1.5 w-40 font-mono"
                                />
                                <textarea
                                  rows={4}
                                  value={block.value || ""}
                                  onChange={(e) =>
                                    updateBlockField(
                                      secIndex,
                                      blockIndex,
                                      "value",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="void setup() { ... }"
                                  className="bg-bg-subtle border border-border text-text text-sm font-mono rounded-xl p-3"
                                />
                              </div>
                            )}

                            {block.type === "simulator" && (
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-text-muted font-medium shrink-0">
                                    Provider: Wokwi
                                  </span>
                                  <input
                                    type="text"
                                    value={block.id || ""}
                                    onChange={(e) =>
                                      updateBlockField(
                                        secIndex,
                                        blockIndex,
                                        "id",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Wokwi Project ID (e.g., 362541578326176769)"
                                    className="flex-1 bg-bg-subtle border border-border text-text text-sm rounded-xl px-3.5 py-2.5 font-mono"
                                  />
                                </div>

                                {/* 🚀 Wokwi Simulator Live Preview */}
                                {block.id?.trim() ? (
                                  <div className="space-y-1.5 mt-2">
                                    <span className="block text-[11px] font-semibold text-text-subtle uppercase tracking-wider">
                                      Simulator Live Preview
                                    </span>
                                    <div className="w-full h-[350px] sm:h-[450px] rounded-xl overflow-hidden border border-border bg-bg-elevated shadow-sm">
                                      <iframe
                                        src={`https://wokwi.com/projects/${block.id}?embed=1`}
                                        title="Wokwi Simulator Preview"
                                        className="w-full h-full border-0"
                                        allow="autoplay"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-[11px] text-text-muted italic">
                                    * Wokwi Project ID ထည့်သွင်းပါက ဆင်မြူလေတာ
                                    ပုံစံငယ်ကို ဤနေရာတွင်
                                    တိုက်ရိုက်ကြည့်ရှုနိုင်မည်။
                                  </p>
                                )}
                              </div>
                            )}

                            {block.type === "software" && (
                              <div className="flex flex-col gap-4">
                                {/* Software Name (EN & MM) */}
                                <div className="grid md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                                      Software Name (English)
                                    </label>
                                    <input
                                      type="text"
                                      value={block.name?.en || ""}
                                      onChange={(e) => {
                                        const n = {
                                          ...block.name,
                                          en: e.target.value,
                                        };
                                        updateBlockField(
                                          secIndex,
                                          blockIndex,
                                          "name",
                                          n,
                                        );
                                      }}
                                      placeholder="e.g., Arduino IDE"
                                      className="w-full bg-bg-subtle border border-border text-text text-xs rounded-lg px-3 py-2"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                                      ဆော့ဖ်ဝဲအမည် (Myanmar 🇲🇲)
                                    </label>
                                    <input
                                      type="text"
                                      value={block.name?.mm || ""}
                                      onChange={(e) => {
                                        const n = {
                                          ...block.name,
                                          mm: e.target.value,
                                        };
                                        updateBlockField(
                                          secIndex,
                                          blockIndex,
                                          "name",
                                          n,
                                        );
                                      }}
                                      placeholder="ဥပမာ - Arduino IDE"
                                      className="w-full bg-bg-subtle border border-border text-text text-xs rounded-lg px-3 py-2"
                                    />
                                  </div>
                                </div>

                                {/* Software Type (EN & MM) */}
                                <div className="grid md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                                      Software Type (English)
                                    </label>
                                    <input
                                      type="text"
                                      value={block.softwareType?.en || ""}
                                      onChange={(e) => {
                                        const st = {
                                          ...block.softwareType,
                                          en: e.target.value,
                                        };
                                        updateBlockField(
                                          secIndex,
                                          blockIndex,
                                          "softwareType",
                                          st,
                                        );
                                      }}
                                      placeholder="e.g., IDE / Compiler"
                                      className="w-full bg-bg-subtle border border-border text-text text-xs rounded-lg px-3 py-2"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                                      ဆော့ဖ်ဝဲအမျိုးအစား (Myanmar 🇲🇲)
                                    </label>
                                    <input
                                      type="text"
                                      value={block.softwareType?.mm || ""}
                                      onChange={(e) => {
                                        const st = {
                                          ...block.softwareType,
                                          mm: e.target.value,
                                        };
                                        updateBlockField(
                                          secIndex,
                                          blockIndex,
                                          "softwareType",
                                          st,
                                        );
                                      }}
                                      placeholder="ဥပမာ - IDE / ဆော့ဖ်ဝဲလ် ရေးသားရန်"
                                      className="w-full bg-bg-subtle border border-border text-text text-xs rounded-lg px-3 py-2"
                                    />
                                  </div>
                                </div>

                                {/* Software Link */}
                                <div>
                                  <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                                    Software Link (URL)
                                  </label>
                                  <input
                                    type="url"
                                    value={block.link || ""}
                                    onChange={(e) => {
                                      updateBlockField(
                                        secIndex,
                                        blockIndex,
                                        "link",
                                        e.target.value,
                                      );
                                    }}
                                    placeholder="https://www.arduino.cc/en/software"
                                    className="w-full bg-bg-subtle border border-border text-text text-xs rounded-lg px-3 py-2 font-mono"
                                  />
                                </div>

                                {/* Description (EN & MM) */}
                                <div className="grid md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                                      Description (English)
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={block.description?.en || ""}
                                      onChange={(e) => {
                                        const desc = {
                                          ...block.description,
                                          en: e.target.value,
                                        };
                                        updateBlockField(
                                          secIndex,
                                          blockIndex,
                                          "description",
                                          desc,
                                        );
                                      }}
                                      placeholder="Open-source electronics prototyping platform."
                                      className="w-full bg-bg-subtle border border-border text-text text-xs rounded-lg p-2.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                                      ဖော်ပြချက် (Myanmar 🇲🇲)
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={block.description?.mm || ""}
                                      onChange={(e) => {
                                        const desc = {
                                          ...block.description,
                                          mm: e.target.value,
                                        };
                                        updateBlockField(
                                          secIndex,
                                          blockIndex,
                                          "description",
                                          desc,
                                        );
                                      }}
                                      placeholder="အီလက်ထရွန်နစ် ပရောဂျက်များ ဖန်တီးစမ်းသပ်ရန်..."
                                      className="w-full bg-bg-subtle border border-border text-text text-xs rounded-lg p-2.5"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {block.type === "hardware" && (
                              <div className="flex flex-col gap-3.5">
                                <span className="text-xs font-semibold text-rose-400">
                                  Hardware Components (BOM)
                                </span>
                                {(block.components || []).map((comp, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="flex flex-col gap-3 bg-bg-subtle p-3.5 rounded-xl border border-border"
                                  >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                      {/* 🚀 Image Preview Box */}
                                      <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                                        {comp.image?.trim() ? (
                                          <img
                                            src={comp.image}
                                            alt={comp.name || "Preview"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.style.display =
                                                "none";
                                            }}
                                          />
                                        ) : (
                                          <Wrench
                                            size={18}
                                            className="text-text-muted"
                                          />
                                        )}
                                      </div>

                                      {/* Input Fields */}
                                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                                        <div>
                                          <label className="block text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">
                                            Component Name
                                          </label>
                                          <input
                                            type="text"
                                            value={comp.name}
                                            onChange={(e) => {
                                              const comps = [
                                                ...block.components,
                                              ];
                                              comps[cIdx].name = e.target.value;
                                              updateBlockField(
                                                secIndex,
                                                blockIndex,
                                                "components",
                                                comps,
                                              );
                                            }}
                                            placeholder="e.g., Arduino Uno"
                                            className="w-full bg-surface border border-border text-text text-xs rounded-lg px-3 py-2"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">
                                            Quantity (Qty)
                                          </label>
                                          <input
                                            type="text"
                                            value={comp.qty}
                                            onChange={(e) => {
                                              const comps = [
                                                ...block.components,
                                              ];
                                              comps[cIdx].qty = e.target.value;
                                              updateBlockField(
                                                secIndex,
                                                blockIndex,
                                                "components",
                                                comps,
                                              );
                                            }}
                                            placeholder="e.g., 1x"
                                            className="w-full bg-surface border border-border text-text text-xs rounded-lg px-3 py-2"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">
                                            Image URL
                                          </label>
                                          <input
                                            type="url"
                                            value={comp.image}
                                            onChange={(e) => {
                                              const comps = [
                                                ...block.components,
                                              ];
                                              comps[cIdx].image =
                                                e.target.value;
                                              updateBlockField(
                                                secIndex,
                                                blockIndex,
                                                "components",
                                                comps,
                                              );
                                            }}
                                            placeholder="https://..."
                                            className="w-full bg-surface border border-border text-text text-xs rounded-lg px-3 py-2 font-mono"
                                          />
                                        </div>
                                      </div>

                                      {/* Remove Component Button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const comps = block.components.filter(
                                            (_, i) => i !== cIdx,
                                          );
                                          updateBlockField(
                                            secIndex,
                                            blockIndex,
                                            "components",
                                            comps,
                                          );
                                        }}
                                        className="text-text-muted hover:text-red-400 p-1.5 self-center"
                                        title="Remove Component"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </div>
                                ))}

                                <button
                                  type="button"
                                  onClick={() => {
                                    const comps = [
                                      ...(block.components || []),
                                      { name: "", qty: "1x", image: "" },
                                    ];
                                    updateBlockField(
                                      secIndex,
                                      blockIndex,
                                      "components",
                                      comps,
                                    );
                                  }}
                                  className="mt-1 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-bg-subtle border border-border text-text-muted hover:text-primary self-start transition-colors"
                                >
                                  <Plus size={13} /> Add Component
                                </button>
                              </div>
                            )}
                          </div>
                        ))}

                        <div className="flex flex-wrap gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => addBlockToSection(secIndex, "text")}
                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-bg-subtle border border-border text-text-muted hover:text-primary"
                          >
                            <Type size={12} /> + Text
                          </button>
                          <button
                            type="button"
                            onClick={() => addBlockToSection(secIndex, "image")}
                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-bg-subtle border border-border text-text-muted hover:text-primary"
                          >
                            <ImagePlus size={12} /> + Image
                          </button>
                          <button
                            type="button"
                            onClick={() => addBlockToSection(secIndex, "video")}
                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-bg-subtle border border-border text-text-muted hover:text-primary"
                          >
                            <Video size={12} /> + Video
                          </button>
                          <button
                            type="button"
                            onClick={() => addBlockToSection(secIndex, "code")}
                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-bg-subtle border border-border text-text-muted hover:text-primary"
                          >
                            <Code2 size={12} /> + Code
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              addBlockToSection(secIndex, "simulator")
                            }
                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-bg-subtle border border-border text-text-muted hover:text-primary"
                          >
                            <Cpu size={12} /> + Simulator
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              addBlockToSection(secIndex, "software")
                            }
                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-bg-subtle border border-border text-text-muted hover:text-primary"
                          >
                            <Code2 size={12} /> + Software
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              addBlockToSection(secIndex, "hardware")
                            }
                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-bg-subtle border border-border text-text-muted hover:text-primary"
                          >
                            <Wrench size={12} /> + Hardware
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <hr className="border-border-muted" />

        {/* --- QUIZ QUESTIONS BUILDER SECTION --- */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-text flex items-center gap-2">
              <HelpCircle size={18} className="text-primary" /> Quiz Questions
              (Optional)
            </h3>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus size={14} /> Add Question
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {form.questions.map((q, qIndex) => (
              <div
                key={q.id || qIndex}
                className="bg-surface/50 border border-border p-4 sm:p-5 rounded-2xl flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                    Question {qIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-400 p-1.5 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Question Inputs with Labels */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                      Question (English)
                    </label>
                    <input
                      type="text"
                      value={q.question.en}
                      onChange={(e) =>
                        updateQuestionLang(qIndex, "en", e.target.value)
                      }
                      placeholder="Question (English)..."
                      className="w-full bg-surface border border-border text-text text-sm rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                      မေးခွန်း (Myanmar 🇲🇲)
                    </label>
                    <input
                      type="text"
                      value={q.question.mm}
                      onChange={(e) =>
                        updateQuestionLang(qIndex, "mm", e.target.value)
                      }
                      placeholder="မေးခွန်း (မြန်မာ)..."
                      className="w-full bg-surface border border-border text-text text-sm rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                </div>

                {/* Options with Labels */}
                <div className="flex flex-col gap-3 pl-2 border-l-2 border-border-muted">
                  <span className="text-xs font-medium text-text-muted">
                    Options (မှန်ကန်သော အဖြေကို Radio Button ဖြင့် ရွေးပါ):
                  </span>
                  {q.options.map((opt, optIndex) => (
                    <div
                      key={optIndex}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-surface/40 p-2.5 rounded-xl border border-border/60"
                    >
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctIndex === optIndex}
                          onChange={() =>
                            updateQuestionField(
                              qIndex,
                              "correctIndex",
                              optIndex,
                            )
                          }
                          className="accent-primary"
                          title="Correct Answer"
                        />
                        <span className="text-xs font-semibold text-text-muted sm:hidden">
                          Option {optIndex + 1}
                        </span>
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                        <div>
                          <label className="block text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">
                            Option {optIndex + 1} (EN)
                          </label>
                          <input
                            type="text"
                            value={opt.en}
                            onChange={(e) =>
                              updateOptionLang(
                                qIndex,
                                optIndex,
                                "en",
                                e.target.value,
                              )
                            }
                            placeholder="English option..."
                            className="w-full bg-surface border border-border text-text text-xs rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">
                            ရွေးချယ်စရာ {optIndex + 1} (MM)
                          </label>
                          <input
                            type="text"
                            value={opt.mm}
                            onChange={(e) =>
                              updateOptionLang(
                                qIndex,
                                optIndex,
                                "mm",
                                e.target.value,
                              )
                            }
                            placeholder="မြန်မာ option..."
                            className="w-full bg-surface border border-border text-text text-xs rounded-lg px-3 py-2"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeOptionFromQuestion(qIndex, optIndex)
                        }
                        className="text-text-subtle hover:text-red-400 p-1 self-end sm:self-center"
                        title="Remove Option"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOptionToQuestion(qIndex)}
                    className="mt-1 text-xs text-primary font-medium hover:underline self-start"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-border-muted" />

        {/* SUBMIT & CANCEL BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-2 text-text text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating...
              </>
            ) : (
              <>
                <CloudUpload size={16} /> Create Lesson
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LessonCreate;
