import React, { useEffect } from "react";
import { useState } from "react";
import { getRelatedMovies } from "../api/movie";
import { useNotification } from "../hooks";
import MovieList from "./user/MovieList";

export default function RelatedMovies({ movieId }) {
  const [movies, setMovies] = useState([]);

  const { updatenotification } = useNotification();

  const fetchMovies = async () => {
    const { movies, error } = await getRelatedMovies(movieId);

    if (error) return updatenotification("error", error);

    setMovies([...movies]);
  };

  useEffect(() => {
    if (movieId) fetchMovies();
  }, [movieId]);

  return (
    <div>
      <MovieList title="Related Movies" movies={movies} />
    </div>
  );
}
