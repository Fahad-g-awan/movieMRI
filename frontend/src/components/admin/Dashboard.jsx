import React from "react";
import { useEffect } from "react";
import { useMovies } from "../../hooks";
import AppInfoBox from "../AppInfoBox";
import LatestUploads from "../LatestUploads";
import MostRatedMovies from "../MostRatedMovies";

export default function Dashboard() {
  const { appInfo, fetchAppInfo } = useMovies();

  useEffect(() => {
    fetchAppInfo();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-5 p-5">
      <AppInfoBox title="Total Uploads" subTitle={appInfo.movieCount.toLocaleString()} />
      <AppInfoBox title="Total Reviews" subTitle={appInfo.reviewCount.toLocaleString()} />
      <AppInfoBox title="Total Users" subTitle={appInfo.userCount.toLocaleString()} />

      <LatestUploads />
      <MostRatedMovies />
    </div>
  );
}
