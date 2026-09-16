import { prisma } from '../lib/prisma';

async function main() {
  const q = await prisma.dSAQuestion.findUnique({
    where: { id: 'cmu33jmfu0000kgu9n58xu9wm' }
  });
  console.log("Description:", q?.description);
  console.log("Constraints:", q?.constraints);
  console.log("Run TestCases:", JSON.stringify(q?.runTestCases, null, 2));
  console.log("Submit TestCases:", JSON.stringify(q?.submitTestCases, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
