import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api/client";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, {
      status: response.status,
    });
  }

  const nextResponse = NextResponse.json(data, {
    status: response.status,
  });

  nextResponse.cookies.set("auth_token", data.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return nextResponse;
}
