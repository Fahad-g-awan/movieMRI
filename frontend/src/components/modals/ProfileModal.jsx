import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getActorProfile } from "../../api/actor";
import { useNotification } from "../../hooks";
import ModalContainer from "./ModalContainer";

export default function ProfileModal({ visible, onClose, profileId }) {
  const [profile, setProfile] = useState({});

  const { updateNotification } = useNotification();

  const fetchActorProfile = async () => {
    const { error, actor } = await getActorProfile(profileId);

    if (error) return updateNotification("error", error);

    setProfile(actor);
  };

  const { avatar, name, about } = profile;

  useEffect(() => {
    setProfile({});
    if (profileId) fetchActorProfile();
  }, [profileId]);

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <div className="w-72 p-5 rounded bg-white flex flex-col items-center dark:bg-primary space-y-3">
        <img src={avatar} className="w-28 h-28 rounded-full" />

        <h1 className="text-primary dark:text-white font-semibold">{name}</h1>
        <p className="dark:text-dark-subtle text-light-subtle ">{about}</p>
      </div>
    </ModalContainer>
  );
}
