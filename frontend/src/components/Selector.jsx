import { getByTitle } from "@testing-library/react";
import React from "react";

export default function Selector({ name, options, value, onChange, label }) {
  return (
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary p-1 pr-10 outline-none transiton rounded bg-transparent text-light-subtle dark:text-dark-subtle dark:focus:text-white focus:text-primary"
    >
      <option value="" className="dark:text-dark-subtle bg-primary text-light-subtle text-black">
        {label}
      </option>
      {options.map(({ value, title }) => {
        return (
          <option
            key={title}
            value={value}
            className="dark:text-dark-subtle bg-primary text-light-subtle text-black"
          >
            {title}
          </option>
        );
      })}
    </select>
  );
}
