import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Compass,
  Loader2,
  AlertTriangle,
  Filter,
  X,
  BookOpen,
  Clock,
} from "lucide-react";
import { useFetch } from "../../../../hooks/useFetch";
import { getJourneys, updateJourney } from "../../../../api/journeysApi";
import { getLessons } from "../../../../api/lessonsApi";
import { useAlert } from "../../../../context/AlertContext";
import { boardIconMap, RenderIcon } from "../../../../utils/iconMaps";

const ChaptersIndex = () => {
  const showAlert = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentLang, setCurrentLang] = useState("en"); // 📌 Language Toggle State (en | mm)
  const [selectedJourney, setSelectedJourney] = useState("All");

  const { data: journeysData, loading, error, refetch } = useFetch(getJourneys);
  const journeys = Array.isArray(journeysData) ? journeysData : [];

  // Lesson API မှ ဒေတာများကို လှမ်းခေါ်ခြင်း
  const { data: lessonsData } = useFetch(getLessons);
  const lessons = Array.isArray(lessonsData) ? lessonsData : [];

  //   chapters > useMemo is a place stored data able to reuse , if anything changes on [journeys] api data , if change will update data. This can save performace and call again and again
  const allChapters = useMemo(() => {
    let chapterlist = [];
    journeys.forEach((journey) => {
      if (Array.isArray(journey.chapters)) {
        journey.chapters.forEach((ch, index) => {
          chapterlist.push({
            ...ch,
            journeyId: journey?.journeyId,
            journeyTitle: journey?.title,
            journeyColor: journey?.color || "#00878F",
            journeyColorBg:
              journey?.colorBg || `${journey?.color || "#00878F"}15`,
            iconKey: ch?.iconKey || journey?.iconKey || "code",
            systemId: journey?.id,
            chapterIndex: index,
          });
        });
      }
    });
    return chapterlist;
  }, [journeys]);

  //Search & Filtering Logic by title, desc, journey name
  const filteredChapters = useMemo(() => {
    return allChapters.filter((item) => {
      const query = searchTerm.toLowerCase();

      const titleEn =
        typeof item.title === "object"
          ? item.title?.en || ""
          : item.title || "";
      const titleMm =
        typeof item.title === "object" ? item.title?.mm || "" : "";
      const descEn =
        typeof item.desc === "object" ? item.desc?.en || "" : item.desc || "";
      const descMm = typeof item.desc === "object" ? item.desc?.mm || "" : "";
      const journeyTitle = item.journeyTitle || "";

      // Search query စစ်ခြင်း
      const matchesSearch =
        titleEn.toLowerCase().includes(query) ||
        titleMm.toLowerCase().includes(query) ||
        descEn.toLowerCase().includes(query) ||
        descMm.toLowerCase().includes(query) ||
        journeyTitle.toLowerCase().includes(query);

      // 📌 Journey အလိုက် Filter စစ်ခြင်း
      const matchesJourney =
        selectedJourney === "All" ||
        String(item.systemId) === String(selectedJourney);

      return matchesSearch && matchesJourney;
    });
  }, [allChapters, searchTerm, selectedJourney]);

  const handleJourneyChange = (e) => {
    setSelectedJourney(e.target.value);
    setCurrentPage(1); // Journey ပြောင်းလျှင် ပထမစာမျက်နှာသို့ ပြန်သွားမည်
  };

  // Delete Handler
  const handleDeleteClick = (chapter) => {
    const chapterTitle =
      typeof chapter?.title === "object"
        ? chapter?.title?.en || chapter?.title?.mm
        : chapter?.title;

    showAlert({
      isModal: true,
      type: "delete", // 📌 အနီရောင် သတိပေးချက် Delete Modal ပုံစံဖြစ်သွားမည်
      title: "Confirm Deletion",
      message: `Are you sure you want to delete chapter "${chapterTitle}"?`,
      cancelText: "Cancel",
      actionText: "Yes, Delete",
      onAction: () => confirmDelete(chapter), // ဖျက်မယ့် လုပ်ဆောင်ချက်ကို ဒီမှာ ပေးလိုက်မည်
    });
  };

  const confirmDelete = async (chapter) => {
    try {
      const { systemId, id: chapterId, chapterIndex } = chapter;

      const journey = journeys.find(
        (j) =>
          String(j?.id) === String(systemId) ||
          String(j?.journeyId) === String(systemId),
      );
      if (!journey) return;

      const updatedChapters = (journey.chapters || []).filter((ch, index) => {
        const matchId =
          ch?.id && chapterId && String(ch.id) === String(chapterId);
        const matchIndex = index === chapterIndex;
        return !(matchId || matchIndex);
      });

      await updateJourney(journey.id, {
        ...journey,
        chapters: updatedChapters,
      });

      refetch();
      showAlert({ message: "Chapter deleted successfully!", type: "success" });
    } catch (err) {
      console.error("Failed to delete chapter:", err);
      showAlert({
        message: "Failed to delete this chapter. Please try again.",
        type: "error",
      });
    }
  };

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // တစ်မျက်နှာလျှင် Card 9 ခုပြမည် (3x3 grid equivalent)

  // စာမျက်နှာအလိုက် ပေါ်မည့် chapters များကို တွက်ချက်ခြင်း
  const currentChapters = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredChapters.slice(startIndex, endIndex);
  }, [filteredChapters, currentPage, itemsPerPage]);

  // စုစုပေါင်း ဘယ်နှစ်မျက်နှာ ရှိလဲ တွက်ချက်ခြင်း
  const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);

  // Search လုပ်သည့်အခါ Page 1 သို့ အလိုအလျောက် ပြန်သွားစေရန် Search Input တွင် သုံးမည်
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 📌 Search ပြောင်းလျှင် ပထမစာမျက်နှာသို့ ပြန်သွားမည်
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Chapters Management</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Manage learning chapters across all journeys, track sequencing, and
            contents.
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
              <span className="text-text font-semibold">Chapters</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Search Bar, Journey Filter, Language Toggle & Add Button */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search Input with Clear ('X') Button */}
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search chapters by title or journey..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-bg-elevated border border-border rounded-xl pl-10 pr-10 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            {/* 📌 Search စာသားရှိမှသာ ပေါ်မည့် X ဖျက်သည့်ခလုတ် */}
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1); // စာရှင်းလိုက်လျှင် Page 1 သို့ ပြန်သွားမည်
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* 📌 Journey Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-text-muted shrink-0" />
            <select
              value={selectedJourney}
              onChange={handleJourneyChange}
              className="bg-bg-elevated border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors w-full sm:w-52"
            >
              <option value="All">All Journeys</option>
              {journeys.map((journey) => (
                <option key={journey?.id} value={journey?.id}>
                  {journey?.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          {/* Language Toggle Switcher */}
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
            to="/admin/learning/chapters/create"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all w-full sm:w-auto justify-center"
          >
            <Plus size={16} /> Add New Chapter
          </Link>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-center py-16 text-text-muted text-sm">
          <Loader2
            size={32}
            className="mx-auto text-primary animate-spin mb-3"
          />
          Loading chapters data...
        </div>
      )}
      {error && (
        <div className="text-center py-16 text-red-400 text-sm">
          Failed to load API data.
        </div>
      )}

      {/* Chapters Table UI */}
      {!loading && !error && (
        <div className="bg-bg-elevated border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/50 text-text-muted text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Chapter / Title</th>
                  <th className="py-3.5 px-4 font-semibold">Journey</th>
                  <th className="py-3.5 px-4 font-semibold whitespace-nowrap">
                    Lessons
                  </th>
                  <th className="py-3.5 px-4 font-semibold whitespace-nowrap">
                    Duration
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text">
                {currentChapters.length > 0 ? (
                  currentChapters.map((chapter, idx) => {
                    const title =
                      typeof chapter.title === "object"
                        ? chapter.title?.[currentLang] ||
                          chapter.title?.en ||
                          "Untitled Chapter"
                        : chapter.title;

                    const rawDesc = chapter.desc || chapter.description;
                    const desc =
                      typeof rawDesc === "object"
                        ? rawDesc?.[currentLang] ||
                          rawDesc?.en ||
                          "No description provided."
                        : rawDesc || "No description provided.";

                    const chapterOrder =
                      chapter.order || chapter.chapterNumber || idx + 1;

                    // ဒီ Chapter နဲ့ သက်ဆိုင်တဲ့ lessons များကို ရှာပြီး အရေအတွက်နဲ့ ကြာချိန်တွက်ခြင်း
                    const chapterLessons = Array.isArray(lessons)
                      ? lessons.filter(
                          (l) =>
                            String(l?.chapterId || "").trim() ===
                            String(chapter?.id || "").trim(),
                        )
                      : [];

                    const totalLessonsCount = chapterLessons.length;
                    const totalMinutes = chapterLessons.reduce(
                      (acc, l) =>
                        acc + Number(l?.duration || l?.durationMin || 0),
                      0,
                    );

                    return (
                      <tr
                        key={chapter?.id || idx}
                        className="hover:bg-surface/30 transition-colors"
                      >
                        {/* Chapter Info & Icon */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 shadow-sm"
                              style={{
                                backgroundColor: chapter.journeyColorBg,
                                color: chapter.journeyColor,
                              }}
                            >
                              <RenderIcon
                                iconKey={chapter.iconKey || "code"}
                                map={boardIconMap}
                                size={22}
                              />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                                  style={{
                                    backgroundColor: chapter.journeyColorBg,
                                    color: chapter.journeyColor,
                                  }}
                                >
                                  #{chapterOrder}
                                </span>
                                <h4 className="font-bold text-text text-sm">
                                  {title}
                                </h4>
                              </div>
                              <p className="text-xs text-text-muted line-clamp-2 mt-1">
                                {desc}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Journey Badge */}
                        <td className="py-4 px-4 text-xs whitespace-nowrap">
                          <span
                            className="inline-block px-2.5 py-1 rounded-lg font-medium uppercase text-[10px] border border-border"
                            style={{
                              backgroundColor: chapter.journeyColorBg,
                              color: chapter.journeyColor,
                            }}
                          >
                            {chapter.journeyTitle}
                          </span>
                        </td>

                        {/* Lessons Count Column */}
                        <td className="py-4 px-4 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-text-muted">
                            <BookOpen
                              size={14}
                              className="text-primary shrink-0"
                            />
                            <span className="font-medium text-text">
                              {totalLessonsCount} Lessons
                            </span>
                          </div>
                        </td>

                        {/* Duration Column */}
                        <td className="py-4 px-4 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-text-muted">
                            <Clock
                              size={14}
                              className="text-primary shrink-0"
                            />
                            <span className="font-medium text-text">
                              {totalMinutes} mins
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/learning/chapters/edit/${chapter.systemId}/${chapter.id}`}
                              className="p-2 rounded-xl bg-surface border border-border text-text-muted hover:text-text transition-colors"
                              title="Edit Chapter"
                            >
                              <Edit3 size={15} />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(chapter)}
                              className="p-2 rounded-xl bg-surface border border-border text-red-500 hover:bg-red-500/10 transition-colors"
                              title="Delete Chapter"
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
                      No chapters found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Navigation UI */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <nav className="flex items-center gap-x-1" aria-label="Pagination">
            {/* Previous Button */}
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-text hover:bg-bg-hover disabled:opacity-50 disabled:pointer-events-none transition-all"
              aria-label="Previous"
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

            {/* Page Numbers Indicator with Primary Accent */}
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

            {/* Next Button */}
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-text hover:bg-bg-hover disabled:opacity-50 disabled:pointer-events-none transition-all"
              aria-label="Next"
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
    </div>
  );
};

export default ChaptersIndex;
