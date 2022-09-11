import React from "react";

const commonPosterUI =
  "flex justify-center items-center border border-dashed rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer";

export default function PosterSelector({ selectedPoster, label, name, onChange, className }) {
  return (
    <div>
      <input name={name} id={name} type="file" onChange={onChange} hidden />
      <label htmlFor={name}>
        {selectedPoster ? (
          <img src={selectedPoster} className={commonPosterUI + " object-cover " + className} />
        ) : (
          <PosterUI label className={className} />
        )}
      </label>
    </div>
  );
}

const PosterUI = ({ className, label }) => {
  return (
    <div className={commonPosterUI + " " + className}>
      <span className="dark:text-dark-subtle text-light-subtle">{label}</span>
    </div>
  );
};
