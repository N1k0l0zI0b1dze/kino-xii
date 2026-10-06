import { RefundOrderResponse } from "../types";

export const refundOrder = async (
  orderReference: string,
): Promise<RefundOrderResponse> => {
  const response = await fetch(`/api/orders/${orderReference}/refund`, {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to refund order");
  }

  return data;
};
