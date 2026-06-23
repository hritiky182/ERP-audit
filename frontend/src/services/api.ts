import axiosInstance from "../api/axios";

// Re-export the main configured Axios instance for existing service files
export const api = axiosInstance;
export default api;
