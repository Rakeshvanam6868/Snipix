import { NextRequest } from "next/server";
import { authMiddleware } from "@/app/api/middleware/authMiddleware";

export async function GET(request: NextRequest) {
  const user = await authMiddleware(request);

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  // You can now use user.user_id or user.email
  return Response.json({
    message: "You are authenticated!",
    user,
  });
}