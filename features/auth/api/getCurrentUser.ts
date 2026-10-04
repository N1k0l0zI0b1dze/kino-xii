import type { CurrentUserResponse } from "../types";

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await fetch("/api/me");

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
};
