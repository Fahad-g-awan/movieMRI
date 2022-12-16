import React, { forwardRef, useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";

let count = 0;
let intervalId;

export default function HeroSlideShow() {
  const [slide, setSlide] = useState({});
  const [cloneSlide, setCloneSlide] = useState({});
  const [movies, setMovies] = useState([]);
  const [visible, setVisible] = useState(true);
  const [upNext, setUpNext] = useState([]);

  const { updateNotification } = useNotification();
  const slideRef = useRef();
  const cloneSlideRef = useRef();

  const fetchLatestUploads = async (signal) => {
    const { movies, error } = await getLatestUploads(signal);

    if (error) return updateNotification("error", error);

    setMovies([...movies]);
    setSlide(movies[0]);
  };

  const updateUpNext = (currentIndex) => {
    if (!movies.length) return;

    const upNextCount = currentIndex + 1;
    const end = upNextCount + 3;
    let newSlides = [...movies];

    newSlides = newSlides.slice(upNextCount, end);

    if (!newSlides.length) {
      newSlides = [...movies].slice(0, 3);
    }

    setUpNext([...newSlides]);
  };

  const handleOnNextClick = () => {
    pauseSlideShow();
    setCloneSlide(movies[count]);

    count = (count + 1) % movies.length;

    setSlide(movies[count]);

    cloneSlideRef.current?.classList.add("slide-out-to-left");
    slideRef.current.classList.add("slide-in-from-right");
    updateUpNext(count);
  };

  const handleOnPrevClick = () => {
    pauseSlideShow();
    setCloneSlide(movies[count]);

    count = (count + movies.length - 1) % movies.length;

    setSlide(movies[count]);

    cloneSlideRef.current.classList.add("slide-out-to-right");
    slideRef.current.classList.add("slide-in-from-left");
    updateUpNext(count);
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
    startSlideShow();
  };

  const startSlideShow = () => {
    intervalId = setInterval(handleOnNextClick, 3500);
  };

  const pauseSlideShow = () => {
    clearInterval(intervalId);
  };

  const handleOnVisibilityChange = () => {
    let visibility = document.visibilityState;

    if ((visibility = "visible")) setVisible(true);
    if ((visibility = "hidden")) setVisible(false);
  };

  useEffect(() => {
    const ac = new AbortController();

    fetchLatestUploads(ac.signal);
    document.addEventListener("visibilitychange", handleOnVisibilityChange);

    return () => {
      ac.abort();
      pauseSlideShow();
      document.removeEventListener("visibilitychange", handleOnVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (movies.length && visible) {
      startSlideShow();
      updateUpNext(count);
    } else pauseSlideShow();
  }, [movies.length, visible]);

  return (
    <div className="flex w-full">
      <div className="w-4/5 aspect-video relative overflow-hidden">
        {/* actual slide */}
        <Slide ref={slideRef} title={slide.title} src={slide.poster} id={slide.id} />

        {/* clone slide */}
        <Slide
          ref={cloneSlideRef}
          onAnimationEnd={handleAnimationEnd}
          className="absolute inset-0"
          src={cloneSlide.poster}
          title={cloneSlide.title}
          id={slide.id}
        />

        <SlideShowController onNextClick={handleOnNextClick} onPrevClick={handleOnPrevClick} />
      </div>

      {/* up next section */}
      <div className="w-1/5 space-y-3 p-3">
        <h1 className="font-semibold text-2xl text-primary dark:text-white">Up Next</h1>

        {upNext.map(({ poster, id }) => {
          return <img key={id} src={poster} className="aspect-video object-cover rounded" />;
        })}
      </div>
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

const Slide = forwardRef((props, ref) => {
  const { title, id, src, className = "", ...rest } = props;

  return (
    <Link
      to={"/movie/" + id}
      ref={ref}
      className={"w-full cursor-pointer block" + className}
      {...rest}
    >
      {src ? <img className="aspect-video object-cover" src={src} alt="" /> : null}
      {title ? (
        <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-white via-transparent dark:from-primary dark:via-transparent">
          <h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
            {title}
          </h1>
        </div>
      ) : null}
    </Link>
  );
});
