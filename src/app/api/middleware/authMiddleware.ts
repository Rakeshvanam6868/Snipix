import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define types
interface JwtPayload {
  user_id: string;
  email: string;
  name: string;
}

declare module "next" {
  interface NextRequest {
    user?: JwtPayload;
  }
}

export async function authMiddleware(req: NextRequest): Promise<JwtPayload | null> {
  const header = req.headers.get("authorization");

  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }

  const token = header.split(" ")[1];

  try {
    // Replace with your actual JWT secret
    const JWT_SECRET = process.env.JWT_SECRET || "snip123";

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Attach user to request
    (req as any).user = decoded;

    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}