import { NextRequest } from "next/server";
import {
  IS_USER_PRESENT,
  CREATE_USER,
  CREATE_JWT,
} from "@/services/user.service";
import logger from "../../../../utils/logger";

// POST /api/user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, image } = body;

    let user = await IS_USER_PRESENT(email);

    if (!user) {
      user = await CREATE_USER({ name, email, image });
    }

    const token = await CREATE_JWT(user!);

    return Response.json(
      { msg: "Login successful", token },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error(`Error registering user: ${error.message}`);
    return Response.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}