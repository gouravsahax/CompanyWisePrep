import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  const result = await prisma.dSAQuestion.deleteMany({});
  console.log(`Deleted ${result.count} DSA questions.`);
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
