import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { updateReview } from "../../api/review";
import { useNotification } from "../../hooks";
import RatingsForm from "../form/RatingsForm";
import ModalContainer from "./ModalContainer";

export default function EdditRatingModel({ visible, initialState, onSuccess, onClose }) {
  const [busy, setBusy] = useState(false);
  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { message, error } = await updateReview(initialState.id, data);
    setBusy(false);

    if (error) return updateNotification("error", error);

    onSuccess({ ...data });
    updateNotification("success", message);
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onclose} ignoreContainer>
      <RatingsForm busy={busy} initialState={initialState} onSubmit={handleSubmit} />
    </ModalContainer>
  );
}
