import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const questions = await prisma.dSAQuestion.findMany({
    select: {
      id: true,
      title: true
    }
  });
  console.log(JSON.stringify(questions, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
