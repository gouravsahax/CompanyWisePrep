"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function unlockAssessment(assessmentId: string, cost: number, companySlug: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, error: "You must be logged in to unlock assessments." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { unlockedAssessments: true }
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    // Check if already unlocked
    const alreadyUnlocked = user.unlockedAssessments.some(ua => ua.assessmentId === assessmentId);
    if (alreadyUnlocked) {
      return { success: true, message: "Assessment is already unlocked." };
    }

    // Check credits
    if (user.credits < cost) {
      return { success: false, error: "Insufficient credits. Please purchase more credits to unlock this assessment.", insufficientCredits: true };
    }

    // Deduct credits and create record in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: cost } }
      }),
      prisma.unlockedAssessment.create({
        data: {
          userId: user.id,
          assessmentId: assessmentId
        }
      })
    ]);

    revalidatePath(`/company/${companySlug}`);
    return { success: true, message: "Assessment unlocked successfully!" };
  } catch (error) {
    console.error("Error unlocking assessment:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
