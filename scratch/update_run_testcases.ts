import { prisma } from '../lib/prisma';

async function main() {
  const questions = await prisma.dSAQuestion.findMany();
  
  for (const q of questions) {
    let submitCases: any[] = [];
    if (typeof q.submitTestCases === 'string') {
      submitCases = JSON.parse(q.submitTestCases);
    } else {
      submitCases = q.submitTestCases as any[];
    }
    
    if (submitCases && submitCases.length > 5) {
      // Leave the last 4 test cases as hidden, make the rest open
      const newRunCases = submitCases.slice(0, submitCases.length - 4);
      
      await prisma.dSAQuestion.update({
        where: { id: q.id },
        data: {
          runTestCases: newRunCases
        }
      });
      console.log(`Updated question ${q.id}: ${newRunCases.length} open, 4 hidden`);
    } else {
      console.log(`Skipped question ${q.id}: not enough test cases`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
