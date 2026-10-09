import { NextRequest } from "next/server";

import { API_URL } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  const url = new URL(`${API_URL}/search`);
  url.searchParams.set("q", query);

  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
