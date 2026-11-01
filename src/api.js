import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:10000/api/v1",
  timeout: 75000,
});
api.interceptors.request.use((c) => {
  const t = sessionStorage.getItem("karty_token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401 && !e.config.url.endsWith("/login")) {
      sessionStorage.removeItem("karty_token");
      window.dispatchEvent(new Event("session-expired"));
    }
    return Promise.reject(e);
  },
);
