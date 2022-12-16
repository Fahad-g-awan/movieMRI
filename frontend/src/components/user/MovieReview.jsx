import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getReview } from "../../api/review";
import { useAuth, useNotification } from "../../hooks";
import Container from "../Container";
import CustomButtonLink from "../CustomButtonLink";
import RatingStar from "../RatingStar";

const getNameInitial = (name = "") => {
  return name[0].toUpperCase();
};

export default function MovieReview() {
  const [reviews, setReviews] = useState([]);
  const [profileOwnerReview, setProfileOwnerReview] = useState(null);

  const { updateNotification } = useNotification();
  const { movieId } = useParams();
  const { authInfo } = useAuth();

  const profileId = authInfo.profile?.id;

  const fetchReviews = async () => {
    const { reviews, error } = await getReview(movieId);

    if (error) return updateNotification("error", error);

    setReviews([...reviews]);
  };

  const findProfileOwnerReview = () => {
    if (profileOwnerReview) return setProfileOwnerReview(null);

    const matched = reviews.find((review) => review.owner.ownerId === profileId);

    if (!matched) return updateNotification("error", "You don't have any review!");

    setProfileOwnerReview(matched);
  };

  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId]);

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container className="xl:px-0 px-2 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold dark:text-white text-secondary">
            <span className="text-light-subtle dark:text-dark-subtle font-normal">
              Reviews for:
            </span>{" "}
            This is the title
          </h1>

          {profileId && (
            <CustomButtonLink
              onClick={findProfileOwnerReview}
              label={profileOwnerReview ? "Find All" : "Find My Review"}
            />
          )}
        </div>

        <div className="space-y-3 mt-5">
          {profileOwnerReview ? (
            <ReviewCard review={profileOwnerReview} />
          ) : (
            reviews.map((review) => <ReviewCard review={review} key={review.id} />)
          )}
        </div>
      </Container>
    </div>
  );
}

const ReviewCard = ({ review }) => {
  if (!review) return null;

  const { owner, content, rating } = review;

  return (
    <div className="flex space-x-3">
      <div className="flex justify-center items-center w-14 h-14 rounded-full bg-light-subtle dark:bg-dark-subtle text-white text-xl select-none">
        {getNameInitial(owner.name)}
      </div>

      <div>
        <h1 className="dark:text-white text-secondary font-semibold text-lg ">{owner.name}</h1>
        <RatingStar rating={rating} />
        <p className="text-light-subtle dark:text-dark-subtle">{content}</p>
      </div>
    </div>
  );
};
