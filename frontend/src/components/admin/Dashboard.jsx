import React from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNotification } from "../../hooks";

export default function Dashboard() {
  const { updateNotification } = useNotification();

  const changeHandler = (file) => {
    console.log(file);
  };

  const typeErrorHandler = (error) => {
    updateNotification("error", error);
  };

  return (
    <div className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto">
        <div className="h-full flex items-center justify-center">
          <FileUploader
            handleChange={changeHandler}
            onTypeError={typeErrorHandler}
            types={["mp4", "avi"]}
          >
            <div className="w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full flex items-center justify-center flex-col text-secondary dark:text-dark-subtle cursor-pointer">
              <AiOutlineCloudUpload size={80} />
              <p>Drops your files here</p>
            </div>
          </FileUploader>
        </div>
      </div>
    </div>
  );
}
