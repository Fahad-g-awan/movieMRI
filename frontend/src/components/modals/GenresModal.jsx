import React, { useState } from "react";
import { useEffect } from "react";
import genres from "../../utils/genres";
import Submit from "../form/Submit";
import ModalContainer from "./ModalContainer";

export default function GenresModal({ visible, previousGenre, onClose, onSubmit }) {
  const [selectedgenres, setSelectedGenre] = useState([]);

  const genreSelectorHanler = (gen) => {
    let newGenre = [];

    if (selectedgenres.includes(gen)) {
      newGenre = selectedgenres.filter((genre) => genre !== gen);
    } else {
      newGenre = [...selectedgenres, gen];
    }

    setSelectedGenre([...newGenre]);
  };

  const submitHandler = () => {
    onSubmit(selectedgenres);
    onClose();
  };

  const handleClose = () => {
    setSelectedGenre(previousGenre);
    onClose();
  };

  useEffect(() => {
    setSelectedGenre(previousGenre);
  }, []);

  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <div>
            <h1 className="dark:text-white text-primary text-2xl text-center font-semibold">
              Select Genres
            </h1>
            <div className="space-y-3">
              {genres.map((genre) => {
                return (
                  <Genre
                    key={genre}
                    selectedStyle={selectedgenres.includes(genre)}
                    onClick={() => genreSelectorHanler(genre)}
                  >
                    {genre}
                  </Genre>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-56 self-end">
          <Submit type="button" value="Select" onClick={submitHandler} />
        </div>
      </div>
    </ModalContainer>
  );
}

const Genre = ({ children, selectedStyle, onClick }) => {
  const getSelectedStyle = () => {
    return selectedStyle
      ? "dark:bg-white dark:text-primary bg-light-subtle text-white"
      : "dark:text-white text-primary";
  };
  return (
    <button
      onClick={onClick}
      className={
        getSelectedStyle() +
        " border-2 dark:border-dark-subtle border-light-subtle p-1 rounded mr-3"
      }
    >
      {children}
    </button>
  );
};
