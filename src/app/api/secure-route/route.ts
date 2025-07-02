// app/api/secure-route/route.ts
import { NextRequest } from "next/server";
import { withAuth } from "@/app/api/middleware/withAuth";

const GET = withAuth(async function (req: NextRequest) {
  const user = (req as any).user;

  return Response.json({
    message: "Protected content accessed",
    user,
  });
});

export { GET };