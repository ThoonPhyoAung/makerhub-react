
import { contentApi } from "./api"; // Account 1: Journeys & Lessons API instance

/**
 * 1. Get All Lessons (Search/Filter Query Params လက်ခံရန်)
 * @param {Object} params - e.g. { chapterId: "uno-sensors", journeyId: "arduino-uno" }
 */
export const getLessons = async (params = {}) => {
  const response = await contentApi.get("/lessons", { params });
  return response.data;
};

/**
 * 2. Get Lessons by Chapter ID (Chapter Details Page အတွက်)
 * MockAPI Query Filter (/lessons?chapterId=uno-sensors)
 */
export const getLessonsByChapterId = async (chapterId) => {
  const response = await contentApi.get("/lessons", {
    params: { chapterId },
  });
  return response.data;
};

/**
 * 3. Get Lessons by Journey ID (Journey အလိုက် Lesson များ ဆွဲထုတ်ရန်)
 */
export const getLessonsByJourneyId = async (journeyId) => {
  const response = await contentApi.get("/lessons", {
    params: { journeyId },
  });
  return response.data;
};

/**
 * 4. Get Single Lesson by ID
 */
export const getLessonById = async (id) => {
  const response = await contentApi.get(`/lessons/${id}`);
  return response.data;
};

/**
 * 5. Get Single Lesson by lessonUrlParam / Slug (Module Details Page အတွက်)
 * /lessons?lessonUrlParam=uno-dht11-sensor
 */
export const getLessonBySlug = async (lessonUrlParam) => {
  const response = await contentApi.get("/lessons", {
    params: { lessonUrlParam },
  });
  // MockAPI Query parameter က Array ပြန်ပေးလေ့ရှိသဖြင့် ပထမဆုံး Item ကို ယူမည်
  return Array.isArray(response.data) ? response.data[0] : response.data;
};

/**
 * 6. Create New Lesson (Admin / Creator Mode)
 */
export const createLesson = async (lessonData) => {
  const response = await contentApi.post("/lessons", lessonData);
  return response.data;
};

/**
 * 7. Update Lesson
 */
export const updateLesson = async (id, lessonData) => {
  const response = await contentApi.put(`/lessons/${id}`, lessonData);
  return response.data;
};

/**
 * 8. Delete Lesson
 */
export const deleteLesson = async (id) => {
  const response = await contentApi.delete(`/lessons/${id}`);
  return response.data;
};
