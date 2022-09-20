import React from "react";
import { BsTrash, BsPencilSquare, BsBoxArrowUpRight } from "react-icons/bs";

export default function LatestUploads() {
  return (
    <div className="bg-white shadow dark:bg-secondary p-5 rounded col-span-2">
      <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">Recent Uploads</h1>

      <MovieListItem
        movie={{
          poster:
            "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRBkxgl2A2PhE_6tklFLT0bxn5NLhvhsnpXGhmXBt_zotrlVHmo",
          title: "lorem lorem lorem",
          status: "Public",
          genres: ["Action", "Comedy"],
        }}
      />
    </div>
  );
}

const MovieListItem = ({ movie, onDeleteClick, onOpenClick, onEditClick }) => {
  const { poster, title, genres = [], status } = movie;
  return (
    <table className="w-full border-b">
      <tbody>
        <tr>
          <td>
            <div className="w-24">
              <img className="w-full aspect-video object-cover" src={poster} alt={title} />
            </div>
          </td>
          <td className="w-full pl-5">
            <div>
              <h1 className="text-lg font-semibold text-primary dark:text-white">{title}</h1>
              <div className="space-x-1">
                {genres.map((g, index) => {
                  return (
                    <span key={g + index} className="text-primary dark:text-white text-xs">
                      {g}
                    </span>
                  );
                })}
              </div>
            </div>
          </td>
          <td className="px-5">
            <p className="text-primary dark:text-white">{status}</p>
          </td>
          <td>
            <div className="flex items-center space-x-3 text-primary dark:text-white text-lg">
              <button type="button" onClick={onDeleteClick}>
                <BsTrash />
              </button>
              <button type="button" onClick={onEditClick}>
                <BsPencilSquare />
              </button>
              <button type="button" onClick={onOpenClick}>
                <BsBoxArrowUpRight />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
