import React from "react";
import MovieListItem from "./MovieListItem";

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