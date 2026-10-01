import { API_URL } from "../client";

export async function GET() {
  const response = await fetch(`${API_URL}/filter-options`);

  if (!response.ok) {
    return Response.json(
      {
        message: "Failed to fetch filter options",
        status: response.status,
        statusText: response.statusText,
      },
      { status: response.status },
    );
  }

  const data = await response.json();

  return Response.json(data);
}
