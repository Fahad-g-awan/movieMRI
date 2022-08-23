import React from "react";
import { Route, Routes } from "react-router-dom";
import ConfirmPassword from "./components/Auth/ConfirmPassword";
import EmailVerification from "./components/Auth/EmailVerification";
import ForgetPassword from "./components/Auth/ForgetPassword";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Navbar from "./components/user/Navbar";
import AdminNavigator from "./navigator/AdminNavigator";
import { useAuth } from "./hooks";

export default function App() {
  const { authInfo } = useAuth();
  const isAdmin = authInfo.profile?.role === "admin";

  if (isAdmin) return <AdminNavigator />;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/verification" element={<EmailVerification />} />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/reset-password" element={<ConfirmPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
