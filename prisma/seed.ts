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
    },
    {
      slug: "hsbc",
      name: "HSBC",
      logo: "/logos/hsbc.png",
      oas: 3,
      prepSheets: "Soon",
      difficulty: "Easy",
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

    if (c.slug === "hsbc") {
      await prisma.role.createMany({
        data: [
          { companyId: createdCompany.id, name: "Emerging talent software internship", oaCount: 1 },
          { companyId: createdCompany.id, name: "Trainee Software Engineer", oaCount: 2 }
        ]
      });
    }
  }

  console.log("Seeding complete: Added Amazon and HSBC");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
