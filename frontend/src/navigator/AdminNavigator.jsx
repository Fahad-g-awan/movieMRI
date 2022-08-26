import React from "react";
import { Route, Routes } from "react-router-dom";
import Actors from "../components/admin/Actors";
import AdminNavbar from "../components/admin/AdminNavBar";
import Dashboard from "../components/admin/Dashboard";
import Header from "../components/admin/Header";
import Movies from "../components/admin/Movies";
import NotFound from "../components/NotFound";

export default function AminNavigator() {
  return (
    <div className="flex dark:bg-primary bg-white">
      <AdminNavbar />

      <div className="flex-1 p-2 max-w-screen-xl">
        <Header
          onAddMovieClick={() => {
            console.log("Adding movie");
          }}
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
