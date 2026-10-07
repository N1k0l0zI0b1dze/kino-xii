import type { FilterOptionsResponse } from "../types";

export const getFilterOptions = async (): Promise<FilterOptionsResponse> => {
  const response = await fetch("/api/filter-options");

  if (!response.ok) {
    throw new Error("Failed to fetch filter options");
  }

  return response.json();
};
