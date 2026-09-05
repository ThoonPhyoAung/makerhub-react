import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

// icon import
import {
  ArrowLeft,
  Rocket,
  Wrench,
  Minus,
  Plus,
  Trash2,
  Type,
  ImagePlus,
  Code2,
  Download,
  CloudUpload,
  AlertTriangle,
} from "lucide-react";

// project type input options
import { communityCategories } from "../../data/communityCategories";

// api post request
import { createPost } from "../../api/postsApi";

// post type and board type options
const CATEGORY_SHOWCASE = "Project Showcase";
const CATEGORY_HELP = "Help & Troubleshooting";
const boardTagOptions = ["arduino", "esp32", "esp8266", "raspberry-pi"];

// project type options
const pjTypeOptions = communityCategories.filter(
  (c) => c.id !== "all" && c.id !== "help",
);

//   Create Post Form input values as initial state empty
const initialForm = {
  title: "",
  category: "",
  boardTag: "",
  image: "",
  description: "",
  pjType: "",
  hardware: [],
  software: [],
  downloads: [],
  errorSymptom: "",
  triedSolutions: "",
  longDescription: "",
  descriptionBlocks: [], // this is for content page (text + image blocks)
  sourceCode: "",
  sourceCodeLink: "",
};

function CreatePost() {
  // to handle the form data
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // get current user from redux store
  const user = useSelector((state) => state.auth.user);
  const userName = user?.name; // user ရှိရင် name ကိုယူမယ်, null ဆိုရင် undefined
  const userAvatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User",
    )}&background=161b22&color=0d9488&bold=true`;

  //   to handle the input change
  const changeInput = (e) => {
    const { id, value } = e.target; // when input change, get the name and value of the input
    setForm((preData) => ({ ...preData, [id]: value })); // set the form data with the new value, id: value
  };

  //   Derived booleans (isShowcase / isHelp)
  const isShowcase = form.category === CATEGORY_SHOWCASE;
  const isHelp = form.category === CATEGORY_HELP;

  //  [----------hardware input array --------------]

  //   to add a new array item of hardware input
  const addArrayItem = (fieldName, emptyItem) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], emptyItem],
    }));
  };

  //   to update an array item of hardware input
  const updateArrayItem = (fieldName, index, key, value) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  // to remove an array item of hardware input
  const removeArrayItem = (fieldName, index) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  //[--------- Project description block inputs (text + image) --------------]
  const addTextBlock = () =>
    addArrayItem("descriptionBlocks", { type: "text", value: "" });
  const addImageBlock = () =>
    addArrayItem("descriptionBlocks", { type: "image", url: "" });
  const updateBlock = (index, key, value) =>
    updateArrayItem("descriptionBlocks", index, key, value);
  const removeBlock = (index) => removeArrayItem("descriptionBlocks", index);

  //   Form validation
  const validateData = () => {
    const err = {};
    if (!form.title) err.title = "Title is required";
    if (!form.category) err.category = "Post type is required";
    if (!form.boardTag) err.boardTag = "Board/Device is required";
    if (!form.image) err.image = "Cover image is required";
    if (!form.description) err.description = "Short description is required";
    if (isShowcase && !form.pjType) err.pjType = "Project category is required";
    if (isHelp && !form.errorSymptom)
      err.errorSymptom = "Error symptom is required";
    setErrors(err);
    return err;
  };

  //   final form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorObj = validateData();
    if (Object.keys(errorObj).length > 0) return;

    setIsSubmitting(true);

    const payload = {
      ...form,
      pjType: isShowcase ? form.pjType : "",
      hardware: isShowcase ? form.hardware : [],
      software: isShowcase ? form.software : [],
      downloads: isShowcase ? form.downloads : [],
      errorSymptom: isHelp ? form.errorSymptom : "",
      triedSolutions: isHelp ? form.triedSolutions : "",
      authorName: userName,
      avatarUrl: userAvatar,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      await createPost(payload);
      navigate("/community");
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // return
  return (
    <div className="max-w-[800px] mx-auto px-4 py-10 md:py-16">
      {/* form header */}
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-text text-2xl font-bold mb-1">
          <Rocket size={22} className="text-primary" />
          Publish New Post
        </h2>
        <p className="text-text-muted text-sm">
          Share your hardware project, or ask the community for help
          troubleshooting an issue.
        </p>
      </div>

      {/* input form */}
      <form
        onSubmit={handleSubmit}
        className="bg-bg-elevated border border-border rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-5"
      >
        {/* here is author name and profile */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={userAvatar}
            alt={userName}
            className="w-9 h-9 rounded-full object-cover border-2 border-[#0d9488]"
          />
          <span className="text-text font-medium">{userName}</span>
        </div>

        <hr className="border-border-muted" />

        {/* title input */}
        <div>
          <label
            htmlFor="title"
            className="block text-text-muted text-sm font-medium mb-2"
          >
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title ?? ""}
            onChange={changeInput}
            placeholder="e.g., ESP32 Weather Station Node"
            className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
          />
          <span className="text-red-500 text-xs">{errors.title}</span>
        </div>

        {/* post category and board type */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* post category option */}
          <div>
            <label
              htmlFor="category"
              className="block text-text-muted text-sm font-medium mb-2"
            >
              Post Category *
            </label>
            <select
              id="category"
              value={form.category}
              onChange={changeInput}
              className="w-full bg-surface border border-border text-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
            >
              <option value="" disabled>
                Select post type...
              </option>
              <option value={CATEGORY_SHOWCASE}>{CATEGORY_SHOWCASE}</option>
              <option value={CATEGORY_HELP}>{CATEGORY_HELP}</option>
            </select>
            <span className="text-red-500 text-xs">{errors.category}</span>
          </div>

          {/* board type option */}
          <div>
            <label
              htmlFor="boardTag"
              className="block text-text-muted text-sm font-medium mb-2"
            >
              Board Type *
            </label>
            <select
              id="boardTag"
              value={form.boardTag}
              onChange={changeInput}
              className="w-full bg-surface border border-border text-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
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
            <span className="text-red-500 text-xs">{errors.boardTag}</span>
          </div>
        </div>

        {/* cover image input */}
        <div className="space-y-3">
          <label
            htmlFor="image"
            className="block text-text-muted text-sm font-medium"
          >
            Cover Image URL *
          </label>

          {/* Full-Width Cover Image Preview Banner */}
          {form.image?.trim() && (
            <div className="relative w-full rounded-2xl overflow-hidden border border-border bg-bg-subtle aspect-video max-h-[360px] flex items-center justify-center">
              <img
                src={form.image}
                alt="Cover Preview"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Link မှားနေရင် သို့မဟုတ် ပုံမတက်ရင် Preview ခဏဖျောက်ထားမည်
                  e.currentTarget.parentElement.style.display = "none"; // hide the parent container
                }}
                onLoad={(e) => {
                  e.currentTarget.parentElement.style.display = "flex";
                }}
              />
            </div>
          )}

          {/* Input Field */}
          <div>
            <input
              id="image"
              type="url"
              value={form.image}
              onChange={changeInput}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
            />
            {errors.image && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.image}
              </span>
            )}
          </div>
        </div>

        {/* short description input */}
        <div>
          <label
            htmlFor="description"
            className="block text-text-muted text-sm font-medium mb-2"
          >
            Describe your post in one short sentence *
          </label>
          <input
            id="description"
            type="text"
            maxLength={150}
            value={form.description}
            onChange={changeInput}
            placeholder="Briefly introduce your project or issue..."
            className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
          />
          <span className="text-red-500 text-xs">{errors.description}</span>
        </div>

        {/* post type =>  isShowcase / isHelp */}
        {/* isShowcase inputs */}
        {isShowcase && (
          <>
            <hr className="border-border-muted" />

            {/* pjType input options */}
            <div>
              <label
                htmlFor="pjType"
                className="block text-text-muted text-sm font-medium mb-2"
              >
                Project Category *
              </label>
              <select
                id="pjType"
                value={form.pjType}
                onChange={changeInput}
                className="w-full bg-surface border border-border text-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              >
                <option value="" disabled>
                  Select a category...
                </option>
                {pjTypeOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {" "}
                    {/* save value with short name (id is short)  */}
                    {cat.label} {/*  show long label (label is long) */}
                  </option>
                ))}
              </select>
              <span className="text-red-500 text-xs">{errors.pjType}</span>
            </div>

            {/* Devices & Components inputs */}
            <RepeatableSection
              title="Devices & Components (BOM)"
              icon={Wrench}
              items={form.hardware}
              onAdd={() =>
                addArrayItem("hardware", { name: "", quantity: "1", image: "" })
              }
              onRemove={(i) => removeArrayItem("hardware", i)}
              renderFields={(item, i, handleRemove) => {
                const currentQty = parseInt(item.quantity) || 1;

                const handleQtyChange = (newQty) => {
                  if (newQty < 1) return;
                  updateArrayItem("hardware", i, "quantity", newQty.toString());
                };

                return (
                  <div className="bg-surface/60 border border-border-muted p-3.5 rounded-xl flex flex-col md:flex-row md:items-center gap-3 transition-all shadow-xs">
                    {/* ROW 1 (Mobile): [Image] [Name Input] [Qty Stepper] */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {/* Image Preview */}
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-bg-subtle border border-border flex items-center justify-center overflow-hidden text-text-subtle shadow-xs">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || "Preview"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <Wrench size={18} className="text-text-subtle" />
                        )}
                      </div>

                      {/* Name Input */}
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateArrayItem("hardware", i, "name", e.target.value)
                        }
                        placeholder="Component name"
                        className="flex-1 min-w-0 bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all"
                      />

                      {/* Qty Stepper [- 1 +] */}
                      <div className="flex items-center border border-border rounded-xl bg-surface overflow-hidden shrink-0 h-[38px]">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(currentQty - 1)}
                          className="px-2.5 h-full flex items-center justify-center text-text-muted hover:text-text hover:bg-border/40 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-1.5 min-w-[24px] text-center text-xs font-semibold text-text select-none">
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(currentQty + 1)}
                          className="px-2.5 h-full flex items-center justify-center text-text-muted hover:text-text hover:bg-border/40 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* ROW 2 (Mobile): [ Photo Link Input ] */}
                    <input
                      type="url"
                      value={item.image}
                      onChange={(e) =>
                        updateArrayItem("hardware", i, "image", e.target.value)
                      }
                      placeholder="Photo link (optional)"
                      className="w-full md:w-48 shrink-0 bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all"
                    />

                    {/* ROW 3 (Mobile): [ Remove Button ] (Desktop မှာ Box ရဲ့ ညာဘက်အစွန်ထဲ ရောက်ပါမည်) */}
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="w-full md:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 text-xs font-medium transition-all shrink-0"
                    >
                      <Trash2 size={14} />
                      <span className="md:hidden">Remove</span>
                    </button>
                  </div>
                );
              }}
            />

            {/* Software & Tools */}
            <RepeatableSection
              title="Software & Tools"
              icon={Code2}
              items={form.software}
              onAdd={() =>
                addArrayItem("software", { name: "", link: "", image: "" })
              }
              onRemove={(i) => removeArrayItem("software", i)}
              renderFields={(item, i, handleRemove) => (
                <div className="bg-surface/60 border border-border-muted p-3.5 rounded-xl flex flex-col md:flex-row md:items-center gap-3 transition-all shadow-xs">
                  {/* Icon Badge + Tool Name */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-bg-subtle border border-border flex items-center justify-center text-text-subtle">
                      <Code2 size={18} />
                    </div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateArrayItem("software", i, "name", e.target.value)
                      }
                      placeholder="Tool name (e.g., Arduino IDE)"
                      className="flex-1 min-w-0 bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all"
                    />
                  </div>

                  {/* Tool Link */}
                  <input
                    type="url"
                    value={item.link}
                    onChange={(e) =>
                      updateArrayItem("software", i, "link", e.target.value)
                    }
                    placeholder="Link (optional)"
                    className="w-full md:w-52 shrink-0 bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="w-full md:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 text-xs font-medium transition-all shrink-0"
                  >
                    <Trash2 size={14} />
                    <span className="md:hidden">Remove</span>
                  </button>
                </div>
              )}
            />

            {/* Downloadable Files */}
            <RepeatableSection
              title="Downloadable Files"
              icon={Download}
              items={form.downloads}
              onAdd={() => addArrayItem("downloads", { name: "", url: "" })}
              onRemove={(i) => removeArrayItem("downloads", i)}
              renderFields={(item, i, handleRemove) => (
                <div className="bg-surface/60 border border-border-muted p-3.5 rounded-xl flex flex-col md:flex-row md:items-center gap-3 transition-all shadow-xs">
                  {/* Icon Badge + File Name */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-bg-subtle border border-border flex items-center justify-center text-text-subtle">
                      <Download size={18} />
                    </div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateArrayItem("downloads", i, "name", e.target.value)
                      }
                      placeholder="File name (e.g., Firmware v1.2.zip)"
                      className="flex-1 min-w-0 bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all"
                    />
                  </div>

                  {/* Download URL */}
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) =>
                      updateArrayItem("downloads", i, "url", e.target.value)
                    }
                    placeholder="Download URL"
                    className="w-full md:w-52 shrink-0 bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary transition-all"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="w-full md:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 text-xs font-medium transition-all shrink-0"
                  >
                    <Trash2 size={14} />
                    <span className="md:hidden">Remove</span>
                  </button>
                </div>
              )}
            />
          </>
        )}

        {/* isHelp inputs */}
        {isHelp && (
          <>
            <hr className="border-border-muted" />
            <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 flex flex-col gap-4">
              <p className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                <AlertTriangle size={15} /> Troubleshooting Details
              </p>
              <div>
                <label
                  htmlFor="errorSymptom"
                  className="block text-text-muted text-sm font-medium mb-2"
                >
                  Error Symptom *
                </label>
                <input
                  id="errorSymptom"
                  type="text"
                  value={form.errorSymptom}
                  onChange={changeInput}
                  placeholder="e.g., wdt reset / rst cause:4, boot mode:(3,6)"
                  className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 font-mono rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                />
                <span className="text-red-500 text-xs">
                  {errors.errorSymptom}
                </span>
              </div>
              <div>
                <label
                  htmlFor="triedSolutions"
                  className="block text-text-muted text-sm font-medium mb-2"
                >
                  What have you tried? (Optional)
                </label>
                <textarea
                  id="triedSolutions"
                  rows={3}
                  value={form.triedSolutions}
                  onChange={changeInput}
                  placeholder="List what you've already attempted to fix this..."
                  className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-primary transition-all resize-y"
                />
              </div>
            </div>
          </>
        )}

        <hr className="border-border-muted" />

        {/* Full Description (longDescription) input => optional<<<<< */}
        <div>
          <label
            htmlFor="longDescription"
            className="block text-text-muted text-sm font-medium mb-2"
          >
            Full Description (Optional)
          </label>
          <textarea
            id="longDescription"
            rows={4}
            value={form.longDescription}
            onChange={changeInput}
            placeholder="Write a longer explanation as one plain paragraph..."
            className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-primary transition-all resize-y"
          />
        </div>

        {/* Project description block inputs (text + image)*/}
        <div>
          <label className="block text-text-muted text-sm font-medium mb-2">
            {isHelp ? "Describe the Problem" : "Project Description"}
          </label>
          <div className="flex flex-col gap-3">
            {form.descriptionBlocks.map((block, i) => (
              <div key={i} className="flex items-start gap-2">
                {block.type === "text" ? (
                  <textarea
                    rows={3}
                    value={block.value}
                    onChange={(e) => updateBlock(i, "value", e.target.value)}
                    placeholder="Write a paragraph..."
                    className="flex-1 bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-primary transition-all resize-y"
                  />
                ) : (
                  /* Image Block Container */
                  <div className="flex-1 flex flex-col gap-2 bg-surface/50 p-3 rounded-2xl border border-border/60">
                    {/* Dynamic Image Preview */}
                    {block.url?.trim() && (
                      <div className="relative rounded-xl overflow-hidden border border-border bg-bg-subtle max-h-60 flex items-center justify-center p-2">
                        <img
                          src={block.url}
                          alt="Preview"
                          className="max-h-52 w-auto rounded-lg object-contain"
                          onError={(e) => {
                            // URL မှားနေရင် သို့မဟုတ် ပုံမတက်ရင် Preview ခဏဖျောက်ထားပေးမည်
                            e.currentTarget.style.display = "none";
                          }}
                          onLoad={(e) => {
                            e.currentTarget.style.display = "block";
                          }}
                        />
                      </div>
                    )}

                    {/* Input & Remove Button */}
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={block.url}
                        onChange={(e) => updateBlock(i, "url", e.target.value)}
                        placeholder="Image URL..."
                        className="flex-1 bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeBlock(i)}
                  className="shrink-0 p-3 rounded-xl bg-bg-subtle border border-border-muted text-text-subtle hover:text-red-400 hover:border-red-500/30 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addTextBlock}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-bg-subtle border border-border-muted text-text-muted hover:text-primary hover:border-primary transition-colors"
              >
                <Type size={13} /> Add Text
              </button>
              <button
                type="button"
                onClick={addImageBlock}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-bg-subtle border border-border-muted text-text-muted hover:text-primary hover:border-primary transition-colors"
              >
                <ImagePlus size={13} /> Add Image
              </button>
            </div>
          </div>
        </div>

        {/* Code Snippet / GitHub Link (shared) => optional <<<<< */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="sourceCode"
              className="block text-text-muted text-sm font-medium mb-2"
            >
              Code (Optional)
            </label>
            <textarea
              id="sourceCode"
              rows={5}
              value={form.sourceCode}
              onChange={changeInput}
              placeholder={"void setup() {\n  // Code here\n}"}
              className="w-full bg-bg-subtle border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary transition-all resize-y"
            />
          </div>
          <div>
            <label
              htmlFor="sourceCodeLink"
              className="block text-text-muted text-sm font-medium mb-2"
            >
              — or GitHub Link (Optional)
            </label>
            <input
              id="sourceCodeLink"
              type="url"
              value={form.sourceCodeLink}
              onChange={changeInput}
              placeholder="https://github.com/..."
              className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-text font-semibold py-3 rounded-xl border border-primary/50 shadow-sm transition-all duration-200 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:bg-bg-subtle disabled:text-text-subtle disabled:border-border-muted disabled:cursor-not-allowed"
        >
          <CloudUpload size={17} />
          {isSubmitting ? "Publishing..." : "Publish to Community"}
        </button>

        {/* Cancel Button */}
        <Link
          to="/community"
          className="w-full inline-flex items-center justify-center gap-2 bg-surface hover:bg-surface-2 text-text-muted hover:text-text border border-border rounded-xl py-3 font-semibold transition-all duration-200 active:scale-[0.99]"
        >
          <ArrowLeft size={15} /> Cancel & Back
        </Link>
      </form>
    </div>
  );
}

// this component is for repeatable sections to use as a template
function RepeatableSection({
  title,
  icon: Icon,
  items,
  onAdd,
  onRemove,
  renderFields,
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-text font-bold text-sm mb-3">
        <Icon size={15} /> {title}
      </h3>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i}>
            {/* onRemove ကို renderFields ထဲ ပို့*/}
            {renderFields(item, i, () => onRemove(i))}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-bg-subtle border border-border-muted text-text-muted hover:text-primary hover:border-primary transition-colors"
      >
        <Plus size={14} /> Add Item
      </button>
    </div>
  );
}

export default CreatePost;
