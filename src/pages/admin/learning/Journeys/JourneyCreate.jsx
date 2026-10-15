import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createJourney } from "../../../../api/journeysApi";

const JourneyCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    level: "Beginner",
    color: "#00878F",
    link: "",
  });
  const [errors, setErrors] = useState({});

  const changeInput = (e) => {
    const { name, value } = e.target;
    setFormData((pre) => ({ ...pre, [name]: value }));
  };

  const validateData = () => {
    const err = {};
    if (!formData.id) err.id = "Journey ID is required";
    if (!formData.title) err.title = "Title is required";
    if (!formData.desc) err.desc = "Description is required";
    setErrors(err);
    return err;
  };

  const handleCreate = async () => {
    const errObj = validateData();
    if (Object.keys(errObj).length > 0) return;

    const newJourney = {
      id: formData.id,
      title: formData.title,
      level: formData.level,
      iconKey: formData.iconKey || "arduino",
      color: formData.color || "#00878F",
      colorBg: `${formData.color || "#00878F"}20`,
      desc: formData.desc,
      boardImage: formData.boardImage || "",
      link: formData.link
        ? formData.link.startsWith("/")
          ? formData.link
          : `/${formData.link}`
        : `/${formData.id}`,
      studentsCount: "0",
      chapters: [],
    };

    try {
      await createJourney(newJourney);
    } catch (err) {
      console.log("API create fallback", err);
    }

    const existing = localStorage.getItem("journeys")
      ? JSON.parse(localStorage.getItem("journeys"))
      : [];
    localStorage.setItem("journeys", JSON.stringify([...existing, newJourney]));

    navigate("/admin/learning/journeys");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm font-medium text-text-muted">
          <li>
            <Link to="/admin/dashboard" className="hover:text-text">
              Dashboard
            </Link>
          </li>
          <li className="text-border">/</li>
          <li>
            <span className="text-text-muted">Learning</span>
          </li>
          <li className="text-border">/</li>
          <li>
            <Link to="/admin/learning/journeys" className="hover:text-text">
              Journeys
            </Link>
          </li>
          <li className="text-border">/</li>
          <li>
            <span className="text-text font-semibold">Create</span>
          </li>
        </ol>
      </nav>

      <div className="p-6 sm:p-8 bg-bg-elevated rounded-2xl border border-border shadow-sm">
        <div className="mb-6 pb-4 border-b border-border">
          <h2 className="text-2xl font-bold text-text">
            Create New Journey Track
          </h2>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Journey ID (Slug) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="id"
                required
                onChange={changeInput}
                placeholder="e.g. arduino-uno"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none font-mono"
              />
              <span className="text-red-500 text-xs">{errors.id ?? ""}</span>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Journey Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                onChange={changeInput}
                placeholder="e.g. Arduino Journey"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none"
              />
              <span className="text-red-500 text-xs">{errors.title ?? ""}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Level
              </label>
              <select
                name="level"
                onChange={changeInput}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Icon Key
              </label>
              <input
                type="text"
                name="iconKey"
                onChange={changeInput}
                placeholder="e.g. arduino"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Theme Color
              </label>
              <input
                type="color"
                name="color"
                defaultValue="#00878F"
                onChange={changeInput}
                className="w-full h-11 rounded-xl border border-border bg-surface p-1 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Board Image URL
              </label>
              <input
                type="text"
                name="boardImage"
                onChange={changeInput}
                placeholder="https://.../arduinouno.png"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Route Link Path
              </label>
              <input
                type="text"
                name="link"
                onChange={changeInput}
                placeholder="e.g. /arduino"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="desc"
              rows="4"
              required
              onChange={changeInput}
              placeholder="Enter journey description..."
              className="w-full rounded-xl border border-border bg-surface p-4 text-sm text-text focus:border-primary focus:outline-none resize-none"
            />
            <span className="text-red-500 text-xs">{errors.desc ?? ""}</span>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            >
              Save Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyCreate;
