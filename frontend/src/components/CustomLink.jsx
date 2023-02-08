import React from "react";
import { Link } from "react-router-dom";

export default function CustomLink({ children, to, busy }) {
  return (
    <Link
      to={to}
      className="dark:text-dark-subtle text-light-subtle dark:hover:text-white hover:text-primary transition"
    >
      {children}
    </Link>
  );
}
