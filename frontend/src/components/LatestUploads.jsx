import React, { useEffect } from "react";
import { useMovies } from "../hooks";
import MovieListItem from "./MovieListItem";

export default function LatestUploads() {
  const { latestUploads, fetchLatestUploads } = useMovies();

  const handleUiUpdate = () => fetchLatestUploads();

  useEffect(() => {
    fetchLatestUploads(5);
  }, []);

  return (
    <>
      <div className="bg-white shadow dark:bg-secondary p-5 rounded col-span-2">
        <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">Recent Uploads</h1>

        <div className="space-y-3">
          {latestUploads.map((movie) => {
            return (
              <MovieListItem
                key={movie.id}
                movie={movie}
                afterDelete={handleUiUpdate}
                afterUpdate={handleUiUpdate}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
