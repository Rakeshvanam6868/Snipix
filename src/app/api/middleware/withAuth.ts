// app/api/middleware/withAuth.ts
import { NextRequest } from "next/server";
import { authMiddleware } from "./authMiddleware";

export function withAuth(handler: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest) => {
    const user = await authMiddleware(req);
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Attach user to request object
    (req as any).user = user;

    return handler(req);
  };
}