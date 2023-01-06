import React from "react";

export default function NotFound({ visible, text }) {
  if (!visible) return null;

  return (
    <div className="text-center text-3xl dark:text-dark-subtle text-secondary mt-7">{text}</div>
  );
}
