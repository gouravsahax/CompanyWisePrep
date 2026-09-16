import { prisma } from '../lib/prisma';

async function main() {
  const questions = await prisma.dSAQuestion.findMany({
    select: { id: true, title: true, description: true }
  });
  
  for (const q of questions) {
    console.log(`\n=== ID: ${q.id} | Title: ${q.title} ===\n`);
    console.log(q.description.substring(0, 500) + '...');
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
