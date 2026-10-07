import { API_URL } from "@/lib/api/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ movie: string }> },
) {
  const { movie } = await params;

  const response = await fetch(
    `${API_URL}/movies/${encodeURIComponent(movie)}`,
    {
      cache: "no-store",
    },
  );

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
