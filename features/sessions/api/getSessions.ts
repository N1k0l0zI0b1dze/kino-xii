import type { SessionsResponse } from "../types";

export const getSessions = async (
  searchParams: string,
): Promise<SessionsResponse> => {
  const response = await fetch(
    `/api/sessions${searchParams ? `?${searchParams}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }

  return response.json();
};
