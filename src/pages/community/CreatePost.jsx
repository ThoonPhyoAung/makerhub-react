import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Rocket, ArrowLeft, Wrench, CloudUpload } from "lucide-react";
import { communityCategories } from "../../data/communityCategories";

const initialForm = {
  title: "",
  category: "",
  image: "",
  description: "",
  longDescription: "",
  wiringNotes: "",
  sourceCode: "",
  electronics: "",
  hardware: "",
  software: "",
};

// "All categories" ကို form select ထဲ မထည့်ဘူး — post တင်တဲ့အခါ
// category တစ်ခုချင်းစီကိုပဲ ရွေးရမှာမို့ "all" ကို filter ချထားတယ်.
const categoryOptions = communityCategories.filter((c) => c.id !== "all");

function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Original create-post.js ရဲ့ logic အတိုင်း — newline/comma-separated
    // string တွေကို array ပြောင်းထားတယ်.
    const project = {
      title: form.title,
      category: form.category,
      image: form.image,
      description: form.description,
      longDescription: form.longDescription,
      wiringNotes: form.wiringNotes
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      sourceCode: form.sourceCode,
      electronics: form.electronics
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      hardware: form.hardware
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      software: form.software
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    // TODO: Firebase ချိတ်ပြီးရင် Firestore "projects" collection ထဲ
    // addDoc() လုပ်မယ်. အခုတော့ console log ချည်းပဲ.
    console.log("New project:", project);

    // Firestore write ကို simulate လုပ်ဖို့ dummy delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    navigate("/community");
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-10 md:py-16">
      <Link
        to="/community"
        className="inline-flex items-center gap-2 bg-surface border border-border text-text text-sm font-semibold px-4 py-2 rounded-lg mb-6 hover:border-primary hover:text-primary transition-colors"
      >
        <ArrowLeft size={15} /> Cancel & Back
      </Link>

      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-text text-2xl font-bold mb-1">
          <Rocket size={22} className="text-primary" />
          Publish New Project
        </h2>
        <p className="text-text-muted text-sm">
          Share your hardware setup, circuit designs, and source code with the
          maker community.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-bg-elevated border border-border rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-4"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-text-muted text-sm font-medium mb-2"
          >
            Project Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., ESP32 Weather Station Node"
            className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(13,148,136,0.15)] transition-all"
          />
        </div>

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
              required
              value={form.category}
              onChange={handleChange}
              className="w-full bg-surface border border-border text-text rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
            >
              <option value="" disabled>
                Select a category...
              </option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-text-muted text-sm font-medium mb-2"
            >
              Project Cover Image URL *
            </label>
            <input
              id="image"
              type="url"
              required
              value={form.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-text-muted text-sm font-medium mb-2"
          >
            Short Summary * (Max 120 chars)
          </label>
          <input
            id="description"
            type="text"
            required
            maxLength={120}
            value={form.description}
            onChange={handleChange}
            placeholder="Briefly introduce what your project does..."
            className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="longDescription"
            className="block text-text-muted text-sm font-medium mb-2"
          >
            Full Project Details / Tutorial
          </label>
          <textarea
            id="longDescription"
            rows={5}
            value={form.longDescription}
            onChange={handleChange}
            placeholder="Explain the project build process, ideas, and goals..."
            className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-primary transition-all resize-y"
          />
        </div>

        <div>
          <label
            htmlFor="wiringNotes"
            className="block text-text-muted text-sm font-medium mb-2"
          >
            Wiring Connections & Pinouts (One per line)
          </label>
          <textarea
            id="wiringNotes"
            rows={3}
            value={form.wiringNotes}
            onChange={handleChange}
            placeholder={
              "1. Connect DHT22 to GPIO 4\n2. Connect Relay to GPIO 5"
            }
            className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-primary transition-all resize-y"
          />
        </div>

        <div>
          <label
            htmlFor="sourceCode"
            className="block text-text-muted text-sm font-medium mb-2"
          >
            Firmware Source Code (Arduino / MicroPython C++)
          </label>
          <textarea
            id="sourceCode"
            rows={6}
            value={form.sourceCode}
            onChange={handleChange}
            placeholder={"void setup() {\n  // Code here\n}"}
            className="w-full bg-bg-subtle border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary transition-all resize-y"
          />
        </div>

        <hr className="border-border-muted" />

        <div>
          <h3 className="flex items-center gap-2 text-text font-bold mb-1">
            <Wrench size={16} /> Bill of Materials (BOM)
          </h3>
          <p className="text-text-subtle text-xs mb-3">
            Enter components separated by commas (,)
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="electronics"
                className="block text-text-muted text-sm font-medium mb-2"
              >
                Electronics Modules (e.g., ESP32, DHT22, OLED Screen)
              </label>
              <input
                id="electronics"
                type="text"
                value={form.electronics}
                onChange={handleChange}
                placeholder="Component A, Component B, Component C"
                className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="hardware"
                className="block text-text-muted text-sm font-medium mb-2"
              >
                Hardware & Enclosures (e.g., 3D Case, Acrylic Frame, M3 Screws)
              </label>
              <input
                id="hardware"
                type="text"
                value={form.hardware}
                onChange={handleChange}
                placeholder="Frame Alpha, Box Beta"
                className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="software"
                className="block text-text-muted text-sm font-medium mb-2"
              >
                Libraries & Softwares (e.g., FastLED Library, Arduino IDE)
              </label>
              <input
                id="software"
                type="text"
                value={form.software}
                onChange={handleChange}
                placeholder="Library X, Tool Y"
                className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl border border-primary shadow-sm hover:bg-transparent hover:text-primary transition-all disabled:bg-bg-subtle disabled:text-text-subtle disabled:border-border-muted disabled:cursor-not-allowed"
        >
          <CloudUpload size={17} />
          {isSubmitting ? "Publishing..." : "Publish to Community"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
