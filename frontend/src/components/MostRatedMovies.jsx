import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getMostRatedMovies } from "../api/admin";
import { useNotification } from "../hooks";
import { convertReviewCount } from "../utils/helper";
import RatingStar from "./RatingStar";

export default function MostRatedMovies() {
  const [movies, setMovies] = useState([]);

  const { updateNotification } = useNotification();

  const fetchMostRatedMovies = async () => {
    const { movies, error } = await getMostRatedMovies();

    if (error) return updateNotification("error", error);

    if (!movies.length) {
      return;
    }
    setMovies([...movies]);
  };

  useEffect(() => {
    fetchMostRatedMovies();
  }, []);

  return (
    <div className="bg-white shadow dark:bg-secondary p-5 rounded">
      <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">
        Most Rated Movies
      </h1>
      <ul className="space-y-3">
        {movies.length ? (
          movies.map((movie) => {
            return (
              <li key={movie.id}>
                <h1 className="dark:text-white text-secondary font-semibold"> {movie.title}</h1>
                <div className="flex space-x-2">
                  <RatingStar rating={movie.reviews?.ratingAvg} />
                  <p className="dark:text-dark-subtle text-light-subtle">
                    {convertReviewCount(movie.reviews?.reviewsCount)} Reviews
                  </p>
                </div>
              </li>
            );
          })
        ) : (
          <h1 className="dark:text-white text-secondary font-semibold">
            No ratings have been added
          </h1>
        )}
      </ul>
    </div>
  );
}
