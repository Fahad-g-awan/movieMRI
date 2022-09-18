import React from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Actors from "../components/admin/Actors";
import AdminNavbar from "../components/admin/AdminNavBar";
import Dashboard from "../components/admin/Dashboard";
import Header from "../components/admin/Header";
import Movies from "../components/admin/Movies";
import MovieUpload from "../components/admin/MovieUpload";
import ActorUpload from "../components/admin/ActorUpload";
import NotFound from "../components/NotFound";

export default function AminNavigator() {
  const [showMovieUploadModal, setShowMovieUploadModal] = useState(false);
  const [showActorUploadModal, setShowActorUploadModal] = useState(false);

  const displayMovieUploadModal = () => {
    setShowMovieUploadModal(true);
  };

  const hideMovieUploadModal = () => {
    setShowMovieUploadModal(false);
  };

  const displayActorUploadModal = () => {
    setShowActorUploadModal(true);
  };

  const hideActorUploadModal = () => {
    setShowActorUploadModal(false);
  };
  return (
    <>
      <div className="flex dark:bg-primary bg-white">
        <AdminNavbar />

        <div className="flex-1 p-2">
          <Header
            onAddMovieClick={displayMovieUploadModal}
            onAddActorClick={displayActorUploadModal}
          />
          <div className="max-w-screen-xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/actors" element={<Actors />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>

      <MovieUpload visible={showMovieUploadModal} onClose={hideMovieUploadModal} />
      <ActorUpload visible={showActorUploadModal} onClose={hideActorUploadModal} />
    </>
  );
}
