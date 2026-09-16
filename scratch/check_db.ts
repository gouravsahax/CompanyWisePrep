import { prisma } from '../lib/prisma';

async function main() {
  const q = await prisma.dSAQuestion.findFirst({
    where: { title: "Valid Component Nesting" }
  });
  console.log("Valid Component Nesting:");
  console.log(JSON.stringify(q?.runTestCases, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
