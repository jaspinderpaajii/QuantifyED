import { PrismaClient } from "@prisma/client";

declare global {
  var __quantifyedPrisma: PrismaClient | undefined;
}

export function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!global.__quantifyedPrisma) {
    global.__quantifyedPrisma = new PrismaClient();
  }

  return global.__quantifyedPrisma;
}
