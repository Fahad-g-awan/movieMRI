import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { uploadTrailer } from "../../api/movie";
import { useNotification } from "../../hooks";

// Main component
export default function MovieUpload() {
  const [videoSelected, setVideoSelected] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [uploadProgress, setUploadProgree] = useState(0);

  const { updateNotification } = useNotification();

  // Change handler
  const changeHandler = async (file) => {
    const formData = new FormData();
    formData.append("video", file);
    setVideoSelected(true);
    const res = await uploadTrailer(formData, setUploadProgree);

    if (!res.error) {
      setVideoUploaded(true);
    }
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

  // Render UI
  return (
    <div className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto">
        <UploadProgress
          visible={!videoUploaded && videoSelected}
          message={getUploadProgressValue()}
          width={uploadProgress}
        />
        <TrailerUploader
          visible={!videoSelected}
          handleChange={changeHandler}
          onTypeError={typeErrorHandler}
        />
      </div>
    </div>
  );
}

// Trailer upload comonent
const TrailerUploader = ({ visible, handleChange, onTypeError }) => {
  if (!visible) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <p className="mb-2 dark:text-slate-200 text-light-subtle font-semibold">
        Upload Movie Trailer
      </p>
      <FileUploader handleChange={handleChange} onTypeError={onTypeError} types={["mp4", "avi"]}>
        <div className="w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full flex items-center justify-center flex-col text-secondary dark:text-dark-subtle cursor-pointer">
          <AiOutlineCloudUpload size={80} />
          <p>Drops your files here</p>
        </div>
      </FileUploader>
    </div>
  );
};

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
