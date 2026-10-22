import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  BookOpen,
  Layers,
  Users,
  Star,
  Edit3,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useFetch } from "../../../../hooks/useFetch";
import {
  getJourneys,
  deleteJourney as deleteJourneyApi,
} from "../../../../api/journeysApi";
import { getLessons } from "../../../../api/lessonsApi";
import { useAlert } from "../../../../context/AlertContext";
import { boardIconMap, RenderIcon } from "../../../../utils/iconMaps";

const getLessonQuestionsXp = (lesson) => {
  if (!lesson) return 0;
  if (Array.isArray(lesson.questions) && lesson.questions.length > 0) {
    return lesson.questions.reduce((sum, q) => sum + Number(q.xp || 0), 0);
  }
  return Number(lesson.xpReward || lesson.xp || 20);
};

const JourneysIndex = () => {
  const showAlert = useAlert();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: journeysData,
    loading: journeysLoading,
    error: journeysError,
  } = useFetch(getJourneys);

  // 📌 Journeys တွေအတွက်ပါ Override State ထည့်ခြင်း
  const [journeysOverride, setJourneysOverride] = useState(null);
  const journeys =
    journeysOverride ?? (Array.isArray(journeysData) ? journeysData : []);

  const {
    data: lessonsData,
    loading: lessonsLoading,
    error: lessonsError,
  } = useFetch(getLessons);

  // const journeys = Array.isArray(journeysData) ? journeysData : [];
  const allLessons = Array.isArray(lessonsData) ? lessonsData : [];

  const isLoading = journeysLoading || lessonsLoading;
  const hasError = journeysError || lessonsError;

  const enrichedJourneys = useMemo(() => {
    if (!Array.isArray(journeys)) return [];

    return journeys.map((j) => {
      const journeyId = j.journeyId;
      const journeyLessons = allLessons.filter(
        (l) => String(l.journeyId) === String(journeyId),
      );

      const totalChapters = j.chapters?.length || 0;
      let totalLessons = 0;
      let totalMaxXp = 0;
      const uniqueLearners = new Set();

      if (journeyLessons.length > 0) {
        totalLessons = journeyLessons.length;
        journeyLessons.forEach((l) => {
          totalMaxXp += getLessonQuestionsXp(l);
          if (Array.isArray(l.completedUserIds)) {
            l.completedUserIds.forEach((uid) =>
              uniqueLearners.add(String(uid)),
            );
          }
        });
      } else {
        totalLessons = Number(j.totalLessons || 0);
        totalMaxXp = Number(j.totalXp || 0);
      }

      const studentsCount = uniqueLearners.size;

      return {
        ...j,
        totalChapters,
        totalLessons,
        totalXp: totalMaxXp,
        studentsCount,
      };
    });
  }, [journeys, allLessons]);

  const filteredJourneys = useMemo(() => {
    return enrichedJourneys.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.journeyId?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [enrichedJourneys, searchTerm]);

  // 📍 STEP 4.2: Delete ခလုတ်နှိပ်လိုက်ရင် AlertContext ရဲ့ Modal ပွင့်လာစေမည့် Function
  const handleDeleteClick = (journey) => {
    showAlert({
      isModal: true,
      type: "delete", // 📌 AlertContext ထဲက အနီရောင် delete style ကို သုံးမည်
      title: "Confirm Deletion",
      message: `Are you sure you want to delete journey "${journey?.title}"?`,
      cancelText: "Cancel",
      actionText: "Yes, Delete",
      onAction: () => confirmDelete(journey), // ဖျက်မယ့် လုပ်ဆောင်ချက်ကို ပေးခြင်း
    });
  };

  // 📍 STEP 4.3: Modal ထဲက 'Yes, Delete' နှိပ်ရင် API ခေါ်ပြီး ဖျက်မည့် Function
  const confirmDelete = async (journeyToDelete) => {
    if (!journeyToDelete) return;

    try {
      await deleteJourneyApi(journeyToDelete.id);

      // 📌 Page Reload လုပ်မည့်အစား journeysOverride ကို သုံး၍ ဇယားထဲမှ ချက်ချင်းဖယ်ထုတ်ခြင်း
      setJourneysOverride(
        journeys.filter((j) => String(j.id) !== String(journeyToDelete.id)),
      );

      showAlert({
        message: `Journey "${journeyToDelete.title}" deleted successfully!`,
        type: "success",
      });
    } catch (err) {
      console.error("Delete failed:", err);
      showAlert({
        message: "Failed to delete journey. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Journeys Management</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Manage learning tracks, real XP, board images, and links.
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
              <span className="text-text font-semibold">Journeys</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Search Bar & Add Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search journeys by title or journeyId..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-elevated border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <Link
          to="/admin/learning/journeys/create"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all w-full sm:w-auto justify-center"
        >
          <Plus size={16} /> Add New Journey
        </Link>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="text-center py-16 text-text-muted text-sm">
          <Loader2
            size={32}
            className="mx-auto text-primary animate-spin mb-3"
          />
          Loading journeys data...
        </div>
      )}
      {hasError && (
        <div className="text-center py-16 text-red-400 text-sm">
          Failed to load API data.
        </div>
      )}

      {/* Journeys Cards Grid UI */}
      {!isLoading && !hasError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJourneys.length > 0 ? (
            filteredJourneys.map((item) => (
              <div
                key={item.journeyId}
                className="bg-bg-elevated border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 border border-white/5"
                      style={{
                        backgroundColor:
                          item.colorBg || `${item.color || "#00878F"}15`,
                        color: item.color || "#00878F",
                      }}
                    >
                      <RenderIcon
                        iconKey={item.iconKey}
                        map={boardIconMap}
                        size={22}
                      />
                    </div>
                    <div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase"
                        style={{
                          backgroundColor: `${item.color || "#00878F"}20`,
                          color: item.color || "#00878F",
                        }}
                      >
                        {item.level || "Beginner"}
                      </span>
                      <h3 className="text-base font-bold text-text mt-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-text-muted font-mono mt-0.5">
                        journeyId: {item.journeyId}{" "}
                        {item.link && (
                          <span className="text-primary ml-1">
                            ({item.link})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Board Image Preview */}
                  {item.boardImage && (
                    <div className="w-24 h-20 rounded-xl bg-surface border border-border overflow-hidden p-1.5 shrink-0 flex items-center justify-center">
                      <img
                        src={item.boardImage}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <p className="text-xs text-text-muted line-clamp-2">
                  {item.desc || item.description}
                </p>

                {/* Chapters, Lessons, XP Stats */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-surface border border-border text-xs text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={13} className="text-primary" />
                    <span>
                      <strong>{item.totalChapters}</strong> Chapters
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers size={13} className="text-sky-400" />
                    <span>
                      <strong>{item.totalLessons}</strong> Lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end text-amber-400 font-semibold">
                    <Star size={13} className="fill-amber-400" />
                    <span>{item.totalXp} XP</span>
                  </div>
                </div>

                {/* Learners & Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                  <span className="text-text-muted text-[11px] flex items-center gap-1">
                    <Users size={12} /> Learners:{" "}
                    <strong className="text-text">{item.studentsCount}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/learning/journeys/edit/${item.journeyId}`}
                      className="p-2 rounded-xl bg-surface border border-border text-text-muted hover:text-text transition-colors"
                      title="Edit Journey"
                    >
                      <Edit3 size={15} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="p-2 rounded-xl bg-surface border border-border text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete Journey"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-text-muted text-sm bg-bg-elevated border border-border rounded-2xl">
              No Journeys found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JourneysIndex;
