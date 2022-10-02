import React from "react";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function AppSearchForm({ placeholder, onSubmit, showRestIcon, onReset }) {
  const [value, setSValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleReset = () => {
    onReset();
    setSValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        className="border-2 dark:border-dark-subtle border-light-subtle foucs:border-primary dark:focus:border-white dark:text-white transition bg-transparent rounded text-lg p-1 outline-none text-secondary"
        placeholder={placeholder}
        value={value}
        onChange={({ target }) => setSValue(target.value)}
      />
      {showRestIcon ? (
        <button
          onClick={handleReset}
          type="button"
          className="absolute top-1/2 -translate-y-1/2 right-2 text-secondary dark:text-white"
        >
          <AiOutlineClose />
        </button>
      ) : null}
    </form>
  );
}
