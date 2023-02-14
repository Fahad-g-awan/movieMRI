import React from "react";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BiMoviePlay } from "react-icons/bi";
import { FaUserNinja } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks";
import logo from "./logo.png";

export default function AdminNavbar() {
  const { logoutHandler } = useAuth();

  return (
    <nav className="w-48 bg-secondary min-h-screen border-r border-gray-300">
      <div className="flex flex-col justify-between sticky top-0 pl-5 h-screen">
        <ul>
          <li className="mb-8">
            <Link to="/">
              <img src={logo} alt="" className="sm:h-11 h-8" />
              <h1 className="p-2 text-white font-semibold text-lg">MovieMRI</h1>
            </Link>
          </li>
          <li>
            <NavItem to="/">
              <AiOutlineHome />
              <span>Home</span>
            </NavItem>
          </li>
          <li>
            <NavItem to="/movies">
              <BiMoviePlay />
              <span>Movies</span>
            </NavItem>
          </li>
          <li>
            <NavItem to="/actors">
              <FaUserNinja />
              <span>Actors</span>
            </NavItem>
          </li>
        </ul>

        <div className="flex flex-col items-start pb-5">
          <span className="font-semibold text-white">Admin</span>
          <button
            onClick={logoutHandler}
            className="flex items-center text-dark-subtle text-sm hover:text-white transition space-x-1"
          >
            <FiLogOut />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

const NavItem = ({ children, to }) => {
  const commonClasses = " flex items-center text-lg space-x-2 p-2 hover:opacity-80";
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "text-white" : "text-gray-400") + commonClasses}
    >
      {children}
    </NavLink>
  );
};
