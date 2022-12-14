import React, { useState } from "react";
import { searchActor } from "../../api/actor";
import { useNotification, useSearch } from "../../hooks";
import { renderItem } from "../../utils/helper";
import { commonInputClasses } from "../../utils/theme";
import LiveSearch from "./LiveSearch";

const defaultCastInfo = {
  profile: {},
  roleAs: "",
  leadActor: false,
};

export default function CastForm({ onSubmit }) {
  const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
  const [profiles, setProfiles] = useState([]);

  const { updateNotification } = useNotification();
  const { handleSearch, resetSearch } = useSearch();

  const changeHandler = ({ target }) => {
    const { checked, name, value } = target;

    if (name === "leadActor") {
      return setCastInfo({ ...defaultCastInfo, leadActor: checked });
    }

    setCastInfo({ ...castInfo, [name]: value });
  };

  const profileSelectHandler = (profile) => {
    setCastInfo({ ...castInfo, profile });
  };

  const submitHandler = () => {
    const { roleAs, profile } = castInfo;

    if (!profile.name) return updateNotification("error", "Cast profile not selected");
    if (!roleAs.trim()) return updateNotification("error", "Cast role not added");

    onSubmit(castInfo);
    setCastInfo({ ...defaultCastInfo, profile: { name: "" } });
    resetSearch();
    setProfiles([]);
  };

  const handleProfileChange = ({ target }) => {
    const { value } = target;
    const { profile } = castInfo;
    profile.name = value;
    setCastInfo({ ...castInfo, ...profile });
    handleSearch(searchActor, value, setProfiles);
  };

  const { leadActor, roleAs, profile } = castInfo;

  return (
    <div className="flex flex-col">
      <div className="items-center space-x-2">
        <label htmlFor="leadActor" className="dark:text-dark-subtle text-light-subtle text-sm">
          Lead actor
        </label>
        <input
          type="checkbox"
          name="leadActor"
          className="w-4 h-4"
          checked={leadActor}
          onChange={changeHandler}
          title="Set as lead role"
        />
      </div>

      <div className="flex items-center space-x-2">
        <LiveSearch
          placeholder="Search Profile"
          value={profile.name}
          results={profiles}
          onSelect={profileSelectHandler}
          onChange={handleProfileChange}
          renderItem={renderItem}
        />

        <span className="dark:text-dark-subtle text-light-subtle font-semibold">as</span>

        <div className="flex-grow">
          <input
            type="text"
            className={commonInputClasses + " rounded text-lg border-2 p-1"}
            placeholder="Role as"
            name="roleAs"
            value={roleAs}
            onChange={changeHandler}
          />
        </div>

        <button
          onClick={submitHandler}
          type="button"
          className="bg-secondary dark:bg-white dark:text-primary text-white rounded px-1"
        >
          Add
        </button>
      </div>
    </div>
  );
}
