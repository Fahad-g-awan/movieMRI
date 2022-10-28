import React, { useEffect } from "react";
import { useMovies } from "../../hooks";
import MovieListItem from "../MovieListItem";
import PrevAndNextButtons from "../PrevAndNextButtons";

export default function Movies() {
  const { fetchMovies, movies: newMovies, fetchNextPage, fetchPreviousPage } = useMovies();

  const handleUiUpdate = () => fetchMovies();

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
              afterDelete={handleUiUpdate}
              afterUpdate={handleUiUpdate}
            />
          );
        })}

        <PrevAndNextButtons
          className="mt-5"
          onPrevClick={fetchPreviousPage}
          onNextClick={fetchNextPage}
        />
      </div>
    </>
  );
}
