import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let adapter;
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (connectionString) {
  const pool = new Pool({ connectionString });
  adapter = new PrismaPg(pool);
}

export const prisma =
  globalForPrisma.prisma ??
  (connectionString
    ? new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      })
    : (new Proxy({}, {
        get: () => {
          throw new Error("Missing DATABASE_URL or POSTGRES_URL environment variable.");
        }
      }) as unknown as PrismaClient));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
