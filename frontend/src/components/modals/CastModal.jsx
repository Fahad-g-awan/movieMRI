import React from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import ModalContainer from "./ModalContainer";

export default function castModal({ cast = [], visible, onClose, onRemove }) {
  if (!cast.length) return null;

  return (
    <ModalContainer ignoreContainer visible={visible}>
      <div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2 custom-scroll-bar">
        <div className="flex justify-between dark:text-white text-primary font-semibold bg-secondary p-1">
          <h1>All Cast</h1>
          <p onClick={onClose} className="cursor-pointer text-red-600 opacity-90 hover:opacity-100">
            Close
          </p>
        </div>

        {cast.map(({ profile, roleAs, leadActor }) => {
          const { id, name, avatar } = profile;

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
              <div className="w-full flex flex-col justify-between py-1">
                <div>
                  <p className="dark:text-white text-primary font-semibold">{name}</p>
                  <p className="dark:text-dark-subtle text-light-subtle">{roleAs}</p>
                </div>

                {leadActor && (
                  <AiOutlineCheck className="text-light-subtle dark:text-dark-subtle" />
                )}
              </div>
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
