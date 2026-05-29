import { useNavigate } from "react-router";
import {
  useMutation,
  useQuery,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { authService, Role } from "../../services/authService";

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  username: string;
}

interface AuthResponse {
  accessToken: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  role: Role;
}

interface AuthStoreState {
  setAuth: (accessToken: string) => void;
  logout: () => void;
  updateUser: (user: User | null) => void;
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
        setAuth(data.accessToken);
        navigate("/", { replace: true });
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const signUpMutation: UseMutationResult<AuthResponse, Error, SignUpData> =
    useMutation({
      mutationFn: (userData) => authService.register(userData),
      onSuccess: (data) => {
        setAuth(data.accessToken);
        navigate("/", { replace: true });
      },
    });

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      updateUser(null)
    } catch (error) {
      console.error("Logout error: ", error);
    } finally {
      storeLogout();
      navigate("/sign-in", { replace: true });
    }
  };

  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const {
    data: userData,
    isFetching: isFetchingMe,
    refetch: refetchMe,
  } = useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getMe(),
    enabled: !!accessToken && !user,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (userData) {
      updateUser(userData);
    }
  }, [userData, updateUser]);

  useEffect(() => {
    const validateToken = async () => {
      if (accessToken && !user) {
        try {
          await refetchMe();
        } catch (error) {
          console.error("Token validation failed:", error);
          storeLogout();
        }
      }
    };

    validateToken();
  }, []);

  return {
    signIn: signInMutation.mutateAsync,
    isSignedIn: signInMutation.isPending,
    signInError: signInMutation.error,

    signUp: signUpMutation.mutateAsync,
    isSignedUp: signUpMutation.isPending,
    signUpError: signUpMutation.error,

    logout,
    isFetchingMe,
    refetchMe,

    user: useAuthStore((state) => state.user),
    token: accessToken,
    isAuthenticated: useAuthStore((state) => state.isAuthenticated),
  };
};