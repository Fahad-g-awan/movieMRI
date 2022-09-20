import React from "react";

export default function PrevAndNextButtons({ className = "", onPrevClick, onNextClick }) {
  const getClassName = () => {
    return "flex justify-end items-center space-x-3 mt-5 ";
  };

  return (
    <div className={getClassName() + className}>
      <Button onClick={onPrevClick} title="Prev" />
      <Button onClick={onNextClick} title="Next" />
    </div>
  );
}

const Button = ({ title, onClick }) => {
  return (
    <button onClick={onClick} type="button" className="text-primar dark:text-white hover:underline">
      {title}
    </button>
  );
};
