import React from "react";
import ActorsProvider from "./ActorsProvider";
import AuthProvider from "./AuthProvider";
import MoviesProvider from "./MoviesProvider";
import NotificationProvider from "./NotificationProvider";
import SearchProvider from "./SearchProvider";
import ThemeProvider from "./ThemeProvider";

export default function ContextProvider({ children }) {
  return (
    <NotificationProvider>
      <SearchProvider>
        <ActorsProvider>
          <MoviesProvider>
            <AuthProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </AuthProvider>
          </MoviesProvider>
        </ActorsProvider>
      </SearchProvider>
    </NotificationProvider>
  );
}
