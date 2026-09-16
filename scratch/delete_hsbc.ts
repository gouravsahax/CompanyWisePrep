import { prisma } from '../lib/prisma';

async function main() {
  const result = await prisma.company.deleteMany({
    where: { slug: 'hsbc' },
  });
  console.log(`Deleted ${result.count} companies matching 'hsbc'`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    // Some adapters require special disconnect handling, but typical prisma disconnect is fine
    // Or we just let the process exit
    process.exit(0);
  });
