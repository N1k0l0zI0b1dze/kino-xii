import type { MoviesResponse } from "../types";

export const getNowPlayingMovies = async (): Promise<MoviesResponse> => {
  const response = await fetch("/api/movies/now-playing?limit=6");

  if (!response.ok) {
    throw new Error("Failed to fetch now playing movies");
  }

  return response.json();
};
