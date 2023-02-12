import React from "react";
import { useState } from "react";
import { createActor } from "../../api/actor";
import { useActor, useNotification } from "../../hooks";
import ModalContainer from "../modals/ModalContainer";
import ActorForm from "./ActorForm";

export default function ActorModal({ onClose, visible }) {
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();
  const { fetchActors } = useActor();

  const submitHandler = async (data) => {
    setBusy(true);
    const { error, actor } = await createActor(data);
    setBusy(false);

    if (error) return updateNotification("error", error);

    updateNotification("success", "Actor created successfully");
    fetchActors();
    onClose();
  };
  return (
    <ModalContainer visible={visible} ignoreContainer>
      <ActorForm
        onClose={onClose}
        busy={busy}
        onSubmit={!busy ? submitHandler : null}
        title="Create New Actor"
        btnTitle="Create"
      />
    </ModalContainer>
  );
}
