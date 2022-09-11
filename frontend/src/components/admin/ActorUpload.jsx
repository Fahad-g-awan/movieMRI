import React from "react";
import { useState } from "react";
import { createActor } from "../../api/actor";
import { useNotification } from "../../hooks";
import ModalContainer from "../modals/ModalContainer";
import ActorForm from "./ActorForm";

export default function ActorModal({ onClose, visible }) {
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();

  const submitHandler = async (data) => {
    setBusy(true);
    const { error, actor } = await createActor(data);
    setBusy(false);

    if (error) return updateNotification("error", error);

    updateNotification("success", "Actor created successfully");
    onClose();
  };
  return (
    <ModalContainer onClose={onClose} visible={visible} ignoreContainer>
      <ActorForm
        busy={busy}
        onSubmit={!busy ? submitHandler : null}
        title="Create New Actor"
        btnTitle="Create"
      />
    </ModalContainer>
  );
}
