import type { MovieSessionsResponse } from "../types";

export const getMovieSessions = async (
  movie: string,
  date: string,
): Promise<MovieSessionsResponse> => {
  const response = await fetch(
    `/api/movies/${encodeURIComponent(movie)}/sessions?date=${encodeURIComponent(date)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie sessions");
  }

  return response.json();
};
