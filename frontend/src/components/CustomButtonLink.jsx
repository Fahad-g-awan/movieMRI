import React from "react";

export default function CustomButtonLink({ label, clickAble = true, onClick }) {
  const className = clickAble
    ? "text-highlight dark:text-highlight-dark hover:underline"
    : "text-highlight dark:text-highlight-dark cursor-default";

  return (
    <button className={className} onClick={onClick} type="button">
      {label}
    </button>
  );
}
