// Example: app/api/protected/route.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (!token?.backendJwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Use token.backendJwt for backend requests
  // ...
  return NextResponse.json({ msg: "OK" });
}
