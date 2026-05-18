import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const apiClient = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3000",
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequst = error.config;

    if (error.response?.status === 401 && !originalRequst._retry) {
      originalRequst._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const { data } = await axios.post("/auth/refresh", { refreshToken });

        useAuthStore.getState().setAuth(data.accessToken, data.user);

        originalRequst.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequst);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = "/sign-in";
        return Promise.reject(refreshToken);
      }
    }

		return Promise.reject(error)
  },
);
