import React from "react";

export default function Title({ children }) {
  return (
    <h1 className="dark:text-white text-secondary font-semibold text-xl text-center">{children}</h1>
  );
}
