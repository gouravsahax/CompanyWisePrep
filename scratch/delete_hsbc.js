const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.company.deleteMany({
    where: { slug: 'hsbc' },
  });
  console.log(`Deleted ${result.count} companies matching 'hsbc'`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
