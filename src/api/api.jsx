import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: "", //api link
  timeout: 5000,
});

export default api;
