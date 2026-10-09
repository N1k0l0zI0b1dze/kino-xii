import type { SearchResponse } from "../types";

export const getSearchResults = async (
  query: string,
): Promise<SearchResponse> => {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }

  return response.json();
};
