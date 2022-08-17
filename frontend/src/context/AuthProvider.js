import React, { createContext, useEffect, useState } from "react";
import { getIsAuth, signIn } from "../api/auth";
import { useNotification } from "../hooks";

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isPending: false,
  isLoggedIn: false,
  error: "",
};

export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });

  const { updateNotification } = useNotification();

  // Login handler

  const loginHandler = async (email, password) => {
    setAuthInfo({ ...defaultAuthInfo, isPending: true });

    const { error, user } = await signIn({ email, password });

    if (error) {
      updateNotification("error", error);
      return setAuthInfo({ ...defaultAuthInfo, isPending: false, error });
    }

    setAuthInfo({ profile: { ...user }, isPending: false, isLoggedIn: true, error: "" });

    localStorage.setItem("auth-token", user.token);
  };

  // Logout handler

  const logoutHandler = () => {
    localStorage.removeItem("auth-token");
    setAuthInfo({ ...defaultAuthInfo });
  };

  // isAuth handler

  const isAuth = async () => {
    const token = localStorage.getItem("auth-token");

    if (!token) return;

    setAuthInfo({ ...defaultAuthInfo, isPending: true });

    const { error, user } = await getIsAuth(token);

    if (error) {
      updateNotification("error", error);
      return setAuthInfo({ ...defaultAuthInfo, isPending: false, error });
    }

    setAuthInfo({ profile: { ...user }, isPending: false, isLoggedIn: true, error: "" });
  };

  // UseEffect

  useEffect(() => {
    isAuth();
  }, []);

  // Render UI

  return (
    <AuthContext.Provider value={{ authInfo, loginHandler, logoutHandler, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
