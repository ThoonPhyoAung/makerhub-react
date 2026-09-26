import { contentApi } from "./api"; // Account 1 API instance

// 1. Get All Journeys (Optional query params ပါ ထည့်ဆွဲနိုင်ရန်)
export const getJourneys = async (params = {}) => {
  const response = await contentApi.get("/journeys", { params });
  return response.data;
};

// 2. Get Single Journey by ID (Detail Page အတွက်)
export const getJourneyById = async (id) => {
  const response = await contentApi.get(`/journeys/${id}`);
  return response.data;
};
