import { prisma } from "../lib/prisma";

async function main() {
  const questions = await prisma.dSAQuestion.findMany({
    select: { id: true, title: true, correctSolution: true }
  });
  console.log(JSON.stringify(questions, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
