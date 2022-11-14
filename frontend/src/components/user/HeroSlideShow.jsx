import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";

let count = 0;

export default function HeroSlideShow() {
  const [slide, setSlide] = useState({});
  const [cloneSlide, setCloneSlide] = useState({});
  const [movies, setMovies] = useState([]);

  const { updateNotification } = useNotification();
  const slideRef = useRef();
  const cloneSlideRef = useRef();

  const fetchLatestUploads = async () => {
    const { movies, error } = await getLatestUploads();

    if (error) return updateNotification("error", error);

    setMovies([...movies]);
    setSlide(movies[0]);
  };

  const handleOnNextClick = () => {
    setCloneSlide(movies[count]);

    count = (count + 1) % movies.length;

    setSlide(movies[count]);

    cloneSlideRef.current.classList.add("slide-out-to-left");
    slideRef.current.classList.add("slide-in-from-right");
  };

  const handleOnPrevClick = () => {
    setCloneSlide(movies[count]);

    count = (count + movies.length - 1) % movies.length;

    setSlide(movies[count]);

    cloneSlideRef.current.classList.add("slide-out-to-right");
    slideRef.current.classList.add("slide-in-from-left");
  };

  const handleAnimationEnd = () => {
    const classes = [
      "slide-out-to-left",
      "slide-in-from-right",
      "slide-out-to-right",
      "slide-in-from-left",
    ];
    cloneSlideRef.current.classList.remove(...classes);
    slideRef.current.classList.remove(...classes);

    setCloneSlide({});
  };

  useEffect(() => {
    fetchLatestUploads();
  }, []);

  return (
    <div className="flex w-full">
      <div className="w-4/5 aspect-video relative overflow-hidden">
        <img
          ref={slideRef}
          onAnimationEnd={handleAnimationEnd}
          className="aspect-video object-cover w-full"
          src={slide.poster}
          alt=""
        />
        <img
          ref={cloneSlideRef}
          onAnimationEnd={handleAnimationEnd}
          className="aspect-video object-cover w-full absolute inset-0"
          src={cloneSlide.poster}
          alt=""
        />
        <SlideShowController onNextClick={handleOnNextClick} onPrevClick={handleOnPrevClick} />
      </div>
      <div className="w-1/5 aspect-video bg-red-500"></div>
    </div>
  );
}

const SlideShowController = ({ onNextClick, onPrevClick }) => {
  const btnClasses = "bg-primary rounded border-2 text-white text-xl p-2 outline-none";

  return (
    <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
      <button type="button" onClick={onPrevClick} className={btnClasses}>
        <AiOutlineDoubleLeft />
      </button>
      <button type="button" onClick={onNextClick} className={btnClasses}>
        <AiOutlineDoubleRight />
      </button>
    </div>
  );
};
