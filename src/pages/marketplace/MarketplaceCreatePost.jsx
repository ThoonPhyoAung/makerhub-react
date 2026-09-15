import { useState } from "react";

function MarketplacePostForm() {
  const [form, setForm] = useState({
    title: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-10 md:py-16">
      <h2 className="text-text text-2xl font-bold mb-6">
        List an Item for Sale
      </h2>

      <form className="bg-bg-elevated border border-border rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-5">
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
            className="w-full bg-surface border border-border text-text placeholder:text-text-subtle/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </form>
    </div>
  );
}

export default MarketplacePostForm;
