import { NextRequest } from "next/server";

import { API_URL } from "@/lib/api/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ movie: string }> },
) {
  const { movie } = await params;
  const date = request.nextUrl.searchParams.get("date");

  const url = new URL(
    `${API_URL}/movies/${encodeURIComponent(movie)}/sessions`,
  );

  if (date) {
    url.searchParams.set("date", date);
  }

  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
