import { useNavigate } from "react-router";
import {
  useMutation,
  useQuery,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/authService";

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthStoreState {
  setAuth: (accessToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthSign = () => {
  const navigate = useNavigate();
  const store = useAuthStore() as unknown as AuthStoreState;
  const { setAuth, logout: storeLogout, updateUser } = store;

  const signInMutation: UseMutationResult<AuthResponse, Error, SignInData> =
    useMutation({
      mutationFn: ({ email, password }) => authService.login(email, password),
      onSuccess: (data) => {
        setAuth(data.accessToken, data.user);
        navigate("/", { replace: true });
      },
      onError: (error) => {
        console.error("Login failed: ", error.message);
      },
    });

  const signUpMutation: UseMutationResult<AuthResponse, Error, SignUpData> =
    useMutation({
      mutationFn: (userData) => authService.register(userData),
      onSuccess: (data) => {
        setAuth(data.accessToken, data.user);
        navigate("/", { replace: true });
      },
    });

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error: ", error);
    } finally {
      storeLogout();
      navigate("/sign-in", { replace: true });
    }
  };

  const { data: userData, isFetching: isFetchingMe } = useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getMe(),
    enabled: !!useAuthStore.getState().accessToken && !useAuthStore.getState().user,
    retry: false,
  });

  useEffect(() => {
    if (userData) {
      updateUser(userData);
    }
  }, [userData, updateUser]);

  return {
    signIn: signInMutation.mutateAsync,
    isSignedIn: signInMutation.isPending,
    signInError: signInMutation.error,

    signUp: signUpMutation.mutateAsync,
    isSignedUp: signUpMutation.isPending,
    signUpError: signUpMutation.error,

    logout,
    isFetchingMe,

    user: useAuthStore((state) => state.user),
    token: useAuthStore((state) => state.accessToken),
    isAuthenticated: useAuthStore((state) => state.isAuthenticated),
  };
};