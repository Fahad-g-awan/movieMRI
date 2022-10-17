import React, { useEffect } from "react";
import { useState } from "react";
import { deleteMovie, getMovieForUodate, getMovies } from "../api/movie";
import { useNotification } from "../hooks";
import ConfirmModal from "./modals/ConfirmModal";
import UpdateMovie from "./modals/UpdateMovie";
import MovieListItem from "./MovieListItem";

const pageNo = 0;
const limit = 1;

export default function LatestUploads() {
  const [movies, setMovies] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { updateNotification } = useNotification();

  const fetchLatestUploads = async () => {
    const { error, movies } = await getMovies(pageNo, limit);

    if (error) return updateNotification("error", error);

    setMovies([...movies]);
  };

  const handleOnDeleteClick = (movie) => {
    setSelectedMovie(movie);
    setShowConfirmModal(true);
  };

  const handleOnEditClick = async ({ id }) => {
    setShowUpdateModal(true);
    const { error, movie } = await getMovieForUodate(id);

    if (error) return updateNotification("error", error);

    setSelectedMovie(movie);
  };

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(selectedMovie.id);
    setBusy(false);

    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    fetchLatestUploads();
    hideConfirmModal();
  };

  const handleOnUpdate = (movie) => {
    const updatedMovies = movies.map((m) => {
      if (m.id === movie.id) return movie;
      return m;
    });

    setMovies(updatedMovies);
  };

  const hideConfirmModal = () => setShowConfirmModal(false);
  const hideUpdateModal = () => setShowUpdateModal(false);

  useEffect(() => {
    fetchLatestUploads();
  }, []);

  return (
    <>
      <div className="bg-white shadow dark:bg-secondary p-5 rounded col-span-2">
        <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">Recent Uploads</h1>

        <div className="space-y-3">
          {movies.map((movie) => {
            return (
              <MovieListItem
                key={movie.id}
                movie={movie}
                onDeleteClick={() => handleOnDeleteClick(movie)}
                onEditClick={() => handleOnEditClick(movie)}
              />
            );
          })}
        </div>
      </div>

      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        subtitle="This movie will be deleted permanentaly"
        onCancel={hideConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        busy={busy}
      />

      <UpdateMovie
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        initialState={selectedMovie}
        onSuccess={handleOnUpdate}
      />
    </>
  );
}
