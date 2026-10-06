import { cookies } from "next/headers";
import { API_URL } from "@/lib/api/client";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ order: string }> },
) {
  const { order } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return Response.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const response = await fetch(`${API_URL}/orders/${order}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
