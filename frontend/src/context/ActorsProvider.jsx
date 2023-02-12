import React, { useState } from "react";
import { createContext } from "react";
import { getActors } from "../api/actor";
import { useNotification } from "../hooks";

export const actorContext = createContext();

let currentPageNo = 0;
let limit = 20;

export default function ActorsProvider({ children }) {
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

  const handleOnUpdateActor = (profile) => {
    const updatedActors = actors.map((actor) => {
      if (profile.id === actor.id) {
        return profile;
      }
      return actor;
    });

    setActors([...updatedActors]);
  };

  return (
    <actorContext.Provider
      value={{ fetchActors, actors, handleOnNextClick, handleOnPrevClick, handleOnUpdateActor }}
    >
      {children}
    </actorContext.Provider>
  );
}
