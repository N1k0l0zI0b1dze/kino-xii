import type { MovieDetailsResponse } from "../types";

export const getMovieDetails = async (
  movie: string,
): Promise<MovieDetailsResponse> => {
  const response = await fetch(`/api/movies/${encodeURIComponent(movie)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return response.json();
};
