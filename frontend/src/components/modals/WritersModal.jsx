import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import ModalContainer from "./ModalContainer";

export default function writersModal({ profiles = [], visible, onClose, onRemove }) {
  return (
    <ModalContainer ignoreContainer visible={visible}>
      <div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2 custom-scroll-bar">
        <div className="flex justify-between dark:text-white text-primary font-semibold bg-secondary p-1">
          <h1>All Writers</h1>
          <p onClick={onClose} className="cursor-pointer text-red-600 opacity-90 hover:opacity-100">
            Close
          </p>
        </div>

        {profiles.map(({ id, avatar, name }) => {
          return (
            <div
              key={id}
              className="flex space-x-3 dark:bg-secondary bg-white drop-shadow-md rounded"
            >
              <img
                src={avatar}
                alt={name}
                className="h-16 w-16 aspect-square object-cover rounded"
              />
              <p className="dark:text-white text-primary font-semibold w-full">{name}</p>
              <button
                onClick={() => onRemove(id)}
                className="dark:text-white text-primary hover:opacity-80 p-2 transition"
              >
                <AiOutlineClose />
              </button>
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
}
