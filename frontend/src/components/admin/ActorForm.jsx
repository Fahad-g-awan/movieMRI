import React from "react";
import { useState } from "react";
import { useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import PosterSelector from "../form/PosterSelector";
import Selector from "../Selector";
import { ImSpinner3 } from "react-icons/im";
import { useEffect } from "react";

const defaultActorInfo = {
  name: "",
  about: "",
  avatar: null,
  gender: "",
};

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
  { title: "Other", value: "other" },
];

const validateActor = ({ avatar, name, about, gender }) => {
  if (!name.trim()) return { error: "Actor name is missing!" };
  if (!about.trim()) return { error: "About section is empty!" };
  if (!gender.trim()) return { error: "Actor gender is missing!" };
  if (avatar && !avatar.type?.startsWith("image")) return { error: "Invalid image / avatar file!" };

  return { error: null };
};

export default function ActorForm({ title, btnTitle, onSubmit, busy, initialState }) {
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState("");

  const { updateNotification } = useNotification();

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedAvatarForUI(url);
  };

  const changeHandler = ({ target }) => {
    const { name, value, files } = target;

    if (name === "avatar") {
      const file = files[0];
      updatePosterForUI(file);
      return setActorInfo({ ...actorInfo, avatar: file });
    }

    setActorInfo({ ...actorInfo, [name]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const { error } = validateActor(actorInfo);

    if (error) return updateNotification("error", error);

    const formData = new FormData();

    for (let key in actorInfo) {
      if (key) formData.append(key, actorInfo[key]);
    }

    onSubmit(formData);
  };

  const { name, about, gender } = actorInfo;

  useEffect(() => {
    if (initialState) {
      setActorInfo({ ...initialState, avatar: null });
      setSelectedAvatarForUI(initialState.avatar);
    }
  }, [initialState]);

  return (
    <form onSubmit={submitHandler} className="dark:bg-primary bg-white p-3 w-[35rem] rounded">
      <div className="flex justify-between items-center mb-3">
        <h1 className="dark:text-white text-primary font-semibold text-xl">{title}</h1>

        <button className="bg-primary text-white dark:bg-white dark:text-primary h-8 w-24 hover:opacity-80 transition rounded flex items-center justify-center">
          {busy ? <ImSpinner3 className="animate-spin" /> : btnTitle}
        </button>
      </div>

      <div className="flex space-x-2">
        <PosterSelector
          selectedPoster={selectedAvatarForUI}
          label="Select Avatar"
          className="w-36 h-36 object-cover aspect-square"
          name="avatar"
          onChange={changeHandler}
        />

        <div className="flex-grow flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Enter Name"
            className={commonInputClasses + " border-b-2"}
            name="name"
            onChange={changeHandler}
            value={name}
          />
          <textarea
            placeholder="Enter about"
            className={commonInputClasses + " border-b-2 resize-none h-full custom-scroll-bar"}
            name="about"
            onChange={changeHandler}
            value={about}
          />
        </div>
      </div>

      <div className="mt-3">
        <Selector
          options={genderOptions}
          label="Gender"
          value={gender}
          onChange={changeHandler}
          name="gender"
        />
      </div>
    </form>
  );
}
