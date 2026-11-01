import axios from "axios";
export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:10000/api/v1" : "/api/v1")).trim().replace(/\/$/, ""),
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
    if (!e.response) e.message = 'تعذر الوصول للخادم — تحقق من الإنترنت ورابط الخدمة وانتظر استيقاظ Render';
    else if (e.response.status === 503 || typeof e.response.data === 'string') e.message = 'الخادم يستيقظ أو قاعدة البيانات غير متصلة — انتظر دقيقة وأعد المحاولة';
    if (e.response?.status === 401 && !e.config.url.endsWith("/login")) {
      sessionStorage.removeItem("karty_token");
      window.dispatchEvent(new Event("session-expired"));
    }
    return Promise.reject(e);
  },
);
