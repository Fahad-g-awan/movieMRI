import React from "react";
import MovieForm from "../admin/MovieForm";
import ModalContainer from "./ModalContainer";

export default function UpdateMovie({ visible, initialState, onClose }) {
  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <MovieForm initialState={initialState} />
    </ModalContainer>
  );
}
