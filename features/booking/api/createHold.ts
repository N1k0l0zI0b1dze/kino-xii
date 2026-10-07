import type {
  BookingErrorResponse,
  CreateHoldPayload,
  HoldConflictResponse,
  HoldResponse,
} from "../types";

type HoldErrorData = BookingErrorResponse | HoldConflictResponse;

export class HoldRequestError extends Error {
  status: number;
  data: HoldErrorData;

  constructor(status: number, data: HoldErrorData) {
    super(data.message);
    this.status = status;
    this.data = data;
  }
}

export const createHold = async (
  sessionId: number,
  payload: CreateHoldPayload,
): Promise<HoldResponse> => {
  const response = await fetch(`/api/sessions/${sessionId}/holds`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new HoldRequestError(response.status, data);
  }

  return data;
};
