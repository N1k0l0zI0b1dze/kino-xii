import type { FeaturedMoviesResponse } from "../types";

export const getFeaturedMovies = async (): Promise<FeaturedMoviesResponse> => {
  const response = await fetch("/api/movies/featured");

  if (!response.ok) {
    throw new Error("Failed to fetch featured movies");
  }

  return response.json();
};
