const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAssessments() {
  const user = await prisma.user.findFirst({
    include: {
      unlockedAssessments: {
        where: { status: 'COMPLETED' },
        orderBy: { unlockedAt: 'desc' }
      }
    }
  });

  if (!user) {
    console.log("No user found.");
    return;
  }

  console.log("User:", user.email);
  console.log("Completed assessments:", user.unlockedAssessments.length);
  
  if (user.unlockedAssessments.length > 0) {
    const latest = user.unlockedAssessments[0];
    console.log("Latest completed assessment:", latest.assessmentId);
    console.log("Analysis:", latest.assessmentAnalysis);
    
    // Reset it to UNLOCKED so they can finish it again
    await prisma.unlockedAssessment.update({
      where: { id: latest.id },
      data: { status: 'UNLOCKED' }
    });
    console.log("Reset latest assessment to UNLOCKED status.");
  }
}

checkAssessments().catch(console.error).finally(() => prisma.$disconnect());
