import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { uploadMovie, uploadTrailer } from "../../api/movie";
import { useMovies, useNotification } from "../../hooks";
import ModalContainer from "../modals/ModalContainer";
import MovieForm from "./MovieForm";

// Main component
export default function MovieUpload({ visible, onClose }) {
  const [videoSelected, setVideoSelected] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState({});
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();
  const { fetchLatestUploads, fetchAppInfo, fetchMovies } = useMovies();

  const resetState = () => {
    setVideoSelected(false);
    setVideoUploaded(false);
    setUploadProgress(0);
    setVideoInfo({});
  };

  // Video handler
  const uploadTrailerHandler = async (data) => {
    const { error, url, public_id } = await uploadTrailer(data, setUploadProgress);

    if (error) updateNotification("error", error);

    setVideoUploaded(true);
    setVideoInfo({ url, public_id });
  };

  // Change handler
  const changeHandler = (file) => {
    const formData = new FormData();
    formData.append("video", file);
    setVideoSelected(true);
    uploadTrailerHandler(formData);
  };

  // Type error handler
  const typeErrorHandler = (error) => {
    updateNotification("error", error);
  };

  // Upload progress
  const getUploadProgressValue = () => {
    if (!videoUploaded && uploadProgress >= 100) {
      return "Processing";
    }

    return `Uploading progress ${uploadProgress}%`;
  };

  const submitHandler = async (data) => {
    if (!videoInfo.url || !videoInfo.public_id)
      updateNotification("error", "Movie trailer is missing");

    setBusy(true);
    data.append("trailer", JSON.stringify(videoInfo));
    const { error, movie } = await uploadMovie(data);
    setBusy(false);
    if (error) return updateNotification("error", error);

    updateNotification("success", "Movie uploaded successfully");
    fetchLatestUploads();
    fetchAppInfo();
    fetchMovies();
    resetState();

    onClose();
  };

  // Main UI
  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div className="mb-5">
        <UploadProgress
          visible={!videoUploaded && videoSelected}
          message={getUploadProgressValue()}
          width={uploadProgress}
        />
      </div>
      {!videoSelected ? (
        <TrailerUploader
          visible={!videoSelected}
          handleChange={changeHandler}
          onTypeError={typeErrorHandler}
        />
      ) : (
        <MovieForm busy={busy} btnTitle="Upload" onSubmit={!busy ? submitHandler : null} />
      )}
    </ModalContainer>
  );
}

// Trailer upload comonent
const TrailerUploader = ({ visible, handleChange, onTypeError }) => {
  if (!visible) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <p className="mb-2 dark:text-slate-200 text-light-subtle text-lg font-light">
        Upload Movie Trailer
      </p>
      <FileUploader handleChange={handleChange} onTypeError={onTypeError} types={["mp4", "avi"]}>
        <label className="w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full flex items-center justify-center flex-col text-secondary dark:text-dark-subtle cursor-pointer">
          <AiOutlineCloudUpload size={80} />
          <p>Drops your files here</p>
        </label>
      </FileUploader>
    </div>
  );
};

// Upload progress component
const UploadProgress = ({ width, message, visible }) => {
  if (!visible) return null;

  return (
    <div className="dark:bg-secondary bg-white drop-shadow-lg rounded p-2">
      <div className="relative overflow-auto dark:bg-dark-subtle bg-light-subtle h-3">
        <div
          style={{ width: width + "%" }}
          className="h-full absolute left-0 dark:bg-white bg-secondary"
        />
      </div>
      <p className="font-semibold text-center dark:text-dark-subtle text-light-subtle animate-pulse mt-2">
        {message}
      </p>
    </div>
  );
};
