import type { MoviesResponse } from "../types";

export const getComingSoonMovies = async (): Promise<MoviesResponse> => {
  const response = await fetch("/api/movies/coming-soon?limit=6");

  if (!response.ok) {
    throw new Error("Failed to fetch coming soon movies");
  }

  return response.json();
};
