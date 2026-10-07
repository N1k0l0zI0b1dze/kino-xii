import type {
  CreateOrderPayload,
  CreateOrderResponse,
  OrderErrorResponse,
} from "../types";

export class OrderRequestError extends Error {
  status: number;
  data: OrderErrorResponse;

  constructor(status: number, data: OrderErrorResponse) {
    super(data.message);
    this.status = status;
    this.data = data;
  }
}

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> => {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new OrderRequestError(response.status, data);
  }

  return data;
};
