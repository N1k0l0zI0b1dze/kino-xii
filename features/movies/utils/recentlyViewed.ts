import type { MovieDetails } from "../types";

export type RecentlyViewedMovie = Pick<
  MovieDetails,
  | "id"
  | "slug"
  | "title"
  | "runtimeMinutes"
  | "posterUrl"
  | "ageRating"
  | "genres"
>;

const RECENTLY_VIEWED_KEY = "recently-viewed-movies";
const MAX_RECENTLY_VIEWED = 10;

export const getRecentlyViewedMovies = (): RecentlyViewedMovie[] => {
  if (typeof window === "undefined") return [];

  const storedMovies = localStorage.getItem(RECENTLY_VIEWED_KEY);

  if (!storedMovies) return [];

  try {
    return JSON.parse(storedMovies) as RecentlyViewedMovie[];
  } catch {
    return [];
  }
};

export const addRecentlyViewedMovie = (movie: MovieDetails) => {
  if (typeof window === "undefined") return;

  const movies = getRecentlyViewedMovies();

  const movieToStore: RecentlyViewedMovie = {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    runtimeMinutes: movie.runtimeMinutes,
    posterUrl: movie.posterUrl,
    ageRating: movie.ageRating,
    genres: movie.genres,
  };

  const moviesWithoutCurrent = movies.filter(
    (storedMovie) => storedMovie.id !== movie.id,
  );

  const updatedMovies = [movieToStore, ...moviesWithoutCurrent].slice(
    0,
    MAX_RECENTLY_VIEWED,
  );

  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updatedMovies));
};
