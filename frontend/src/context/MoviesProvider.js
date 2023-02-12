import React, { createContext, useState } from "react";
import { getAppInfo } from "../api/admin";
import { getMovies } from "../api/movie";
import { useNotification } from "../hooks";

export const MovieContext = createContext();

let currentPageNo = 0;
let limit = 10;

export default function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [latestUploads, setLatestUploads] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [appInfo, setAppInfo] = useState({ movieCount: 0, reviewCount: 0, userCount: 0 });

  const { updateNotification } = useNotification();

  const fetchMovies = async (pageNo = currentPageNo) => {
    const { movies, error } = await getMovies(limit, pageNo);

    if (error) return updateNotification("error", error);
    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setMovies([...movies]);
  };

  const fetchLatestUploads = async (qty = 5) => {
    const { error, movies } = await getMovies(qty, 0);

    if (error) return updateNotification("error", error);

    setLatestUploads([...movies]);
  };

  const fetchAppInfo = async (qty = 5) => {
    const { appInfo, error } = await getAppInfo();

    if (error) return updateNotification("error", error);

    setAppInfo({ ...appInfo });
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
    <MovieContext.Provider
      value={{
        movies,
        latestUploads,
        fetchLatestUploads,
        fetchMovies,
        fetchNextPage,
        fetchPreviousPage,
        appInfo,
        fetchAppInfo,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}
