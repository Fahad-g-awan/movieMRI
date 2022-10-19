import React, { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovieForAdmin } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieListItem from "../MovieListItem";
import NotFoundText from "../NotFoundText";

export default function SearchMovies() {
  const [movies, setMovies] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);

  const [searhParams] = useSearchParams();
  const query = searhParams.get("title");
  const { updateNotification } = useNotification();

  const searchMovies = async (value) => {
    const { results, error } = await searchMovieForAdmin(value);

    if (error) return updateNotification("error", error);
    if (!results.length) {
      setResultNotFound(true);
      return setMovies([]);
    }

    setResultNotFound(false);
    setMovies([...results]);
  };

  useEffect(() => {
    if (query.trim()) searchMovies(query);
  }, [query]);

  return (
    <div className="p-5 space-y-3">
      <NotFoundText text="No record found" visible={resultNotFound} />
      {!resultNotFound &&
        movies.map((m) => {
          return <MovieListItem movie={m} key={m.id} />;
        })}
    </div>
  );
}