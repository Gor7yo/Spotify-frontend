// AppRouter.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import { SignUp } from "../pages/SignUp/SignUp";
import { SignIn } from "../pages/SignIn/SignIn";
import { useAuthStore } from "../store/authStore";
import type { JSX } from "react";

const routes = [
  {
    path: "/",
    element: <Home />,
    isPrivate: false,
    title: "Home",
    name: "home",
  },
  {
    path: "/sign-up",
    element: <SignUp />,
    isPrivate: false,
    isAuthPage: true,
    title: "Sign Up",
    name: "signUp",
  },
  {
    path: "/sign-in",
    element: <SignIn />,
    isPrivate: false,
    isAuthPage: true,
    title: "Sign In",
    name: "signIn",
  },
  {
    path: "/profile",
    element: <div>Profile</div>,
    isPrivate: true,
    title: "Profile",
    name: "profile",
  },
];

// Компонент для защиты приватных маршрутов
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

// Компонент для страниц авторизации (редирект на главную если уже залогинен)
const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AppRouter = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {routes.map((route) => {
        if (route.isPrivate) {
          return (
            <Route
              key={route.name}
              path={route.path}
              element={<PrivateRoute>{route.element}</PrivateRoute>}
            />
          );
        }

        if (route.isAuthPage) {
          return (
            <Route
              key={route.name}
              path={route.path}
              element={<AuthRoute>{route.element}</AuthRoute>}
            />
          );
        }

        return (
          <Route key={route.name} path={route.path} element={route.element} />
        );
      })}
    </Routes>
  );
};
