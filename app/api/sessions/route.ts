import { NextRequest } from "next/server";

import { API_URL } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const response = await fetch(`${API_URL}/sessions${request.nextUrl.search}`, {
    cache: "no-store",
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
