import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Submit from "../form/Submit";

const ratings = new Array(10).fill("");

export default function RatingsForm({ busy, onSubmit }) {
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [content, setContent] = useState("");

  const handleOnMouseEnter = (index) => {
    const ratings = new Array(index + 1).fill(index);
    setSelectedRatings([...ratings]);
  };

  const handleChange = ({ target }) => {
    setContent(target.value);
  };

  const handleOnSubmit = () => {
    if (!selectedRatings.length) return;

    const data = {
      rating: selectedRatings.length,
      content,
    };

    onSubmit(data);
  };

  return (
    <div>
      <div className="p-5 dark:bg-primary bg-white rounded space-y-3">
        <div className="text-highlight dark:text-highlight-dark flex items-center relative">
          <StarsOutLined ratings={ratings} onMouseEnter={handleOnMouseEnter} />
          <div className="flex items-center absolute top-1/2 -translate-y-1/2">
            <StarsOutFilled ratings={selectedRatings} onMouseEnter={handleOnMouseEnter} />
          </div>
        </div>

        <textarea
          className="w-full h-24 border-2 p-2 dark:text-white text-primary rounded outline-none bg-transparent resize-none"
          value={content}
          onChange={handleChange}
        ></textarea>

        <Submit busy={busy} onClick={handleOnSubmit} value="Rate This Movie" />
      </div>
    </div>
  );
}

const StarsOutLined = ({ ratings, onMouseEnter }) => {
  return ratings.map((_, index) => {
    return (
      <AiOutlineStar
        className="cursor-pointer"
        onMouseEnter={() => onMouseEnter(index)}
        key={index}
        size={24}
      />
    );
  });
};

const StarsOutFilled = ({ ratings, onMouseEnter }) => {
  return ratings.map((_, index) => {
    return (
      <AiFillStar
        className="cursor-pointer"
        onMouseEnter={() => onMouseEnter(index)}
        key={index}
        size={24}
      />
    );
  });
};
