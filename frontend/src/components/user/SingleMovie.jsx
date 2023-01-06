import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSingleMovie } from "../../api/movie";
import { useAuth, useNotification } from "../../hooks";
import { convertReviewCount } from "../../utils/helper";
import Container from "../Container";
import CustomButtonLink from "../CustomButtonLink";
import AddRatingModel from "../modals/AddRatingModel";
import ProfileModal from "../modals/ProfileModal";
import RatingStar from "../RatingStar";
import RelatedMovies from "../RelatedMovies";

const covertDate = (date = "") => {
  return date.split("T")[0];
};

export default function SingleMovie() {
  const [ready, setReady] = useState(false);
  const [showRatingModel, setShowRatingModel] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});
  const [movie, setMovie] = useState({});

  const { movieId } = useParams();
  const { uodateNotification } = useNotification();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const navigate = useNavigate();

  const fetchMovie = async () => {
    const { error, movie } = await getSingleMovie(movieId);

    if (error) uodateNotification("error", error);
    setReady(true);
    setMovie(movie);
  };

  const handleOnRateMovie = () => {
    if (!isLoggedIn) return navigate("/auth/signin");
    setShowRatingModel(true);
  };

  const hideRatingModel = () => {
    setShowRatingModel(false);
  };

  const handleOnSuccessRating = (reviews) => {
    setMovie({ ...movie, reviews: { ...reviews } });
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const hideProfileModal = () => {
    setShowProfileModal(false);
  };

  useEffect(() => {
    if (movieId) fetchMovie();
  }, [movieId]);

  const {
    id,
    trailer,
    poster,
    title,
    storyLine,
    language,
    releaseDate,
    type,
    director = {},
    writers = [],
    reviews = {},
    cast = [],
    genres = [],
  } = movie;

  if (!ready)
    return (
      <div className="h-screen flex justify-center items-center dark:bg-primary bg-white">
        <p className="text-light-subtle dark:text-dark-subtle animate-pulse">Please Wait...</p>
      </div>
    );

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container className="xl:px-0 px-2">
        <video poster={poster} controls src={trailer}></video>

        <div className="flex justify-between">
          <h1 className="xl:text-4xl lg:text-3xl text-2xl text-highlight dark:text-highlight-dark font-semibold py-3">
            {title}
          </h1>

          <div className="flex flex-col items-end py-3">
            <div className="flex flex-row space-x-3">
              <CustomButtonLink
                label={convertReviewCount(reviews.reviewsCount) + " Reviews"}
                onClick={() => navigate("/movie/reviews/" + id)}
              />
              <RatingStar rating={reviews.ratingAvg} />
            </div>

            <CustomButtonLink label="Rate Movie" onClick={handleOnRateMovie} />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>

          {/* director */}
          <ListWithLabel label="Director:">
            <CustomButtonLink label={director.name} onClick={() => handleProfileClick(director)} />
          </ListWithLabel>

          {/* writers */}
          <ListWithLabel label="Writers:">
            {writers.map((w) => (
              <CustomButtonLink key={w.id} label={w.name} />
            ))}
          </ListWithLabel>

          {/* lead actors */}
          <ListWithLabel label="Lead Actors:">
            {cast.map(({ id, profile, leadActor }) => {
              return leadActor ? <CustomButtonLink label={profile.name} key={id} /> : null;
            })}
          </ListWithLabel>

          {/* language */}
          <ListWithLabel label="Language:">
            <CustomButtonLink label={language} clickAble={false} />
          </ListWithLabel>

          {/* release date */}
          <ListWithLabel label="Release Date:">
            <CustomButtonLink label={covertDate(releaseDate)} clickAble={false} />
          </ListWithLabel>

          {/* genres */}
          <ListWithLabel label="Genres:">
            {genres.map((g) => (
              <CustomButtonLink label={g} key={g} clickAble={false} />
            ))}
          </ListWithLabel>

          {/* types */}
          <ListWithLabel label="Type:">
            <CustomButtonLink label={type} clickAble={false} />
          </ListWithLabel>

          {/* cast and crew */}
          <CastProfiles cast={cast} />

          {/* related movies */}
          <RelatedMovies movieId={movieId} />
        </div>
      </Container>

      <ProfileModal
        visible={showProfileModal}
        onClose={hideProfileModal}
        profileId={selectedProfile.id}
      />

      <AddRatingModel
        visible={showRatingModel}
        onClose={hideRatingModel}
        onSuccess={handleOnSuccessRating}
      />
    </div>
  );
}

const ListWithLabel = ({ children, label }) => {
  return (
    <div className="flex space-x-2">
      <p className="text-light-subtle dark:text-dark-subtle font-semibold">{label}</p>
      {children}
    </div>
  );
};

const CastProfiles = ({ cast }) => {
  return (
    <div className="">
      <h1 className="text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2">
        Cast and Crew:
      </h1>
      <div className="flex flex-wrap space-x-4 mt-5">
        {cast.map(({ id, profile, roleAs }) => {
          return (
            <div key={id} className="flex basis-28 text-center mb-4 flex-col items-center">
              <img
                className="w-24 h-24 aspect-square object-cover rounded-full"
                src={profile.avatar}
              />

              <CustomButtonLink label={profile.name} />

              <span className="text-light-subtle dark:text-dark-subtle text-sm">As</span>
              <p className="text-light-subtle dark:text-dark-subtle">{roleAs}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
