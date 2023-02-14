import React from "react";
import GridContainer from "../GridContainer";
import { AiFillStar } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import RatingStar from "../RatingStar";
import { getPoster } from "../../utils/helper";

const trimTitle = (text = "") => {
  if (text.length <= 20) return text;

  return text.substring(0, 20) + "..";
};

export default function MovieList({ title, movies = [], type }) {
  const navigate = useNavigate();

  if (!movies.length) return null;

  let className = "";
  if (type) className = " cursor-pointer";

  const onClickHandler = () => {
    navigate("/movie/all-public-movies?type=" + type);
  };

  return (
    <div className="relative space-y-3">
      {title && (
        <h1
          className={
            "text-2xl dark:text-highlight-dark text-secondary font-semibold  hover:border-b w-fit dark:border-highlight-dark border-secondary box-border absolute -top-7" +
            className
          }
          onClick={onClickHandler}
        >
          {title}
        </h1>
      )}

      <GridContainer className="pb-6 pt-3">
        {movies.map((movie) => {
          return <ListMovie key={movie.id} movie={movie} />;
        })}
      </GridContainer>
    </div>
  );
}

const ListMovie = ({ movie }) => {
  const { id, title, poster, reviews, responsivePosters } = movie;

  return (
    <Link to={"/movie/" + id}>
      <img
        className="aspect-video object-cover w-full"
        src={getPoster(responsivePosters) || poster}
        alt={title}
      />

      <h1 className="text-lg dark:text-white text-secondary font-semibold" title={title}>
        {trimTitle(title)}
      </h1>

      <RatingStar rating={reviews.ratingAvg} />
    </Link>
  );
};
