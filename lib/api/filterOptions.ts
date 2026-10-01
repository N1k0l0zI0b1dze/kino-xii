export const getFilterOptions = async () => {
  const response = await fetch("/api/filter-options");

  if (!response.ok) {
    throw new Error("Failed to fetch filter options");
  }

  return response.json();
};
