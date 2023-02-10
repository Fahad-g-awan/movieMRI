import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getMovieForUodate, updateMovie } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieForm from "../admin/MovieForm";
import ModalContainer from "./ModalContainer";

export default function UpdateMovie({ visible, onSuccess, onClose, movieId }) {
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, movie, message } = await updateMovie(movieId, data);
    setBusy(false);

    if (error) return updateNotification("error", error);

    updateNotification("success", message);

    onSuccess(movie);
    onClose();
  };

  const fetchMovieToUpdate = async () => {
    const { movie, error } = await getMovieForUodate(movieId);

    if (error) return updateNotification("error", error);
    setSelectedMovie(movie);
    setReady(true);
  };

  useEffect(() => {
    if (movieId) fetchMovieToUpdate();
  }, [movieId]);

  return (
    <ModalContainer visible={visible}>
      {ready ? (
        <MovieForm
          onClose={onClose}
          initialState={selectedMovie}
          btnTitle="Update"
          onSubmit={!busy ? handleSubmit : null}
          busy={busy}
        />
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-light-subtle dark:text-dark-subtle animate-pulse text-xl">
            Please wait...
          </p>
        </div>
      )}
    </ModalContainer>
  );
}
