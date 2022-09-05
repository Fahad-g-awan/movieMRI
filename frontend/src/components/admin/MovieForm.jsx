import React, { useState } from "react";
import { useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import Submit from "../form/Submit";
import WritersModal from "../modals/WritersModal";
import CastModal from "../modals/CastModal";
import TagsInput from "../TagsInput";
import CastForm from "./CastForm";
import LiveSearch from "./LiveSearch";
import PosterSelector from "../form/PosterSelector";
import GenresSelector from "../GenresSelector";
import GenresModal from "../modals/GenresModal";
import Selector from "../Selector";
import { languageOptions, statusOptions, typeOptions } from "../../utils/options";

export const results = [
  {
    id: "1",
    avatar:
      "https://images.unsplash.com/photo-1643713303351-01f540054fd7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "John Doe",
  },
  {
    id: "2",
    avatar:
      "https://images.unsplash.com/photo-1643883135036-98ec2d9e50a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Chandri Anggara",
  },
  {
    id: "3",
    avatar:
      "https://images.unsplash.com/photo-1578342976795-062a1b744f37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Amin RK",
  },
  {
    id: "4",
    avatar:
      "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Edward Howell",
  },
  {
    id: "5",
    avatar:
      "https://images.unsplash.com/photo-1578342976795-062a1b744f37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Amin RK",
  },
  {
    id: "6",
    avatar:
      "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Edward Howell",
  },
];

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

export const renderItem = (result) => {
  return (
    <div className="flex rounded overflow-hidden">
      <img src={result.avatar} alt="" className="w-16 h-16 object-cover" />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </div>
  );
};

export default function MovieForm() {
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

    console.log(movieInfo);
  };

  const { title, storyLine, director, writers, cast, tags, genres, type, language, status } =
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
            <Label htmlFor="director">Director</Label>
            <LiveSearch
              name="director"
              value={director.name}
              results={results}
              placeholder="Search profile"
              renderItem={renderItem}
              onSelect={updateDirector}
            />
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
            <LiveSearch
              name="writers"
              results={results}
              placeholder="Search profile"
              renderItem={renderItem}
              onSelect={updateWriters}
            />
          </div>

          <input
            type="date"
            name="releaseDate"
            onChange={changeHandler}
            className={commonInputClasses + " border-2 rounded p-1 w-auto"}
          />

          <Submit type="button" value="Upload" onClick={handleSubmit} />
        </div>

        <div className="w-[30%] space-y-5">
          <PosterSelector
            name="poster"
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
            lable="Type"
          />
          <Selector
            onChange={changeHandler}
            value={language}
            name="language"
            options={languageOptions}
            lable="Language"
          />
          <Selector
            onChange={changeHandler}
            value={status}
            name="status"
            options={statusOptions}
            lable="Status"
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

const Label = ({ children, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="dark:text-dark-subtle text-light-subtle font-semibold">
      {children}
    </label>
  );
};

const LabelWithBadge = ({ children, htmlFor, badge = 0 }) => {
  const renderBadge = () => {
    if (!badge) return null;

    return (
      <span className="dark:bg-dark-subtle bg-light-subtle absolute text-white top-0 right-0 translate-x-4 -translate-y-1 text-xs w-5 h-5 rounded-full flex justify-center items-center">
        {badge <= 9 ? badge : "9+"}
      </span>
    );
  };
  return (
    <div className="relative">
      <Label htmlFor={htmlFor} className>
        {children}
      </Label>
      {renderBadge()}
    </div>
  );
};

const ViewAllBtn = ({ onClick, children, visible }) => {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="dark:text-white text-primary hover:underline transition"
    >
      {children}
    </button>
  );
};
