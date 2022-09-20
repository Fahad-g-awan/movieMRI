import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { getActors } from "../../api/actor";
import { useNotification } from "../../hooks";
import PrevAndNextButtons from "../PrevAndNextButtons";

let currentPageNo = 0;
let limit = 20;

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);

  const { updateNotification } = useNotification();

  const fetchActors = async (pageNo) => {
    const { profiles, error } = await getActors(limit, pageNo);

    if (error) return updateNotification("error", error);
    if (!profiles.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setActors([...profiles]);
  };

  const handleOnNextClick = () => {
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchActors(currentPageNo);
  };

  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo -= 1;
    fetchActors(currentPageNo);
  };

  useEffect(() => {
    fetchActors();
  }, []);

  return (
    <div className="p-5">
      <div className="grid grid-cols-4 gap-5">
        {actors.map((actor) => {
          return <ActorProfile key={actor.id} profile={actor} />;
        })}
      </div>

      <PrevAndNextButtons
        className="mt-5"
        onPrevClick={handleOnPrevClick}
        onNextClick={handleOnNextClick}
      />
    </div>
  );
}

const ActorProfile = ({ profile }) => {
  const [showOptions, setShowOptions] = useState(false);

  const acceptedNameLength = 15;

  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };
  const handleOnMouseLeave = () => {
    setShowOptions(false);
  };

  if (!profile) return null;

  const formatName = (name) => {
    if (name.length <= acceptedNameLength) return name;

    return name.substring(0, acceptedNameLength) + "...";
  };

  const { name, about = "", avatar } = profile;

  return (
    <div className="bg-white shadow dark:bg-secondary rounded h-20 overflow-hidden">
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className="flex cursor-pointer relative"
      >
        <img src={avatar} alt={name} className="w-20 aspect-square object-cover" />
        <div className="px-2">
          <h1 className="text-xl text-primary dark:text-white font-semibold whitespace-nowrap">
            {formatName(name)}
          </h1>
          <p className="text-primary dark:text-white opacity-70">{about.substring(0, 50)}...</p>
        </div>

        <ShowOptions visible={showOptions} />
      </div>
    </div>
  );
};

const ShowOptions = ({ visible, onDeleteClick, onEditClick }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-primary bg-opacity-20 backdrop-blur-sm flex justify-center items-center space-x-5">
      <button
        onClick={onDeleteClick}
        className="p-2 rounded-full bg-white text-primary  hover:opacity-80 transition"
        type="button"
      >
        <BsTrash />
      </button>
      <button
        onClick={onEditClick}
        className="p-2 rounded-full bg-white text-primary  hover:opacity-80 transition"
        type="button"
      >
        <BsPencilSquare />
      </button>
    </div>
  );
};
