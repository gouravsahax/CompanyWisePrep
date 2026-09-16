import { prisma } from '../lib/prisma';

async function main() {
  const companies = [
    {
      slug: "amazon",
      name: "Amazon",
      logo: "/logos/amazon.png",
      oas: 8,
      prepSheets: "Available",
      difficulty: "Medium",
    }
  ];

  for (const c of companies) {
    const createdCompany = await prisma.company.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });

    // Clear existing roles to avoid duplicates
    await prisma.role.deleteMany({ where: { companyId: createdCompany.id } });

    if (c.slug === "amazon") {
      await prisma.role.createMany({
        data: [
          { companyId: createdCompany.id, name: "Front End Engineer Intern", oaCount: 2 },
          { companyId: createdCompany.id, name: "Software Development Engineer I", oaCount: 3 }
        ]
      });
    }

    }
  }

  console.log("Seeding complete: Added Amazon");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
