import React, { useState } from "react";
import { useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import Submit from "../form/Submit";
import WritersModal from "../modals/WritersModal";
import CastModal from "../modals/CastModal";
import TagsInput from "../TagsInput";
import CastForm from "./CastForm";
import PosterSelector from "../form/PosterSelector";
import GenresSelector from "../GenresSelector";
import GenresModal from "../modals/GenresModal";
import Selector from "../Selector";
import { languageOptions, statusOptions, typeOptions } from "../../utils/options";
import Label from "../Lable";
import DirectorSelector from "./DirectorSelector";
import WriterSelector from "./WriterSelector";
import ViewAllBtn from "../ViewAllBtn";
import LabelWithBadge from "./LabelWithBadge";
import { validateMovie } from "../../utils/validator";
import { useEffect } from "react";

const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releaseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};

export default function MovieForm({ onSubmit, busy, btnTitle, initialState }) {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [selectedPosterForUI, setSelectedPosterForUI] = useState("");

  const { updateNotification } = useNotification();

  const changeHandler = ({ target }) => {
    const { name, value, files } = target;

    if (name === "poster") {
      const poster = files[0];
      updatePosterForUI(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }

    setMovieInfo({ ...movieInfo, [name]: value });
  };

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedPosterForUI(url);
  };

  const updateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags });
  };

  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
  };

  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  };

  const updateCast = (castInfo) => {
    const { cast } = movieInfo;
    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  };

  const updateWriters = (profile) => {
    const { writers } = movieInfo;

    for (let writer of writers) {
      if (writer.id === profile.id) {
        return updateNotification("warning", "This profile is already selected");
      }
    }

    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  };

  const hidewritersModal = () => {
    setShowWritersModal(false);
  };

  const displayWritersModal = () => {
    setShowWritersModal(true);
  };

  const hideCastModal = () => {
    setShowCastModal(false);
  };

  const displayCastModal = () => {
    setShowCastModal(true);
  };

  const writersRemoveHandler = (profileId) => {
    const { writers } = movieInfo;
    const newWriters = writers.filter(({ id }) => id !== profileId);

    if (!newWriters.length) hidewritersModal();

    setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  };

  const castRemoveHandler = (profileId) => {
    const { cast } = movieInfo;
    const newCast = cast.filter(({ profile }) => profile.id !== profileId);

    if (!newCast.length) hidewritersModal();

    setMovieInfo({ ...movieInfo, cast: [...newCast] });
  };

  const hideGenresModal = () => {
    setShowGenresModal(false);
  };

  const displayGenresModal = () => {
    setShowGenresModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { error } = validateMovie(movieInfo);

    if (error) return updateNotification("error", error);

    const { tags, genres, cast, writers, director, poster } = movieInfo;

    const formData = new FormData();
    const finalMovieInfo = { ...movieInfo };

    finalMovieInfo.tags = JSON.stringify(tags);
    finalMovieInfo.genres = JSON.stringify(genres);

    const finalCast = cast.map((c) => ({
      actor: c.profile.id,
      roleAs: c.roleAs,
      leadActor: c.leadActor,
    }));

    finalMovieInfo.cast = JSON.stringify(finalCast);

    if (writers.length) {
      const finalWriters = writers.map((w) => w.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }

    if (director.id) {
      finalMovieInfo.director = director.id;
    }

    if (poster) finalMovieInfo.poster = poster;

    for (let key in finalMovieInfo) {
      formData.append(key, finalMovieInfo[key]);
    }

    onSubmit(formData);
  };

  useEffect(() => {
    if (initialState) {
      setMovieInfo({
        ...initialState,
        releaseDate: initialState.releaseDate.split("T")[0],
        poster: null,
      });
      setSelectedPosterForUI(initialState.poster);
    }
  }, [initialState]);

  const { title, storyLine, writers, cast, tags, genres, type, language, status, releaseDate } =
    movieInfo;

  return (
    <>
      <div className="flex space-x-3">
        <div className="w-[70%] space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <input
              name="title"
              value={title}
              onChange={changeHandler}
              id="title"
              type="text"
              className={commonInputClasses + " border-b-2 font-semibold text-xl"}
              placeholder="Titanic"
            />
          </div>

          <div>
            <Label htmlFor="storyLine">Story line</Label>
            <textarea
              name="storyLine"
              value={storyLine}
              onChange={changeHandler}
              id="storyLine"
              className={commonInputClasses + " border-b-2 resize-none h-24 custom-scroll-bar"}
              placeholder="Movie storyline..."
            ></textarea>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput value={tags} onChange={updateTags} />
          </div>

          <DirectorSelector onSelect={updateDirector} />

          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length}>Add cast & crew</LabelWithBadge>
              <ViewAllBtn onClick={displayCastModal} visible={cast.length}>
                View All
              </ViewAllBtn>
            </div>
            <CastForm onSubmit={updateCast} />
          </div>

          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor="writers">
                Writers
              </LabelWithBadge>
              <ViewAllBtn onClick={displayWritersModal} visible={writers.length}>
                View All
              </ViewAllBtn>
            </div>
            <WriterSelector onSelect={updateWriters} />
          </div>

          <input
            type="date"
            name="releaseDate"
            onChange={changeHandler}
            className={commonInputClasses + " border-2 rounded p-1 w-auto"}
            value={releaseDate}
          />

          <Submit busy={busy} type="button" value={btnTitle} onClick={handleSubmit} />
        </div>

        <div className="w-[30%] space-y-5">
          <PosterSelector
            name="poster"
            label="Select Poster"
            onChange={changeHandler}
            selectedPoster={selectedPosterForUI}
            accept="image/jpg, image/jpej, image/png"
          />

          <GenresSelector badge={genres.length} onClick={displayGenresModal} />

          <Selector
            onChange={changeHandler}
            value={type}
            name="type"
            options={typeOptions}
            label="Type"
          />
          <Selector
            onChange={changeHandler}
            value={language}
            name="language"
            options={languageOptions}
            label="Language"
          />
          <Selector
            onChange={changeHandler}
            value={status}
            name="status"
            options={statusOptions}
            label="Status"
          />
        </div>
      </div>

      <WritersModal
        visible={showWritersModal}
        profiles={writers}
        onClose={hidewritersModal}
        onRemove={writersRemoveHandler}
      />

      <CastModal
        visible={showCastModal}
        cast={cast}
        onClose={hideCastModal}
        onRemove={castRemoveHandler}
      />

      <GenresModal
        previousGenre={genres}
        onSubmit={updateGenres}
        visible={showGenresModal}
        onClose={hideGenresModal}
      />
    </>
  );
}
