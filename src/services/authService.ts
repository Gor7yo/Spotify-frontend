import { apiClient } from "../api/axiosInstance";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

interface RefreshTokenResponse {
  accessToken: string;
}

interface User {
  id: number;
  email: string;
  name?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/sign-in", {
      email,
      password,
    });
    return data;
  },

  register: async (
    userData: LoginCredentials & { name?: string },
  ): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/sign-up",
      userData,
    );
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const { data } = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh",
      { refreshToken },
    );
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/auth/me");
    return data;
  },
};
