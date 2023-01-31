export const validateMovie = (movieInfo) => {
  const { title, storyLine, language, releaseDate, status, type, genres, tags, cast } = movieInfo;

  if (!title.trim()) return { error: "Title is missing" };
  if (!storyLine.trim()) return { error: "Story line is missing" };
  if (!language.trim()) return { error: "Language is missing" };
  if (!releaseDate.trim()) return { error: "Release date is missing" };
  if (!status.trim()) return { error: "Movie status is missing" };
  if (!type.trim()) return { error: "Movie type is missing" };
  if (!genres.length) return { error: "Genres are missing" };
  for (let gen of genres) {
    if (!gen.trim()) return { error: "Invalid genres" };
  }
  if (!tags.length) return { error: "Movie tags are missing" };
  for (let tag of tags) {
    if (!tag.trim()) return { error: "Invalid tags" };
  }
  if (!cast.length) return { error: "Movie cast is missing" };
  for (let c of cast) {
    if (typeof c !== "object") return { error: "Invalid cast" };
  }

  return { error: null };
};
