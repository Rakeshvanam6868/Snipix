import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger";

const prisma = new PrismaClient();

// Check if user exists
export async function IS_USER_PRESENT(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    logger.error("Error checking user presence:", error);
    throw error;
  }
}

// Create a new user
export async function CREATE_USER( {
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) {
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        image,
        password: "", // Provide a default or hashed password as required by your schema
      },
    });
    return newUser;
  } catch (error) {
    logger.error("Error creating user:", error);
    throw error;
  }
}

// Generate JWT token
export async function CREATE_JWT(user: {
  id: number;
  name: string;
  email: string;
}) {
  const JWT_SECRET = process.env.JWT_SECRET || "snip123";

  const payload = {
    user_id: user.id.toString(),
    name: user.name,
    email: user.email,
  };

  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    logger.info(`Generated token => ${token}`);
    return token;
  } catch (error) {
    logger.error("Error generating JWT:", error);
    throw error;
  }
}