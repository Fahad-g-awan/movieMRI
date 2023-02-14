import React from "react";

export default function ListWithLabel({ children, label }) {
  return (
    <div className="flex space-x-2">
      <p className="text-light-subtle dark:text-dark-subtle font-semibold">{label}</p>
      {children}
    </div>
  );
}
