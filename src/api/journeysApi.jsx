import { contentApi } from "./api"; // Account 1 API instance[cite: 12]

// 1. Get All Journeys (Optional query params ပါ ထည့်ဆွဲနိုင်ရန်)[cite: 12]
export const getJourneys = async (params = {}) => {
  const response = await contentApi.get("/journeys", { params });
  return response.data;
};

// 2. Get Single Journey by ID (Detail Page အတွက်)[cite: 12]
export const getJourneyById = async (id) => {
  const response = await contentApi.get(`/journeys/${id}`);
  return response.data;
};

// 3. Create New Journey
export const createJourney = async (journeyData) => {
  const response = await contentApi.post("/journeys", journeyData);
  return response.data;
};

// 4. Update Existing Journey
export const updateJourney = async (id, journeyData) => {
  const response = await contentApi.put(`/journeys/${id}`, journeyData);
  return response.data;
};

// 5. Delete Journey
export const deleteJourney = async (id) => {
  const response = await contentApi.delete(`/journeys/${id}`);
  return response.data;
};
