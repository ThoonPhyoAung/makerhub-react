import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJourneyById, updateJourney } from "../../../../api/journeysApi";
import { boardIconMap, RenderIcon } from "../../../../utils/iconMaps";
import { Palette, Image as ImageIcon, Wrench, Loader2, SavePlus, } from "lucide-react";
import { useAlert } from "../../../../context/AlertContext"; // 📌 Success/Error Alert အတွက်

const JourneyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showAlert = useAlert();

  const [journey, setJourney] = useState({});
  const [selectedColor, setSelectedColor] = useState("#00878F");
  const [iconKey, setIconKey] = useState("arduino");
  const [boardImage, setBoardImage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [isUpdating, setIsUpdating] = useState(false);

  const journeyIdRef = useRef();
  const titleRef = useRef();
  const levelRef = useRef();
  const descRef = useRef();

  // 1️⃣ Fetch Existing Data by ID
  useEffect(() => {
    fetchJourneyDetail();
  }, [id]);

  const fetchJourneyDetail = async () => {
    try {
      const data = await getJourneyById(id);
      // console.log("Fetched Data Object:", data);

      setJourney(data);

      // Bind to Live States
      setSelectedColor(data.color || "#00878F");
      setIconKey(data.iconKey || "arduino");
      setBoardImage(data.boardImage || "");

      // console.log("journey data", journey);
    } catch (err) {
      console.error("Failed to fetch journey detail:", err);
    }
  };

  // 2️⃣ Validation Logic
  const validateData = () => {
    let errs = {};
    if (!journeyIdRef.current?.value.trim())
      errs["journeyId"] = "Journey ID is required.";
    if (!titleRef.current?.value.trim()) errs["title"] = "Title is required.";
    if (!levelRef.current?.value)
      errs["level"] = "Difficulty level is required.";
    if (!iconKey || !iconKey.trim()) errs["iconKey"] = "Icon key is required.";
    if (!selectedColor.trim()) errs["color"] = "Theme color is required.";
    if (!boardImage.trim()) errs["boardImage"] = "Board image URL is required.";
    if (!descRef.current?.value.trim())
      errs["desc"] = "Description is required.";

    setErrors(errs);
    return errs;
  };

  // 3️⃣ Update Journey Function
  const handleUpdate = async () => {
    const err = validateData();
    if (Object.keys(err).length > 0) return;

    // 📌 1. journey object ထဲမှာ system id ပါလား သေချာစစ်ရန်
    console.log("Current Journey State to update:", journey);

    const updatedData = {
      ...journey, // Keep existing fields like createdAt, chapters, etc.
      journeyId: journeyIdRef.current.value.trim(),
      title: titleRef.current.value.trim(),
      level: levelRef.current.value,
      iconKey: iconKey,
      color: selectedColor,
      colorBg: `${selectedColor}20`,
      boardImage: boardImage.trim(),
      desc: descRef.current.value.trim(),
    };

    try {
      setIsUpdating(true);

      // 📌 URL ထဲက id အစား MockAPI လိုအပ်သော System ID (`journey.id` = "1") ကို ထည့်သုံးခြင်း
      await updateJourney(journey.id, updatedData);
      showAlert({
        message: `Journey "${updatedData.title}" updated successfully!`,
        type: "success",
      });
      navigate("/admin/learning/journeys");
    } catch (apiErr) {
      console.error("Update failed:", apiErr);

      showAlert({
        message: "Failed to update journey. Please try again.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 📌 Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Edit Journey: {id}</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Modify learning track attributes, theme configuration, and board
            preview.
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
              <span className="text-text font-semibold">Edit</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* 📌 Main Form Card Container */}
      <div className="bg-bg-elevated border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header with Date Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-2">
          <div>
            <h2 className="text-lg font-bold text-text">
              Journey Track Details
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Update core attributes, color configuration, and board preview.
            </p>
          </div>
          <div className="self-start sm:self-auto bg-surface border border-border px-3 py-1.5 rounded-xl text-xs font-mono text-text-muted flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Journey ID: {id}</span>
          </div>
        </div>

        {/* Title and Journey Id (Full Width or Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-text mb-2">
              Journey ID (Slug) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              ref={journeyIdRef}
              key={journey.journeyId ? `title-${journey.journeyId}` : "title"}
              defaultValue={journey.journeyId ?? ""}
              placeholder="e.g. arduino-uno"
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary font-mono transition-colors"
            />
            {errors.journeyId && (
              <span className="text-rose-500 text-[11px] mt-1 block">
                * {errors.journeyId}
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
              key={journey.journeyId ? `title-${journey.journeyId}` : "title"}
              defaultValue={journey.title ?? ""}
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
              key={journey.journeyId ? `level-${journey.journeyId}` : "level"}
              defaultValue={journey.level ?? "Beginner"}
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

          {/* Icon Key Custom Dropdown */}
          <div className="relative">
            <label className="block text-xs font-semibold text-text mb-2">
              Icon Key <span className="text-rose-500">*</span>
            </label>
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

          {/* Advanced Color Picker */}
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

        {/* Board Image URL with Preview */}
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
            key={journey.journeyId ? `desc-${journey.journeyId}` : "desc"}
            defaultValue={journey.desc ?? ""}
            rows="4"
            placeholder="Enter brief description..."
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
            onClick={handleUpdate}
            disabled={isUpdating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
          >
            {isUpdating ? (
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
      </div>
    </div>
  );
};

export default JourneyEdit;
