import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
  Filter,
  X,
  Clock,
  HelpCircle,
  Award,
} from "lucide-react";
import { useFetch } from "../../../../hooks/useFetch";
import { getLessons, deleteLesson } from "../../../../api/lessonsApi";
import { getJourneys } from "../../../../api/journeysApi";
import { useAlert } from "../../../../context/AlertContext";
import { boardIconMap, RenderIcon } from "../../../../utils/iconMaps";

const LessonsIndex = () => {
  const showAlert = useAlert();
  const [searchTerm, setSearchTerm] = useState("");

  // for filter
  const [selectedJourney, setSelectedJourney] = useState("All");
  const [selectedChapter, setSelectedChapter] = useState("All");
  const [currentLang, setCurrentLang] = useState("en"); //Language Toggle State (en | mm)

  // Fetch Lessons & Journeys from APIs
  const { data: lessonsData, loading, error, refetch } = useFetch(getLessons);
  const { data: journeysData } = useFetch(getJourneys);

  const lessons = Array.isArray(lessonsData) ? lessonsData : [];
  const journeys = Array.isArray(journeysData) ? journeysData : [];

  // 🛡️ 100% Safe String Converter Helper
  const renderSafeText = (val, lang = "en") => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      const text = val[lang] || val.en || val.mm;
      if (typeof text === "string") return text;
      // ကျန်တဲ့အခြေအနေများအတွက် JSON သို့မဟုတ် ပထမဆုံးတွေ့တဲ့ String value ကို ရှာထုတ်မည်
      const firstStringVal = Object.values(val).find(
        (v) => typeof v === "string",
      );
      return firstStringVal || "";
    }
    return String(val);
  };

  // 📌 1. Journey အလိုက် Chapter များကို ဇကာတင် ဆွဲထုတ်ပေးမည့် Logic (Cascading Chapters)
  const availableChapters = useMemo(() => {
    if (!Array.isArray(journeys)) return [];
    if (selectedJourney === "All") {
      let allChapters = [];
      journeys.forEach((j) => {
        if (Array.isArray(j.chapters)) {
          j.chapters.forEach((ch) => {
            allChapters.push({
              ...ch,
              uniqueKey: ch.id || ch.chapterId,
              journeyId: j.journeyId || j.id,
            });
          });
        }
      });
      return allChapters;
    } else {
      const journey = journeys.find(
        (j) =>
          String(j.id || "").trim() === String(selectedJourney).trim() ||
          String(j.journeyId || "").trim() === String(selectedJourney).trim(),
      );
      if (!journey || !Array.isArray(journey.chapters)) return [];
      return journey.chapters.map((ch) => ({
        ...ch,
        uniqueKey: ch.id || ch.chapterId,
        journeyId: journey.journeyId || journey.id,
      }));
    }
  }, [journeys, selectedJourney]);

  // 📌 2. Search, Journey & Chapter Filtering Logic
  const filteredLessons = useMemo(() => {
    return lessons.filter((item) => {
      const query = searchTerm.toLowerCase();

      const titleEn = renderSafeText(item.title, "en").toLowerCase();
      const titleMm = renderSafeText(item.title, "mm").toLowerCase();
      const descEn = renderSafeText(
        item.description || item.desc,
        "en",
      ).toLowerCase();
      const descMm = renderSafeText(
        item.description || item.desc,
        "mm",
      ).toLowerCase();

      const matchesSearch =
        titleEn.includes(query) ||
        titleMm.includes(query) ||
        descEn.includes(query) ||
        descMm.includes(query) ||
        String(item.journeyId || "")
          .toLowerCase()
          .includes(query) ||
        String(item.chapterId || "")
          .toLowerCase()
          .includes(query);

      const matchesJourney =
        selectedJourney === "All" ||
        String(item.journeyId || "")
          .trim()
          .toLowerCase() === String(selectedJourney).trim().toLowerCase();

      const matchesChapter =
        selectedChapter === "All" ||
        String(item.chapterId || "")
          .trim()
          .toLowerCase() === String(selectedChapter).trim().toLowerCase();

      return matchesSearch && matchesJourney && matchesChapter;
    });
  }, [lessons, searchTerm, selectedJourney, selectedChapter]);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currentLessons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLessons.slice(startIndex, endIndex);
  }, [filteredLessons, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleJourneyChange = (e) => {
    setSelectedJourney(e.target.value);
    setSelectedChapter("All");
    setCurrentPage(1);
  };

  const handleChapterChange = (e) => {
    setSelectedChapter(e.target.value);
    setCurrentPage(1);
  };

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  const handleDeleteClick = (lesson) => {
    setLessonToDelete(lesson);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!lessonToDelete) return;

    try {
      await deleteLesson(lessonToDelete.id);
      refetch();
      setIsDeleteModalOpen(false);
      setLessonToDelete(null);
      showAlert({ message: "Lesson deleted successfully!", type: "success" });
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      showAlert({
        message: "Failed to delete this lesson. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Lessons Management</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Manage learning modules, contents, and curriculum sequencing.
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
              <span className="text-text font-semibold">Lessons</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-wrap">
          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search lessons by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-bg-elevated border border-border rounded-xl pl-10 pr-10 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-text-muted shrink-0" />
            <select
              value={selectedJourney}
              onChange={handleJourneyChange}
              className="bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors w-full sm:w-48"
            >
              <option value="All">All Journeys</option>
              {journeys.map((journey) => {
                const jValue = journey.journeyId || journey.id;
                return (
                  <option key={jValue} value={jValue}>
                    {renderSafeText(journey.title, currentLang)}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedChapter}
              onChange={handleChapterChange}
              className="bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors w-full sm:w-48"
            >
              <option value="All">All Chapters</option>
              {availableChapters.map((chap) => {
                const chapTitle = renderSafeText(chap.title, currentLang);
                const chapValue = chap.id || chap.chapterId;
                return (
                  <option key={chapValue} value={chapValue}>
                    {chapTitle}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <div className="flex items-center bg-bg-elevated border border-border rounded-xl p-1">
            <button
              onClick={() => setCurrentLang("en")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentLang === "en"
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              🇬🇧 EN
            </button>
            <button
              onClick={() => setCurrentLang("mm")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentLang === "mm"
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              🇲🇲 MM
            </button>
          </div>

          <Link
            to="/admin/learning/lessons/create"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all w-full sm:w-auto justify-center"
          >
            <Plus size={16} /> Add New Lesson
          </Link>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 text-text-muted text-sm">
          <Loader2
            size={32}
            className="mx-auto text-primary animate-spin mb-3"
          />
          Loading lessons data...
        </div>
      )}
      {error && (
        <div className="text-center py-16 text-red-400 text-sm">
          Failed to load API data.
        </div>
      )}

      {/* Lessons Table UI */}
      {!loading && !error && (
        <div className="bg-bg-elevated border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/50 text-text-muted text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Lesson / Title</th>
                  <th className="py-3.5 px-4 font-semibold">
                    Journey & Chapter
                  </th>
                  <th className="py-3.5 px-4 font-semibold">Duration</th>
                  <th className="py-3.5 px-4 font-semibold">Questions / XP</th>
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text">
                {currentLessons.length > 0 ? (
                  currentLessons.map((lesson, idx) => {
                    const title = renderSafeText(lesson.title, currentLang);
                    const desc = renderSafeText(
                      lesson.description || lesson.desc,
                      currentLang,
                    );

                    const journey = journeys.find(
                      (j) =>
                        String(j.id || "").trim() ===
                          String(lesson.journeyId || "").trim() ||
                        String(j.journeyId || "").trim() ===
                          String(lesson.journeyId || "").trim(),
                    );
                    const journeyColor = journey?.color || "#00878F";
                    const journeyColorBg =
                      journey?.colorBg || `${journeyColor}15`;
                    const journeyIconKey = String(
                      journey?.iconKey || lesson.iconKey || "code",
                    )
                      .toLowerCase()
                      .trim();
                    const journeyTitle = renderSafeText(
                      journey?.title || lesson.journeyId,
                      currentLang,
                    );

                    let foundChapterTitle = lesson.chapterId;
                    if (journey && Array.isArray(journey.chapters)) {
                      const matchChap = journey.chapters.find(
                        (ch) =>
                          String(ch.id || "").trim() ===
                            String(lesson.chapterId || "").trim() ||
                          String(ch.chapterId || "").trim() ===
                            String(lesson.chapterId || "").trim(),
                      );
                      if (matchChap) {
                        foundChapterTitle = renderSafeText(
                          matchChap.title,
                          currentLang,
                        );
                      }
                    }

                    const questionsList = Array.isArray(lesson.questions)
                      ? lesson.questions
                      : [];
                    const totalQuestions = questionsList.length;
                    const totalXp = questionsList.reduce(
                      (acc, q) => acc + (Number(q.xp) || 0),
                      0,
                    );

                    return (
                      <tr
                        key={lesson.id || idx}
                        className="hover:bg-surface/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-4">
                            {lesson.coverImage &&
                            lesson.coverImage.trim() !== "" ? (
                              <div className="relative w-24 h-14 rounded-xl overflow-hidden bg-surface border border-border shrink-0 flex items-center justify-center group shadow-sm">
                                <img
                                  src={lesson.coverImage}
                                  alt={title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                <div
                                  className="absolute bottom-1 right-1 w-6 h-6 rounded-lg flex items-center justify-center shadow-md border border-white/10 text-xs backdrop-blur-md"
                                  style={{
                                    backgroundColor: journeyColor,
                                    color: "#ffffff",
                                  }}
                                  title={`Journey Icon: ${journeyIconKey}`}
                                >
                                  <RenderIcon
                                    iconKey={journeyIconKey}
                                    map={boardIconMap}
                                    size={13}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border border-border shadow-sm"
                                style={{
                                  backgroundColor: journeyColorBg,
                                  color: journeyColor,
                                }}
                              >
                                <RenderIcon
                                  iconKey={journeyIconKey}
                                  map={boardIconMap}
                                  size={24}
                                />
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">
                                  #{lesson.order || idx + 1}
                                </span>
                                <h4 className="font-bold text-text text-sm">
                                  {title}
                                </h4>
                              </div>
                              <p className="text-xs text-text-muted line-clamp-1 mt-1">
                                {desc}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-xs">
                          <div className="space-y-1">
                            <span
                              className="inline-block px-2 py-0.5 rounded font-medium uppercase text-[10px]"
                              style={{
                                backgroundColor: journeyColorBg,
                                color: journeyColor,
                              }}
                            >
                              {journeyTitle}
                            </span>
                            <div className="text-text-muted font-medium truncate max-w-xs">
                              Chap:{" "}
                              <span className="text-text">
                                {foundChapterTitle}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-xs">
                          <div className="flex items-center gap-1.5 text-text-muted">
                            <Clock size={14} className="text-primary" />
                            <span className="font-medium text-text">
                              {lesson.durationMin
                                ? `${lesson.durationMin} mins`
                                : "10 mins"}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                              <HelpCircle
                                size={14}
                                className="text-amber-400"
                              />
                              <span>{totalQuestions} Qs</span>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                              <Award size={14} />
                              <span>{totalXp} XP</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/learning/lessons/edit/${lesson.id}`}
                              className="p-2 rounded-xl bg-surface border border-border text-text-muted hover:text-text transition-colors"
                              title="Edit Lesson"
                            >
                              <Edit3 size={15} />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(lesson)}
                              className="p-2 rounded-xl bg-surface border border-border text-red-500 hover:bg-red-500/10 transition-colors"
                              title="Delete Lesson"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-12 text-center text-text-muted text-sm"
                    >
                      No lessons found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <nav className="flex items-center gap-x-1" aria-label="Pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-text hover:bg-bg-hover disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <svg
                className="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <div className="flex items-center gap-x-1">
              <span className="min-h-[38px] min-w-[38px] flex justify-center items-center bg-primary text-white py-2 px-3 text-sm rounded-lg font-semibold shadow-sm shadow-primary/20">
                {currentPage}
              </span>
              <span className="min-h-[38px] flex justify-center items-center text-text-muted py-2 px-1.5 text-sm">
                of
              </span>
              <span className="min-h-[38px] min-w-[38px] flex justify-center items-center border border-border text-text py-2 px-3 text-sm rounded-lg bg-bg-card">
                {totalPages}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-text hover:bg-bg-hover disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <svg
                className="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18l6-6-6-6" />
              </svg>
            </button>
          </nav>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-bg-elevated border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-text">
                  Confirm Deletion
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Are you sure you want to delete lesson{" "}
                  <strong className="text-text">
                    {renderSafeText(lessonToDelete?.title, currentLang)}
                  </strong>
                  ?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border bg-surface text-text text-xs font-semibold hover:bg-surface-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsIndex;
