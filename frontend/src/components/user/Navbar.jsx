import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillSunFill } from "react-icons/bs";
import Container from "../Container";
import { useAuth, useTheme } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const { authInfo, logoutHandler } = useAuth();
  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const handleSearchSubmit = (query) => {
    navigate("/movie/search?title=" + query);
  };

  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Container className="p-2">
        <div className="text-white flex justify-between items-center">
          {/* <img src="/logo.png" alt="" className="sm:h-10" /> */}
          <Link to="/">
            <h1 className="font-semibold sm:text-xl text-sm">MovieMRI</h1>
          </Link>

          <ul className="flex items-center sm:space-x-4 space-x-2">
            <li>
              <button
                onClick={toggleTheme}
                className="dark:bg-white bg-dark-subtle p-1 rounded sm:text-2xl text-lg"
              >
                <BsFillSunFill className="text-secondary" />
              </button>
            </li>
            <li>
              <AppSearchForm
                placeholder="Search"
                inputClassName="text-dark-sublte text-white focus:border-white sm:w-auto w-40 sm:text-lg"
                onSubmit={handleSearchSubmit}
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
              </>
            )}
          </ul>
        </div>
      </Container>
    </div>
  );
}
