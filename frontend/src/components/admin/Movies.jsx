import React, { useEffect } from "react";
import { useState } from "react";
import { getMovieForUodate, getMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import UpdateMovie from "../modals/UpdateMovie";
import MovieListItem from "../MovieListItem";
import PrevAndNextButtons from "../PrevAndNextButtons";

let currentPageNo = 0;
let limit = 10;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateMovieModal, setShowUpdateMovieModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

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

  const handleOnNextClick = () => {
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchMovies(currentPageNo);
  };

  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo -= 1;
    fetchMovies(currentPageNo);
  };

  const handleOnEditClick = async ({ id }) => {
    const { error, movie } = await getMovieForUodate(id);
    setSelectedMovie(movie);
    if (error) updateNotification("error", error);
    setShowUpdateMovieModal(true);
  };

  const handleHideMovieUpdateModal = () => {
    setShowUpdateMovieModal(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <>
      <div className="space-y-5 p-5">
        {movies.map((movie) => {
          return (
            <MovieListItem
              key={movie.id}
              movie={movie}
              onEditClick={() => handleOnEditClick(movie)}
            />
          );
        })}

        <PrevAndNextButtons
          className="mt-5"
          onPrevClick={handleOnPrevClick}
          onNextClick={handleOnNextClick}
        />
      </div>

      <UpdateMovie
        visible={showUpdateMovieModal}
        initialState={selectedMovie}
        onClose={handleHideMovieUpdateModal}
      />
    </>
  );
}
