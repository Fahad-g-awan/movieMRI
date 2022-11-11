import React from "react";
import Container from "./Container";
import HeroSlideShow from "./user/HeroSlideShow";
import NotVerified from "./user/NotVerified";
import TopRatedMovies from "./user/TopRatedMovies";
import TopRatedTVSeries from "./user/TopRatedTvSeries";
import TopRatedWebSeries from "./user/TopRatedWebSeries";

// Main component
export default function Home() {
  // Render UI
  return (
    <div className="dark:bg-primary bg-white min-h-screen">
      <Container>
        <NotVerified />
        <HeroSlideShow />
        <TopRatedMovies />
        <TopRatedWebSeries />
        <TopRatedTVSeries />
      </Container>
    </div>
  );
}
