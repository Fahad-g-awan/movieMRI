import { useContext } from "react";
import { actorContext } from "../context/ActorsProvider";
import { AuthContext } from "../context/AuthProvider";
import { MovieContext } from "../context/MoviesProvider";
import { NotificationContext } from "../context/NotificationProvider";
import { SearchContet } from "../context/SearchProvider";
import { ThemeContext } from "../context/ThemeProvider";

export const useTheme = () => useContext(ThemeContext);
export const useNotification = () => useContext(NotificationContext);
export const useAuth = () => useContext(AuthContext);
export const useSearch = () => useContext(SearchContet);
export const useMovies = () => useContext(MovieContext);
export const useActor = () => useContext(actorContext);
