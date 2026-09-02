import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// const api = axios.create({
//   baseURL: "https://6a96c22a0e3240db90615a8a.mockapi.io/api/v1/ ", //api link
//   timeout: 5000,
// });

// export default api;

// Account 1: Journeys & Lessons
export const contentApi = axios.create({
  baseURL: import.meta.env.VITE_CONTENT_API_URL,
  timeout: 10000, // ၁၀ စက္ကန့်အတွင်း Response မလာရင် Auto cancel လုပ်မည်
  headers: {
    "Content-Type": "application/json", // to know that we are sending JSON data to the server although axios automatically sets this
    Accept: "application/json",
  },
});

// Account 2: Posts & Marketplace
export const communityApi = axios.create({
  baseURL: import.meta.env.VITE_COMMUNITY_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
