import React, { useState } from "react";
import { updateActor } from "../../api/actor";
import { useNotification } from "../../hooks";
import ActorForm from "../admin/ActorForm";
import ModalContainer from "./ModalContainer";

export default function UpdateActor({ visible, onClose, onSuccess, initialState }) {
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();

  const submitHandler = async (data) => {
    setBusy(true);
    const { error, actor } = await updateActor(initialState.id, data);
    setBusy(false);
    if (error) return updateNotification("error", error);
    onSuccess(actor);
    updateNotification("success", "Actor updated successfully");
    onClose();
  };
  return (
    <ModalContainer visible={visible} ignoreContainer>
      <ActorForm
        onClose={onClose}
        busy={busy}
        onSubmit={!busy ? submitHandler : null}
        title="Update Actor"
        btnTitle="Update"
        initialState={initialState}
      />
    </ModalContainer>
  );
}
