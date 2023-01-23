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
import SingleMovie from "./components/user/SingleMovie";
import MovieReview from "./components/user/MovieReview";
import SearchMovies from "./components/user/SearchMovies";
import AllMovies from "./components/user/AllMovies";

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
        <Route path="/movie/:movieId" element={<SingleMovie />} />
        <Route path="/movie/reviews/:movieId" element={<MovieReview />} />
        <Route path="/movie/search" element={<SearchMovies />} />
        <Route path="/movie/all-public-movies" element={<AllMovies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
