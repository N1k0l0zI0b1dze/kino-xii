import type { CurrentUserResponse } from "../types";

export const getCurrentUser = async (): Promise<CurrentUserResponse | null> => {
  const response = await fetch("/api/me");

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
};
