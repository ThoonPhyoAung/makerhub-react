import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Rocket, Trash2, CloudUpload, Loader2 } from "lucide-react";
import { getPostById, updatePost, deletePost } from "../../api/postsApi";

// initialForm, CATEGORY_SHOWCASE စတာတွေ CreatePost.jsx ထဲက အတိုင်း
// (shared constants file, ဥပမာ communityFormConstants.js ခွဲထုတ်ထားရင် ပိုသန့်ပါမယ်)

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null); // null = ဒေတာမရသေးဘူး
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  // blog Edit.jsx ရဲ့ getBlogDetail() pattern အတိုင်း — plain useEffect,
  // useFetch ကို ဒီနေရာမှာ ပြန်မသုံးဘူး (id ပါတဲ့ parameterized fetch
  // ဖြစ်လို့ dependency array ထဲ id ကို တိုက်ရိုက်ထည့်ရတယ်)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setForm(data);
      } catch (err) {
        console.error("Failed to load post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const isShowcase = form?.category === "Project Showcase";
  const isHelp = form?.category === "Help & Troubleshooting";

  const handleChange = (e) => {
    const { id: fieldId, value } = e.target;
    setForm((prev) => ({ ...prev, [fieldId]: value }));
  };

  const validateData = () => {
    const err = {};
    if (!form.title) err.title = "Title is required";
    if (!form.description) err.description = "Short summary is required";
    setErrors(err);
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorObj = validateData();
    if (Object.keys(errorObj).length > 0) return;

    setIsSubmitting(true);
    try {
      await updatePost(id, form);
      navigate("/community");
    } catch (err) {
      console.error("Failed to update post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("This post ကို အပြီးတိုင် ဖျက်မှာ သေချာလား?")) return;
    setIsDeleting(true);
    try {
      await deletePost(id);
      navigate("/community");
    } catch (err) {
      console.error("Failed to delete post:", err);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader2 size={32} className="mx-auto text-primary animate-spin mb-3" />
        <p className="text-text-muted">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-10 md:py-16">
      <Link
        to="/community"
        className="inline-flex items-center gap-2 bg-surface border border-border text-text text-sm font-semibold px-4 py-2 rounded-lg mb-6 hover:border-primary hover:text-primary transition-colors"
      >
        <ArrowLeft size={15} /> Cancel & Back
      </Link>

      <h2 className="flex items-center gap-2 text-text text-2xl font-bold mb-6">
        <Rocket size={22} className="text-primary" /> Edit Post
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-bg-elevated border border-border rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-5"
      >
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
            onChange={handleChange}
            className="w-full bg-surface border border-border text-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
          />
          <span className="text-red-500 text-xs">{errors.title}</span>
        </div>

        {/* ... ကျန် field တွေ (image, description, category-conditional
            sections) — CreatePost.jsx ထဲက JSX ကို copy ပြီး form.xxx ကို
            တိုက်ရိုက် ဖတ်ရုံပါပဲ (already pre-filled ဖြစ်နေလို့) */}

        <div className="flex flex-col md:flex-row gap-3 mt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl border border-primary shadow-sm hover:bg-transparent hover:text-primary transition-all disabled:bg-bg-subtle disabled:text-text-subtle disabled:cursor-not-allowed"
          >
            <CloudUpload size={17} />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 bg-transparent text-red-400 font-semibold py-3 px-6 rounded-xl border border-red-500/30 hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;
