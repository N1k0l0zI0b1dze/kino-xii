import { cookies } from "next/headers";
import { API_URL } from "@/lib/api/client";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return Response.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const response = await fetch(`${API_URL}/tickets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
