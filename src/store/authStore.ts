// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthStore {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  setAuth: (accessToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User | null) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: (accessToken, user) =>
        set({
          accessToken,
          user,
          isAuthenticated: !!accessToken,
        }),

      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        }),

      updateUser: (user) => set({ user }),

      hydrate: () => {
        const { accessToken } = get();
        set({ isAuthenticated: !!accessToken });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrate();
        }
      },
    },
  ),
);
