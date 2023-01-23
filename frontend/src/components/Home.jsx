import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "./Container";
import CustomButtonLink from "./CustomButtonLink";
import AllMovies from "./user/AllMovies";
import HeroSlideShow from "./user/HeroSlideShow";
import NotVerified from "./user/NotVerified";
import TopRatedMovies from "./user/TopRatedMovies";
import TopRatedTVSeries from "./user/TopRatedTvSeries";
import TopRatedWebSeries from "./user/TopRatedWebSeries";

// Main component
export default function Home() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/movie/all-public-movies");
  };

  // Render UI
  return (
    <div className="dark:bg-primary bg-white min-h-screen">
      <Container className="px-2 xl:p-0">
        <NotVerified />
        <HeroSlideShow />
        <div className="space-y-3 py-8">
          <TopRatedMovies />
          <TopRatedWebSeries />
          <TopRatedTVSeries />

          <div className="py-8 pt-10 text-center">
            <button
              onClick={handleNavigation}
              className="text-highlight dark:text-highlight-dark border rounded-md dark:border-highlight-dark border-highlight outline-none opacity-80 hover:opacity-100 p-5"
            >
              View All Movies & Web Series
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
