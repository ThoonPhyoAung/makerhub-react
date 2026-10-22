import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Image as ImageIcon, Wrench, Palette, Plus } from "lucide-react";
import { createJourney } from "../../../../api/journeysApi";
import { useAlert } from "../../../../context/AlertContext";
import { boardIconMap, RenderIcon } from "../../../../utils/iconMaps";

function JourneyCreate() {
  const navigate = useNavigate();
  const showAlert = useAlert();

  // 1. Inputs များကို useRef ဖြင့် ဖမ်းခြင်း
  const idRef = useRef("");
  const titleRef = useRef("");
  const levelRef = useRef("Beginner");
  const descRef = useRef("");

  // 2. States (Board Image, Color နဲ့ Icon Key တို့အတွက် State သုံးခြင်း)
  const [boardImage, setBoardImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("#00878F");
  const [iconKey, setIconKey] = useState("arduino");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // 3. Error များအတွက် State
  const [errors, setErrors] = useState({});

  // 4. Inputs အားလုံးကို Validation စစ်မည့် Logic
  const validateData = () => {
    let errs = {};
    if (!idRef.current?.value.trim()) errs["id"] = "Journey ID is required.";
    if (!titleRef.current?.value.trim()) errs["title"] = "Title is required.";
    if (!levelRef.current?.value)
      errs["level"] = "Difficulty level is required.";

    // 📌 iconKey State ကို တိုက်ရိုက် စစ်ဆေးခြင်း
    if (!iconKey || !iconKey.trim()) errs["iconKey"] = "Icon key is required.";

    if (!selectedColor.trim()) errs["color"] = "Theme color is required.";
    if (!boardImage.trim()) errs["boardImage"] = "Board image URL is required.";
    if (!descRef.current?.value.trim())
      errs["desc"] = "Description is required.";

    setErrors(errs);
    return errs;
  };

  // 5. Save Journey Function (API သို့ ပို့ဆောင်ခြင်း)
  const saveJourney = async () => {
    const err = validateData();
    if (Object.keys(err).length > 0) {
      return;
    }

    const journeyId = idRef.current.value.trim();

    const newJourney = {
      journeyId: `${journeyId.toLowerCase().replace(/\s+/g, "-")}`,
      title: titleRef.current.value.trim(),
      level: levelRef.current.value,
      iconKey: iconKey,
      color: selectedColor,
      colorBg: `${selectedColor}20`, //"#00588f20" , opacity 20
      boardImage: boardImage.trim(),
      link: `/${journeyId.toLowerCase().replace(/\s+/g, "-")}`,
      desc: descRef.current.value.trim(),
      studentsCount: "0",
      chapters: [],
      createdAt: new Date().toISOString(),
    };

    try {
      setIsCreating(true);
      await createJourney(newJourney);

      navigate("/admin/learning/journeys");
      showAlert({
        message: `Journey "${newJourney.title}" created successfully!`,
        type: "success",
      });
    } catch (apiErr) {
      console.error("API create failed:", apiErr);
      showAlert({
        message: "Failed to create journey via API. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 📌 Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Create New Journey</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Add a new learning track, custom color picker, and auto-generated
            links.
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
                to="/admin/learning/journeys"
                className="hover:text-text transition-colors"
              >
                Journeys
              </Link>
            </li>
            <li className="text-border">/</li>
            <li>
              <span className="text-text font-semibold">Create</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* 📌 Main Form Card Container */}
      <div className="bg-bg-elevated border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* 📌 Header with Current Date on the Right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-2">
          <div>
            <h2 className="text-lg font-bold text-text">
              Journey Track Details
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Fill in core attributes, color configuration, and board preview.
            </p>
          </div>

          {/* Current Date Badge */}
          <div className="self-start sm:self-auto bg-surface border border-border px-3 py-1.5 rounded-xl text-xs font-mono text-text-muted flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Created Date:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* ID & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-text mb-2">
              Journey ID (Slug) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              ref={idRef}
              placeholder="e.g. arduino-uno"
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary font-mono transition-colors"
            />
            {errors.id && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.id}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-2">
              Journey Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              ref={titleRef}
              placeholder="e.g. Arduino Journey"
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            {errors.title && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.title}
              </span>
            )}
          </div>
        </div>

        {/* Level, IconKey & Advanced Color Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-text mb-2">
              Difficulty Level <span className="text-rose-500">*</span>
            </label>
            <select
              ref={levelRef}
              defaultValue="Beginner"
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {errors.level && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.level}
              </span>
            )}
          </div>

          {/* Icon Key Custom Dropdown Section */}
          <div className="relative">
            <label className="block text-xs font-semibold text-text mb-2">
              Icon Key <span className="text-rose-500">*</span>
            </label>

            {/* Trigger Box */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text flex items-center justify-between cursor-pointer hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2.5 font-mono uppercase text-xs">
                <RenderIcon
                  iconKey={iconKey}
                  map={boardIconMap}
                  size={18}
                  className="text-primary"
                />
                <span className="font-semibold text-text">{iconKey}</span>
              </div>
              <span
                className={`text-text-muted text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </div>

            {/* Dropdown Menu List */}
            {isOpen && (
              <div className="absolute z-20 w-full mt-1.5 bg-surface border border-border rounded-xl shadow-lg overflow-hidden py-1">
                {Object.keys(boardIconMap).map((key) => (
                  <div
                    key={key}
                    onClick={() => {
                      setIconKey(key);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-mono uppercase cursor-pointer transition-colors ${
                      iconKey === key
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-text hover:bg-surface-2"
                    }`}
                  >
                    <RenderIcon iconKey={key} map={boardIconMap} size={16} />
                    <span>{key}</span>
                  </div>
                ))}
              </div>
            )}

            {errors.iconKey && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.iconKey}
              </span>
            )}
          </div>

          {/* Advanced Color Picker with Hex Input Support */}
          <div>
            <label className="block text-xs font-semibold text-text mb-2 flex items-center gap-1">
              <Palette size={14} className="text-primary" /> Theme Color{" "}
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2.5 bg-surface border border-border rounded-xl px-3 py-1.5">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border-0 shrink-0"
              />
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                placeholder="#00878F"
                className="w-full bg-transparent text-xs font-mono text-text uppercase focus:outline-none"
              />
            </div>
            {errors.color && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.color}
              </span>
            )}
          </div>
        </div>

        {/* Board Image URL with Optimized Preview Size */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 items-start">
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-text mb-2 flex items-center gap-1">
              <ImageIcon size={14} className="text-primary" /> Board Image URL{" "}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={boardImage}
              onChange={(e) => setBoardImage(e.target.value)}
              placeholder="https://.../arduinouno.png"
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary font-mono transition-colors"
            />
            {errors.boardImage && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.boardImage}
              </span>
            )}
          </div>

          {/* Optimized Image Preview Box */}
          <div>
            <label className="block text-xs font-semibold text-text mb-2">
              Preview
            </label>
            <div className="w-full sm:w-36 h-24 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden text-text-muted shadow-xs p-2">
              {boardImage ? (
                <img
                  src={boardImage}
                  alt="Board Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 text-text-muted">
                  <Wrench size={20} />
                  <span className="text-[10px]">No Image</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-text mb-2">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            ref={descRef}
            rows="4"
            placeholder="Enter brief description of this learning journey..."
            className="w-full bg-surface border border-border rounded-xl p-4 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary resize-none transition-colors"
          />
          {errors.desc && (
            <span className="text-rose-500 text-[11px] mt-1 block">
              * {errors.desc}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Link
            to="/admin/learning/journeys"
            className="px-5 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-2 text-text text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={saveJourney}
            disabled={isCreating}
            className="inline-flex items-center  gap-2 px-6 py-2.5 rounded-xl bg-primary hover:opacity-90 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            {isCreating ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Createing...
              </>
            ) : (
              <>
                <Plus size={16} /> Create Journey
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default JourneyCreate;
