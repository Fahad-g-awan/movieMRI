import React from "react";
import { Link } from "react-router-dom";
import { BsFillSunFill } from "react-icons/bs";
import Container from "../Container";
import { useAuth, useTheme } from "../../hooks";

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const { authInfo, logoutHandler } = useAuth();
  const { isLoggedIn } = authInfo;

  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Container className="p-2">
        <div className="text-white flex justify-between items-center">
          {/* <img src="/logo.png" alt="" className="h-10" /> */}
          <Link to="/">
            <h1 className="font-semibold text-xl">MovieMRI</h1>
          </Link>

          <ul className="flex items-center space-x-4">
            <li>
              <button onClick={toggleTheme} className="dark:bg-white bg-dark-subtle p-1 rounded">
                <BsFillSunFill className="text-secondary" size={20} />
              </button>
            </li>
            <li>
              <input
                type="text"
                placeholder="Search..."
                className="border-2 dark-subtle p-1 rounded bg-transparent text-lg outline-none focus:border-white transition text-white"
              />
            </li>
            {isLoggedIn ? (
              <li>
                <button
                  onClick={logoutHandler}
                  className="font-semibold text-white text-lg"
                  to="/auth/signin"
                >
                  Log out
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link className="font-semibold text-white text-lg" to="/auth/signin">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link className="font-semibold text-white text-lg" to="/auth/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </Container>
    </div>
  );
}
