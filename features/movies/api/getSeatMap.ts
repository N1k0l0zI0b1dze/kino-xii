import type { SeatMapResponse } from "../types";

export const getSeatMap = async (
  sessionId: number,
): Promise<SeatMapResponse> => {
  const response = await fetch(`/api/sessions/${sessionId}/seats`);

  if (!response.ok) {
    throw new Error("Failed to fetch seat map");
  }

  return response.json();
};
