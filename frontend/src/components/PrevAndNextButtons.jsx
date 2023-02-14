import React from "react";

export default function PrevAndNextButtons({
  className = "",
  onPrevClick,
  onNextClick,
  reachedToEnd,
}) {
  const getClassName = () => {
    return "flex justify-end items-center space-x-3 mt-5 ";
  };

  return (
    <div className={getClassName() + className}>
      <Button onClick={onPrevClick} title="Prev" disabled={reachedToEnd} />
      <Button onClick={onNextClick} title="Next" disabled={reachedToEnd} />
    </div>
  );
}

const Button = ({ title, onClick, disabled }) => {
  return (
    <>
      {!disabled ? (
        <button
          onClick={onClick}
          type="button"
          className="text-primary dark:text-white hover:underline"
        >
          {title}
        </button>
      ) : (
        <button disabled className="text-slate-500 ">
          {title}
        </button>
      )}
    </>
  );
};
