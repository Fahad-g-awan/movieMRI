import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getAllPublicMovies } from "../../api/movie";
import { useMovies, useNotification } from "../../hooks";
import Container from "../Container";
import PrevAndNextButtons from "../PrevAndNextButtons";
import MovieList from "./MovieList";

let currentPageNo = 0;
let limit = 20;

export default function AllMovies() {
  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);

  const { updateNotification } = useNotification();

  //   const { fetchNextPage, fetchPreviousPage } = useMovies();

  const fetchNextPage = () => {
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchAllMovies(currentPageNo);
  };

  const fetchPreviousPage = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo -= 1;
    fetchAllMovies(currentPageNo);
  };

  const fetchAllMovies = async (pageNo = currentPageNo) => {
    const { error, movies } = await getAllPublicMovies(limit, pageNo);

    if (error) return updateNotification("error", error);

    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setMovies([...movies]);
  };

  useEffect(() => {
    // const ac = new AbortController();

    fetchAllMovies();

    // return () => {
    //   ac.abort();
    // };
  }, []);

  return (
    <div className="dark:bg-primary bg-white min-h-screen py-8">
      <Container className="px-2 xl:p-0">
        <MovieList movies={movies} title="All Movies & Web Series" />;
        <PrevAndNextButtons
          className="mt-5"
          onPrevClick={fetchPreviousPage}
          onNextClick={fetchNextPage}
        />
      </Container>
    </div>
  );
}
