import React, { useContext, useState } from "react";
import { getMovies } from "../api/movie";
import { useNotification } from "../hooks";

export const MovieContext = useContext();

let currentPageNo = 0;
let limit = 10;

export default function MoviesProvider(children) {
  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);

  const { updateNotification } = useNotification();

  const fetchMovies = async (pageNo) => {
    const { movies, error } = await getMovies(limit, pageNo);

    if (error) return updateNotification("error", error);
    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setMovies([...movies]);
  };

  const fetchNextPage = () => {
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchMovies(currentPageNo);
  };

  const fetchPreviousPage = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo -= 1;
    fetchMovies(currentPageNo);
  };

  return (
    <MovieContext.MoviesProvider value={{ movies, fetchMovies, fetchNextPage, fetchPreviousPage }}>
      {children}
    </MovieContext.MoviesProvider>
  );
}
