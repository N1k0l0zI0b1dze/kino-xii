import { NextRequest } from "next/server";

import { API_URL } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit");

  const url = new URL(`${API_URL}/movies/coming-soon`);

  if (limit) {
    url.searchParams.set("limit", limit);
  }

  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
