import { Company, Role } from "@prisma/client";

export type MockOA = {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  questions: number;
  credits: number;
  type: string;
};

export function getMockOAs(company: Company, role: Role | null): MockOA[] {
  if (!role) return [];

  // Custom Amazon Front End Intern OAs
  if (company.slug === 'amazon' && role.name === 'Front End Engineer Intern') {
    return [
      {
        id: `${role.id}-oa-dsa`,
        title: `DSA Assessment - Set 1`,
        duration: "60 mins",
        difficulty: "Medium",
        questions: 2,
        credits: 2,
        type: "DSA"
      },
      {
        id: `${role.id}-oa-dsa-2`,
        title: `DSA Assessment - Set 2`,
        duration: "60 mins",
        difficulty: "Medium",
        questions: 2,
        credits: 2,
        type: "DSA"
      },
      {
        id: `${role.id}-oa-ui`,
        title: `Vanilla JS UI Build - Set 1`,
        duration: "30 mins",
        difficulty: "Medium",
        questions: 1,
        credits: 1,
        type: "UI Build"
      },
      {
        id: `${role.id}-oa-ui-2`,
        title: `Vanilla JS UI Build - Set 2`,
        duration: "30 mins",
        difficulty: "Medium",
        questions: 1,
        credits: 1,
        type: "UI Build"
      }
    ];
  }
  
  // Generic OAs
  return Array.from({ length: role.oaCount }).map((_, i) => ({
    id: `${role.id}-oa-${i}`,
    title: `${role.name} OA - Set ${i + 1}`,
    duration: "90 mins",
    difficulty: company.difficulty || "Medium",
    questions: 2,
    credits: 1,
    type: "Mixed"
  }));
}
