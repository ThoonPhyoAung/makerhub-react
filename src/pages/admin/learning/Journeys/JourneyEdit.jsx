import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getJourneyById, updateJourney } from "../../../../api/journeysApi";

const JourneyEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editJourney, setEditJourney] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getJourneyById(id);
        setEditJourney(data);
      } catch (err) {
        console.log("API fetch detail fallback", err);
        const localData = localStorage.getItem("journeys")
          ? JSON.parse(localStorage.getItem("journeys"))
          : [];
        const found = localData.find((item) => item.id === id);
        setEditJourney(found || {});
      }
    };
    fetchDetail();
  }, [id]);

  const changeInput = (e) => {
    const { name, value } = e.target;
    setEditJourney((pre) => ({ ...pre, [name]: value }));
  };

  const validateData = () => {
    const err = {};
    if (!editJourney.title) err.title = "Title is required";
    if (!editJourney.desc && !editJourney.description)
      err.desc = "Description is required";
    setErrors(err);
    return err;
  };

  const handleUpdate = async () => {
    const errObj = validateData();
    if (Object.keys(errObj).length > 0) return;

    try {
      await updateJourney(id, editJourney);
    } catch (err) {
      console.log("API update fallback", err);
    }

    const localData = localStorage.getItem("journeys")
      ? JSON.parse(localStorage.getItem("journeys"))
      : [];
    const updatedList = localData.map((item) =>
      item.id === id ? editJourney : item,
    );
    localStorage.setItem("journeys", JSON.stringify(updatedList));

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
            <span className="text-text font-semibold">Edit</span>
          </li>
        </ol>
      </nav>

      <div className="p-6 sm:p-8 bg-bg-elevated rounded-2xl border border-border shadow-sm">
        <div className="mb-6 pb-4 border-b border-border">
          <h2 className="text-2xl font-bold text-text">
            Edit Journey Track: {editJourney.id}
          </h2>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Journey Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={editJourney.title ?? ""}
                required
                onChange={changeInput}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none"
              />
              <span className="text-red-500 text-xs">{errors.title ?? ""}</span>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Level
              </label>
              <select
                name="level"
                value={editJourney.level ?? "Beginner"}
                onChange={changeInput}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Icon Key
              </label>
              <input
                type="text"
                name="iconKey"
                value={editJourney.iconKey ?? ""}
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
                value={editJourney.color ?? "#00878F"}
                onChange={changeInput}
                className="w-full h-11 rounded-xl border border-border bg-surface p-1 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Route Link Path
              </label>
              <input
                type="text"
                name="link"
                value={editJourney.link ?? ""}
                onChange={changeInput}
                placeholder="e.g. /arduino"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Board Image URL
            </label>
            <input
              type="text"
              name="boardImage"
              value={editJourney.boardImage ?? ""}
              onChange={changeInput}
              placeholder="https://.../arduinouno.png"
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none font-mono"
            />
            {editJourney?.boardImage && (
              <div className="mt-3 w-32 h-28 rounded-xl bg-surface border border-border p-1 overflow-hidden flex items-center justify-center">
                <img
                  src={editJourney.boardImage}
                  className="w-full h-full object-contain"
                  alt="Board Preview"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="desc"
              rows="4"
              value={editJourney.desc ?? editJourney.description ?? ""}
              required
              onChange={changeInput}
              className="w-full rounded-xl border border-border bg-surface p-4 text-sm text-text focus:border-primary focus:outline-none resize-none"
            />
            <span className="text-red-500 text-xs">{errors.desc ?? ""}</span>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleUpdate}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            >
              Update Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyEdit;
