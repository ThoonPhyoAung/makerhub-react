import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

// icon imports
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
  Save,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// project type input options
import { communityCategories } from "../../data/communityCategories";

// api requests
import { getPostById, updatePost, deletePost } from "../../api/postsApi";

// show alert
import { useAlert } from "../../context/AlertContext";

// custom hooks
import { useFetch } from "../../hooks/useFetch";

// post type and board type options
const CATEGORY_SHOWCASE = "Project Showcase";
const CATEGORY_HELP = "Help & Troubleshooting";
const boardTagOptions = ["arduino", "esp32", "esp8266", "raspberry-pi"];

// project type options
const pjTypeOptions = communityCategories.filter(
  (c) => c.id !== "all" && c.id !== "help",
);

// Base64 validation helper
const isBase64DataUrl = (value) => {
  return typeof value === "string" && value.startsWith("data:");
};

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showAlert = useAlert();

  // Get current active user
  const activeUser = useSelector((state) => state.auth.user);

  // Fetch post data by ID
  const fetchFn = useCallback(() => getPostById(id), [id]);
  const { data: editPostData, loading, error } = useFetch(fetchFn, [fetchFn]);

  // Form ထဲမှာပါမယ့် Data အားလုံးကို Object အဖြစ် သတ်မှတ်လိုက်တယ်
  const [form, setForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Sync state when fetched data arrives
  useEffect(() => {
    if (editPostData && activeUser) {
      if (editPostData.authorId !== activeUser.id) {
        showAlert("You do not have permission to edit this post.");
        navigate("/community");
        return;
      }
      setForm({
        title: editPostData.title || "",
        category: editPostData.category || "",
        boardTag: editPostData.boardTag || "",
        image: editPostData.image || "",
        description: editPostData.description || "",
        pjType: editPostData.pjType || "",
        hardware: editPostData.hardware || [],
        software: editPostData.software || [],
        downloads: editPostData.downloads || [],
        errorSymptom: editPostData.errorSymptom || "",
        triedSolutions: editPostData.triedSolutions || "",
        longDescription: editPostData.longDescription || "",
        descriptionBlocks: editPostData.descriptionBlocks || [],
        sourceCode: editPostData.sourceCode || "",
        sourceCodeLink: editPostData.sourceCodeLink || "",
      });
    }
  }, [editPostData, activeUser, navigate, showAlert]);

  if (loading) {
    return (
      <div className="text-center py-24">
        <Loader2 size={32} className="mx-auto text-primary animate-spin mb-3" />
        <p className="text-text-muted">Loading post details for editing...</p>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="text-center py-24 text-red-400">
        <p>Failed to load post for editing: {error || "Post not found"}</p>
        <Link
          to="/community"
          className="text-primary font-semibold mt-4 inline-block"
        >
          ← Back to Community
        </Link>
      </div>
    );
  }

  // Handle single input changes
  const changeInput = (e) => {
    const { id, value } = e.target;

    if (id === "image" && isBase64DataUrl(value)) {
      showAlert(
        "ကျေးဇူးပြု၍ image file ကို paste မလုပ်ပါနှင့်၊ hosted image URL (https://...) ကိုသာ ထည့်ပါ။",
      );
      return;
    }

    setForm((prev) => ({ ...prev, [id]: value }));
  };

  // Derived booleans (isShowcase / isHelp)
  const isShowcase = form.category === CATEGORY_SHOWCASE;
  const isHelp = form.category === CATEGORY_HELP;

  //  [----------hardware input array --------------]

  const addArrayItem = (fieldName, emptyItem) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], emptyItem],
    }));
  };

  const updateArrayItem = (fieldName, index, key, value) => {
    const urlLikeKeys = ["image", "link", "url"];
    if (urlLikeKeys.includes(key) && isBase64DataUrl(value)) {
      showAlert(
        "ကျေးဇူးပြု၍ image file ကို paste မလုပ်ပါနှင့်၊ hosted image URL (https://...) ကိုသာ ထည့်ပါ။",
      );
      return;
    }

    setForm((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

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

  // Form Validation
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

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorObj = validateData();
    if (Object.keys(errorObj).length > 0) return;

    setIsSubmitting(true);

    const payload = {
      ...editPostData,
      ...form,
      pjType: isShowcase ? form.pjType : "",
      hardware: isShowcase ? form.hardware : [],
      software: isShowcase ? form.software : [],
      downloads: isShowcase ? form.downloads : [],
      errorSymptom: isHelp ? form.errorSymptom : "",
      triedSolutions: isHelp ? form.triedSolutions : "",
      updatedAt: new Date().toISOString(),
    };

    try {
      await updatePost(id, payload);

      showAlert("Post updated successfully!");
      navigate(`/community/project/${id}`);
    } catch (err) {
      console.error("Failed to update post:", err);
      showAlert("Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel Handler
  const handleCancel = () => {
    const hasContent = form.title || form.description || form.image;

    if (hasContent) {
      showAlert({
        message: "Unsaved changes will be lost. Leave this page?",
        actionText: "Leave",
        type: "warning",
        duration: 0, // ★ auto-dismiss ပိတ် — user click လုပ်မှသာ ပိတ်မယ်
        onAction: () => {
          navigate(`/community/project/${id}`);
        },
      });
    } else {
      navigate(`/community/project/${id}`);
    }
  };

  // Delete Handler
  const handleDeletePost = (e) => {
    e.preventDefault();

    showAlert({
      message:
        "Are you sure you want to delete this post? This action cannot be undone.",
      actionText: "Delete",
      type: "warning",
      duration: 0, // ★ delete လို destructive action ဆို ပိုအရေးကြီးတယ်
      onAction: async () => {
        try {
          await deletePost(id);

          showAlert("Post deleted Successfully !");
          navigate("/community");
        } catch (error) {
          console.error("Failed to delete post:", error);
          showAlert("Failed to delete post. Please try again.");
        }
      },
    });
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-10 md:py-16">
      {/* Header */}
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-text text-2xl font-bold mb-1">
          <Rocket size={22} className="text-primary" />
          Edit Post
        </h2>
        <p className="text-text-muted text-sm">
          Update details for your post details or troubleshooting progress.
        </p>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-bg-elevated border border-border rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-5"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-text-muted text-sm font-medium mb-2"
          >
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={changeInput}
            className="w-full bg-surface border border-border text-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
          />
          <span className="text-red-500 text-xs">{errors.title}</span>
        </div>

        {/* Category & Board */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-text-muted text-sm font-medium mb-2"
            >
              Post Type *
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

        {/* Cover Image */}
        <div className="space-y-3">
          <label
            htmlFor="image"
            className="block text-text-muted text-sm font-medium"
          >
            Cover Image URL *
          </label>
          {form.image?.trim() && (
            <div className="relative w-full rounded-2xl overflow-hidden border border-border bg-bg-subtle aspect-video max-h-[360px] flex items-center justify-center">
              <img
                src={form.image}
                alt="Cover Preview"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.parentElement.style.display = "none";
                }}
                onLoad={(e) => {
                  e.currentTarget.parentElement.style.display = "flex";
                }}
              />
            </div>
          )}
          <input
            id="image"
            type="url"
            value={form.image}
            onChange={changeInput}
            className="w-full bg-surface border border-border text-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
          />
          {errors.image && (
            <span className="text-red-500 text-xs">{errors.image}</span>
          )}
        </div>

        {/* Short Description */}
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
            className="w-full bg-surface border border-border text-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
          />
          <span className="text-red-500 text-xs">{errors.description}</span>
        </div>

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
                    {cat.label}
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

                return (
                  <div className="bg-surface/60 border border-border-muted p-3.5 rounded-xl flex flex-col md:flex-row md:items-center gap-3">
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

                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateArrayItem("hardware", i, "name", e.target.value)
                        }
                        placeholder="Component name"
                        className="flex-1 min-w-0 bg-surface border border-border text-text rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />

                      <div className="flex items-center border border-border rounded-xl bg-surface h-[38px]">
                        <button
                          type="button"
                          onClick={() =>
                            currentQty > 1 &&
                            updateArrayItem(
                              "hardware",
                              i,
                              "quantity",
                              (currentQty - 1).toString(),
                            )
                          }
                          className="px-2.5 h-full text-text-muted hover:text-text"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-1.5 text-xs font-semibold text-text">
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateArrayItem(
                              "hardware",
                              i,
                              "quantity",
                              (currentQty + 1).toString(),
                            )
                          }
                          className="px-2.5 h-full text-text-muted hover:text-text"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <input
                      type="url"
                      value={item.image}
                      onChange={(e) =>
                        updateArrayItem("hardware", i, "image", e.target.value)
                      }
                      placeholder="Photo link (optional)"
                      className="w-full md:w-48 bg-surface border border-border text-text rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />

                    <button
                      type="button"
                      onClick={handleRemove}
                      className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 size={14} />
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
                <div className="bg-surface/60 border border-border-muted p-3.5 rounded-xl flex flex-col md:flex-row md:items-center gap-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      updateArrayItem("software", i, "name", e.target.value)
                    }
                    placeholder="Tool name (e.g., Arduino IDE)"
                    className="flex-1 bg-surface border border-border text-text rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />

                  <input
                    type="url"
                    value={item.link}
                    onChange={(e) =>
                      updateArrayItem("software", i, "link", e.target.value)
                    }
                    placeholder="Link (optional)"
                    className="w-full md:w-52 bg-surface border border-border text-text rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />

                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            />

            {/* Downloads */}
            <RepeatableSection
              title="Downloadable Files"
              icon={Download}
              items={form.downloads}
              onAdd={() => addArrayItem("downloads", { name: "", url: "" })}
              onRemove={(i) => removeArrayItem("downloads", i)}
              renderFields={(item, i, handleRemove) => (
                <div className="bg-surface/60 border border-border-muted p-3.5 rounded-xl flex flex-col md:flex-row md:items-center gap-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      updateArrayItem("downloads", i, "name", e.target.value)
                    }
                    placeholder="File name"
                    className="flex-1 bg-surface border border-border text-text rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />

                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) =>
                      updateArrayItem("downloads", i, "url", e.target.value)
                    }
                    placeholder="Download URL"
                    className="w-full md:w-52 bg-surface border border-border text-text rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />

                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            />
          </>
        )}

        {/* Troubleshooting Options */}
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
                  className="w-full bg-surface border border-border text-text font-mono rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
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
                  className="w-full bg-surface border border-border text-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-y"
                />
              </div>
            </div>
          </>
        )}

        <hr className="border-border-muted" />

        {/* Full Long Description */}
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
            className="w-full bg-surface border border-border text-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-y"
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
                  <div className="flex-1 flex flex-col gap-2 bg-surface/50 p-3 rounded-2xl border border-border/60">
                    {block.url?.trim() && (
                      <div className="relative rounded-xl overflow-hidden border border-border bg-bg-subtle max-h-60 flex items-center justify-center p-2">
                        <img
                          src={block.url}
                          alt="Preview"
                          className="max-h-52 w-auto rounded-lg object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          onLoad={(e) => {
                            e.currentTarget.style.display = "block";
                          }}
                        />
                      </div>
                    )}

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

        {/* Code Snippet / GitHub Link */}
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
              className="w-full bg-bg-subtle border border-border text-text rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary resize-y"
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
              className="w-full bg-surface border border-border text-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* EditPost.jsx Bottom Action Area */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-text font-semibold py-3 rounded-xl transition-all"
            >
              {isSubmitting ? "Updating..." : "Update Post"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-surface border border-border bg-surface hover:bg-surface-2 text-text-muted rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-red-400">
                Delete this post
              </p>
              <p className="text-xs text-text-muted">
                Once deleted, it cannot be recovered.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDeletePost}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition-all"
            >
              Delete Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

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
          <div key={i}>{renderFields(item, i, () => onRemove(i))}</div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-bg-subtle border border-border-muted text-text-muted hover:text-primary transition-colors"
      >
        <Plus size={14} /> Add Item
      </button>
    </div>
  );
}

export default EditPost;
