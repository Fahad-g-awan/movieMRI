import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { deleteActor, searchActor } from "../../api/actor";
import { useActor, useNotification, useSearch } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";
import UpdateActor from "../modals/UpdateActor";
import NotFoundText from "../NotFoundText";
import PrevAndNextButtons from "../PrevAndNextButtons";
import ConfirmModal from "../modals/ConfirmModal";

let currentPageNo = 0;
let limit = 20;

export default function Actors() {
  const [results, setResults] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProfile, SetSelectedProfile] = useState(null);
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();
  const { handleSearch, resetSearch, resultNotFound } = useSearch();
  const { actors, fetchActors, handleOnNextClick, handleOnPrevClick, handleOnUpdateActor } =
    useActor();

  const fetchProfiles = async (pageNo) => fetchActors(pageNo);

  const handleOnEditClick = (actor) => {
    setShowUpdateModal(true);
    SetSelectedProfile(actor);
  };

  const handleOnDeleteClick = (actor) => {
    SetSelectedProfile(actor);
    setShowConfirmModal(true);
  };

  const hideUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleOnSearchSubmit = (value) => {
    handleSearch(searchActor, value, setResults);
  };

  const handleOnSearchFormReset = () => {
    resetSearch();
    setResults([]);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleOnConfirmDelete = async () => {
    setBusy(true);
    const { error, message } = await deleteActor(selectedProfile.id);
    setBusy(false);

    if (error) return updateNotification("error", message);
    updateNotification("success", message);

    hideConfirmModal();

    fetchProfiles(currentPageNo);
  };

  useEffect(() => {
    fetchProfiles(currentPageNo);
  }, []);

  return (
    <>
      <div className="p-5">
        <div className="flex justify-end">
          <AppSearchForm
            onSubmit={handleOnSearchSubmit}
            placeholder="Search Actors..."
            showRestIcon={results.length || resultNotFound}
            onReset={handleOnSearchFormReset}
          />
        </div>
        <NotFoundText text="No results found" visible={resultNotFound} />

        <div className="grid grid-cols-4 gap-5 mt-5">
          {results.length || resultNotFound
            ? results.map((actor) => {
                return (
                  <ActorProfile
                    key={actor.id}
                    profile={actor}
                    onEditClick={() => handleOnEditClick(actor)}
                    onDeleteClick={() => handleOnDeleteClick(actor)}
                  />
                );
              })
            : actors.map((actor) => {
                return (
                  <ActorProfile
                    key={actor.id}
                    profile={actor}
                    onEditClick={() => handleOnEditClick(actor)}
                    onDeleteClick={() => handleOnDeleteClick(actor)}
                  />
                );
              })}
        </div>

        {!results.length && !resultNotFound ? (
          <PrevAndNextButtons
            className="mt-5"
            onPrevClick={handleOnPrevClick}
            onNextClick={handleOnNextClick}
          />
        ) : null}
      </div>

      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        onConfirm={handleOnConfirmDelete}
        onCancel={hideConfirmModal}
        busy={busy}
        subtitle="This action will delete profile permanently"
      />

      <UpdateActor
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        initialState={selectedProfile}
        onSuccess={handleOnUpdateActor}
      />
    </>
  );
}

const ActorProfile = ({ profile, onEditClick, onDeleteClick }) => {
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
          <p className="text-primary dark:text-white opacity-70">
            {about.substring(0, 25) + "..."}
          </p>
        </div>

        <Options visible={showOptions} onDeleteClick={onDeleteClick} onEditClick={onEditClick} />
      </div>
    </div>
  );
};

const Options = ({ visible, onDeleteClick, onEditClick }) => {
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
