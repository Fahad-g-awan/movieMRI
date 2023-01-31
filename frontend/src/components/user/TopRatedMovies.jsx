import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getTopRatedMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieList from "./MovieList";

export default function TopRatedMovies(signal) {
  const [movies, setMovies] = useState([]);

  // const { updateNotification } = useNotification();

  const fetchMovies = async (signal) => {
    const { error, movies } = await getTopRatedMovies(null, signal);

    // if (error) return updateNotification("error", error);

    setMovies([...movies]);
  };

  useEffect(() => {
    const ac = new AbortController();

    fetchMovies(ac.signal);

    return () => {
      ac.abort();
    };
  }, []);

  return <MovieList movies={movies} title="Viewers Choice (Movies)" />;
}
