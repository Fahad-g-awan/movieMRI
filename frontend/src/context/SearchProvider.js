import React, { createContext, useState } from "react";
import { useNotification } from "../hooks";

const SearchContet = createContext();

let timeOutId;

const debounce = (func, delay) => {
  return (...args) => {
    if (timeOutId) clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export default function SearchProvider({ children }) {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);

  const { updateNotification } = useNotification();

  const search = async (method, query) => {
    const { error, results } = await method(query);

    if (error) return updateNotification("error", error);

    if (!results.length) return setResultNotFound(true);

    setResults(results);
  };

  const debounceFunc = debounce(search, 500);

  const handleSearch = (method, query) => {
    setSearching(true);

    if (!query.trime()) {
      setSearching(false);
      setResults([]);
      setResultNotFound(false);
    }

    debounceFunc(method, query);
  };

  return (
    <SearchContet.Provider value={{ handleSearch, searching, results, resultNotFound }}>
      {children}
    </SearchContet.Provider>
  );
}
