import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { deleteReview, getReview } from "../../api/review";
import { useAuth, useNotification } from "../../hooks";
import Container from "../Container";
import CustomButtonLink from "../CustomButtonLink";
import ConfirmModal from "../modals/ConfirmModal";
import EdditRatingModel from "../modals/EditRatingModel";
import NotFound from "../NotFound";
import RatingStar from "../RatingStar";

const getNameInitial = (name = "") => {
  return name[0].toUpperCase();
};

export default function MovieReview() {
  const [reviews, setReviews] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [profileOwnerReview, setProfileOwnerReview] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModel, setShowEditModel] = useState(false);
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();
  const { movieId } = useParams();
  const { authInfo } = useAuth();

  const profileId = authInfo.profile?.id;

  const fetchReviews = async () => {
    const { movie, error } = await getReview(movieId);

    if (error) return updateNotification("error", error);

    setReviews([...movie.reviews]);
    setMovieTitle(movie.title);
  };

  const findProfileOwnerReview = () => {
    if (profileOwnerReview) return setProfileOwnerReview(null);

    const matched = reviews.find((review) => review.owner.ownerId === profileId);

    if (!matched) return updateNotification("error", "You don't have any review!");

    setProfileOwnerReview(matched);
  };

  const displayConfirmModal = () => setShowConfirmModal(true);
  const hideConfirmModal = () => setShowConfirmModal(false);

  const hideEditModel = () => {
    setShowEditModel(false);
    setSelectedReview(null);
  };

  const handleConfirmModal = async () => {
    setBusy(true);
    const { error, message } = await deleteReview(profileOwnerReview.id);
    setBusy(false);

    if (error) return updateNotification("error", error);

    updateNotification("success", message);

    const updatedReviews = reviews.filter((r) => r.id !== profileOwnerReview.id);

    setReviews([...updatedReviews]);
    setProfileOwnerReview(null);

    hideConfirmModal();
  };

  const handleOnEditClick = () => {
    const { id, content, rating } = profileOwnerReview;

    setSelectedReview({
      id,
      content,
      rating,
    });

    setShowEditModel(true);
  };

  const handleOnReviewUpdate = (review) => {
    const updatedReview = { ...profileOwnerReview, rating: review.rating, content: review.content };

    setProfileOwnerReview({ ...updatedReview });

    const newReviews = reviews.map((r) => {
      if (r.id === updatedReview.id) return updatedReview;

      return r;
    });

    setReviews([...newReviews]);
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
            {movieTitle}
          </h1>

          {profileId && (
            <CustomButtonLink
              onClick={findProfileOwnerReview}
              label={profileOwnerReview ? "View All" : "Find My Review"}
            />
          )}
        </div>

        <NotFound text="No Reviews!" visible={!reviews.length} />

        <div className="space-y-7 mt-5">
          {profileOwnerReview ? (
            <div>
              <ReviewCard review={profileOwnerReview} />

              <div className="flex space-x-3 dark:text-white text-primary text-xl p-3">
                <button type="button" onClick={displayConfirmModal}>
                  <BsTrash />
                </button>
                <button type="button" onClick={handleOnEditClick}>
                  <BsPencil />
                </button>
              </div>
            </div>
          ) : (
            reviews.map((review) => <ReviewCard review={review} key={review.id} />)
          )}
        </div>
      </Container>

      <ConfirmModal
        visible={showConfirmModal}
        onCancel={hideConfirmModal}
        onConfirm={handleConfirmModal}
        busy={busy}
        title="Are you sure?"
        subtitle="This action will remove this review permanently."
      />

      <EdditRatingModel
        visible={showEditModel}
        initialState={selectedReview}
        onSuccess={handleOnReviewUpdate}
        onClose={hideEditModel}
      />
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
