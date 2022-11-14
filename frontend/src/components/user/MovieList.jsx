import React from "react";
import GridContainer from "../GridContainer";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";

const trimTitle = (text = "") => {
  if (text.length <= 20) return text;

  return text.substring(0, 20) + "..";
};

export default function MovieList({ title, movies = [] }) {
  if (!movies.length) return null;

  return (
    <div>
      <div>
        <h1 className="text-2xl mt-8 dark:text-white text-secondary font-semibold mb-5">{title}</h1>
      </div>

      <GridContainer>
        {movies.map((movie) => {
          return <ListMovie key={movie.id} movie={movie} />;
        })}
      </GridContainer>
    </div>
  );
}

const ListMovie = ({ movie }) => {
  const { id, title, poster, reviews } = movie;
  return (
    <Link to={"/movie/" + id}>
      <img className="aspect-video object-cover" src={poster} alt={title} />

      <h1 className="text-lg dark:text-white text-secondary font-semibold" title={title}>
        {trimTitle(title)}
      </h1>
      {reviews?.ratingAvg ? (
        <p className="text-highlight dark:text-highlight-dark flex items-center space-x-1">
          <span>{reviews?.ratingAvg}</span>
          <AiFillStar />
        </p>
      ) : (
        <p className="text-highlight dark:text-highlight-dark">No reviews</p>
      )}
    </Link>
  );
};
