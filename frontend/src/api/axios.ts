import axios from "axios";

// Create Axios instance with proper configuration
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT bearer token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("erp-audit-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Global error logging/handling (e.g. redirect on 401/403)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn("Session expired or unauthorized request. Redirecting...");
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("erp-audit-user");
          window.localStorage.removeItem("erp-audit-token");
          window.location.href = "/login";
        }
      } else if (status === 403) {
        console.warn("Forbidden request. Redirecting to forbidden page...");
        if (typeof window !== "undefined") {
          window.location.href = "/403";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
