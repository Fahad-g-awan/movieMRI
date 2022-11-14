import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getTopRatedMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieList from "./MovieList";

export default function TopRatedWebSeries() {
  const [movies, setMovies] = useState([]);

  const { updateNotification } = useNotification();

  const fetchMovies = async () => {
    const { error, movies } = await getTopRatedMovies("Web Series");

    if (error) return updateNotification("error", error);

    setMovies([...movies]);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return <MovieList movies={movies} title="Viewers Choice (Web Series)" />;
}
