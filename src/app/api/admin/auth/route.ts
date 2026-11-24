import { NextResponse } from "next/server";

function isAdminCredentialsValid(adminId: string, password: string) {
  const validId = process.env.ADMIN_STAFF_ID;
  const validPassword = process.env.ADMIN_STAFF_PASSWORD;
  return Boolean(validId && validPassword && adminId === validId && password === validPassword);
}

export async function POST(req: Request) {
  const body = (await req.json()) as { adminId?: string; password?: string };
  if (!body.adminId || !body.password) {
    return NextResponse.json({ error: "Staff ID and password are required." }, { status: 400 });
  }
  if (!isAdminCredentialsValid(body.adminId.trim(), body.password)) {
    return NextResponse.json({ error: "Invalid staff credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("printcraft_admin", "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function GET(req: Request) {
  const authenticated = req.headers.get("cookie")?.includes("printcraft_admin=authenticated");
  return NextResponse.json({ authenticated: Boolean(authenticated) });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("printcraft_admin", "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
