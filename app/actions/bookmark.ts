"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(companyId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as any).id;

  try {
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        }
      }
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id
        }
      });
    } else {
      await prisma.bookmark.create({
        data: {
          userId,
          companyId,
        }
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw new Error("Failed to toggle bookmark");
  }
}
