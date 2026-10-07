import { cookies } from "next/headers";

import { API_URL } from "@/lib/api/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ session: string }> },
) {
  const { session } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const body = await request.json();

  const response = await fetch(
    `${API_URL}/sessions/${encodeURIComponent(session)}/holds`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
