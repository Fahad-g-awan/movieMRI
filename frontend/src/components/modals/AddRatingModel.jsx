import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { addReview } from "../../api/review";
import { useNotification } from "../../hooks";
import RatingsForm from "../form/RatingsForm";
import ModalContainer from "./ModalContainer";

export default function AddRatingModel({ visible, onSuccess, onClose }) {
  const [busy, setBusy] = useState(false);

  const { movieId } = useParams();
  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, message, reviews } = await addReview(movieId, data);

    setBusy(false);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    onSuccess(reviews);
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingsForm onSubmit={handleSubmit} busy={busy} />
    </ModalContainer>
  );
}
