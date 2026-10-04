import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api/client";

export async function POST(request: Request) {
  const formData = await request.formData();

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    body: formData,
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
