"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateDefaultLanguage(language: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { defaultLanguage: language }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update default language:", error);
    return { success: false, error: "An error occurred" };
  }
}
