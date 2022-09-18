import React from "react";

export default function LatestUploads() {
  return (
    <div className="bg-white shadow dark:bg-secondary p-5 rounded col-span-2">
      <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">Recent Uploads</h1>

      <MovieListItem />
    </div>
  );
}

const MovieListItem = () => {
  return (
    <table className="w-full border-b">
      <tbody>
        <tr>
          <td>
            <img
              className="w-24 aspect-video"
              src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRBkxgl2A2PhE_6tklFLT0bxn5NLhvhsnpXGhmXBt_zotrlVHmo"
              alt=""
            />
          </td>
          <td>
            <div>
              <h1 className="text-lg font-semibold text-primary dark:text-white">
                Lorem ipsum dolor sit amet.
              </h1>
              <div className="space-x-1">
                <span className="text-primary dark:text-white text-xs">Lorem</span>
                <span className="text-primary dark:text-white text-xs">Lorem</span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
