import React, { useEffect } from "react";
import { useState } from "react";
import { deleteMovie, getMovieForUodate, getMovies } from "../../api/movie";
import { useMovies, useNotification } from "../../hooks";
import ConfirmModal from "../modals/ConfirmModal";
import UpdateMovie from "../modals/UpdateMovie";
import MovieListItem from "../MovieListItem";
import PrevAndNextButtons from "../PrevAndNextButtons";

let currentPageNo = 0;
let limit = 10;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateMovieModal, setShowUpdateMovieModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { updateNotification } = useNotification();
  const { fetchMovies, movies: newMovies, fetchNextPage, fetchPreviousPage } = useMovies();

  // const fetchMovies = async (pageNo) => {
  //   const { movies, error } = await getMovies(limit, pageNo);

  //   if (error) return updateNotification("error", error);
  //   if (!movies.length) {
  //     currentPageNo = pageNo - 1;
  //     return setReachedToEnd(true);
  //   }

  //   setMovies([...movies]);
  // };

  // const handleOnNextClick = () => {
  //   if (reachedToEnd) return;
  //   currentPageNo += 1;
  //   fetchMovies(currentPageNo);
  // };

  // const handleOnPrevClick = () => {
  //   if (currentPageNo <= 0) return;
  //   if (reachedToEnd) setReachedToEnd(false);
  //   currentPageNo -= 1;
  //   fetchMovies(currentPageNo);
  // };

  const handleOnEditClick = async ({ id }) => {
    const { error, movie } = await getMovieForUodate(id);
    setSelectedMovie(movie);
    if (error) updateNotification("error", error);
    setShowUpdateMovieModal(true);
  };

  const handleOnDeleteClick = (movie) => {
    setSelectedMovie(movie);
    setShowConfirmModal(true);
  };

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(selectedMovie.id);
    setBusy(false);

    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    hideConfirmModal();
    fetchMovies(currentPageNo);
  };

  const handleHideMovieUpdateModal = () => {
    setShowUpdateMovieModal(false);
  };

  const hideConfirmModal = () => setShowConfirmModal(false);

  const handleOnUpdate = (movie) => {
    const updateMovies = movies.map((m) => {
      if (m.id === movie.id) return movie;
      return m;
    });

    setMovies([...updateMovies]);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <>
      <div className="space-y-5 p-5">
        {newMovies.map((movie) => {
          return (
            <MovieListItem
              key={movie.id}
              movie={movie}
              onEditClick={() => handleOnEditClick(movie)}
              onDeleteClick={() => handleOnDeleteClick(movie)}
            />
          );
        })}

        <PrevAndNextButtons
          className="mt-5"
          onPrevClick={fetchPreviousPage}
          onNextClick={fetchNextPage}
        />
      </div>

      <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
        title="Are you sure?"
        subtitle="This movie will be deleted permanently"
        busy={busy}
      />

      <UpdateMovie
        visible={showUpdateMovieModal}
        initialState={selectedMovie}
        onClose={handleHideMovieUpdateModal}
        onSuccess={handleOnUpdate}
      />
    </>
  );
}
