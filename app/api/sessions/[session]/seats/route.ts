import { cookies } from "next/headers";

import { API_URL } from "@/lib/api/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ session: string }> },
) {
  const { session } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const response = await fetch(
    `${API_URL}/sessions/${encodeURIComponent(session)}/seats`,
    {
      cache: "no-store",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    },
  );

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
