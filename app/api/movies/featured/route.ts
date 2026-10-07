import { API_URL } from "@/lib/api/client";

export async function GET() {
  const response = await fetch(`${API_URL}/movies/featured`, {
    cache: "no-store",
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
