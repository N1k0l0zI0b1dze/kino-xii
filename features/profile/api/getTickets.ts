import type { TicketsResponse } from "../types";

export const getTickets = async (): Promise<TicketsResponse> => {
  const response = await fetch("/api/tickets");

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return response.json();
};
